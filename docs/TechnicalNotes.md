# Technical Notes

## Critical CSS Injection

To prevent a flash of unstyled content (FOUC) when the page first loads, a `<style>` block is injected into the `<head>` of `index.html` at transform time by the `injectCriticalThemeCSS` Vite plugin defined in `vite.config.ts`.

The plugin runs during both `pnpm dev` and `pnpm build`. It reads two source files at transform time to derive the injected styles:

| Source                    | What is read                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| `src/styles/index.css`    | `--color-page-bg` value for every `[data-theme]` selector           |
| `src/config/constants.ts` | `DEFAULT_THEME` identifier, used to set `:root { --color-page-bg }` |

The resolved CSS is injected as a `<style>` tag prepended to `<head>`. It contains per-theme background color rules, `body { background-color: var(--color-page-bg) }`, `#root { visibility: hidden }` (so the page is invisible until the full CSS bundle arrives), and the critical `@font-face` declaration for the Wipeout3 font.

Because the values are derived from the actual CSS and constants files, adding or modifying a theme in `index.css` is automatically reflected in the injected block with no manual updates required.

## Widescreen Layout Constraints

Modals are always centered and capped at `1730px` regardless of the `wideCenter` setting, keeping the close button and content within a predictable area on any screen size.

The footer bar is always capped at `1730px` to keep the navigation controls, sound toggle, and settings button accessible on ultra-wide screens, but is only centered when `wideCenter` is enabled.

## Modal Overlays Option

The `modal` option toggle is hidden in the Options menu (`OptionsAccordion`) on breakpoints below `lg`, as these are likely touch-enabled viewport sizes where pop-up windows are not supported — modals are always used there regardless of the setting.

## Animation Performance

CSS animations are driven by `transform` and `opacity` exclusively, keeping all motion on the GPU compositor thread and avoiding layout or paint work.

`will-change: transform` is applied to elements that animate on a recurring basis (e.g. marquees, hover transitions, icon cycling) so the browser can promote them to their own compositor layer ahead of time.

JavaScript-driven animations use `requestAnimationFrame` rather than `setInterval` or `setTimeout`, ensuring frame timing aligns with the display refresh rate.

Heavy or off-screen animations (e.g. the 2097/XL vertical marquee, banner videos) are paused when they leave the viewport via `IntersectionObserver`, freeing compositor resources for on-screen content.

## Touch Navigation Modes

Menu links on touch devices support two navigation modes, implemented in `src/components/WipeoutLink/WipeoutLink.tsx`.

| Mode                   | Trigger                                                         | Behavior                                                                                                                                                                                |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wait-for-animation** | Default                                                         | First tap plays the hover animation; navigation fires automatically when the animation ends. A second tap while the animation is playing skips the remainder and navigates immediately. |
| **Immediate**          | `disableHoverAnimations` option **or** `prefers-reduced-motion` | Taps navigate instantly with no animation.                                                                                                                                              |

## Accessibility

### Known Issue: Safari Tab Navigation

Safari on macOS excludes `<a>` and `<button>` elements from the Tab key sequence by default. Two user-side settings control this:

| Setting                                           | Location                         |
| ------------------------------------------------- | -------------------------------- |
| **Keyboard navigation**                           | macOS System Settings → Keyboard |
| **Press Tab to highlight each item on a webpage** | Safari → Settings → Advanced     |

Both default to **off**, meaning most Mac users can only Tab into text inputs and selects — links and buttons are silently skipped. Users on Safari who need full keyboard navigation should enable both settings above.

### Modal Accessibility via Native `<dialog>`

All modals (`DisclaimerModal`, `SettingsModal`, `Modal`, `DiscardConfirmOverlay`) use the native `<dialog>` element opened with `.showModal()`. This single API call provides several accessibility features:

| Feature              | How the browser handles it                                                          |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Focus trapping**   | Tab wraps within the dialog automatically                                           |
| **Inert background** | Everything behind the top-layer dialog becomes `inert` — no focus or pointer events |
| **Screen readers**   | Background content is hidden from assistive technology                              |
| **Scroll blocking**  | Background content does not scroll while the dialog is open                         |
| **Top layer**        | The dialog renders above all other content without `z-index` management             |

`BaseDialog` also sets `aria-modal="true"` on every `<dialog>` element. Native `.showModal()` already implies modal semantics in current browsers, but `aria-modal` makes the role explicit for screen readers that do not yet fully honour the native attribute, and it future-proofs against any assistive technology that inspects ARIA attributes before querying browser-native state.

Nested dialogs (e.g. `SettingsModal` → `DiscardConfirmOverlay`) are handled natively: the inner `.showModal()` promotes the confirm overlay to the top layer and automatically makes the parent dialog inert. When the inner dialog closes, focus returns to the parent.

The shared `useShowModal` hook (`src/hooks/useShowModal.ts`) calls `.showModal()` on mount and `.close()` on cleanup.

#### Suppressing the native `cancel` event

Each dialog suppresses the native `cancel` event (which the browser fires when Escape is pressed) via a **direct DOM listener** rather than React's `onCancel` prop:

```ts
dialog.addEventListener("cancel", (e) => e.preventDefault());
```

`onCancel` cannot be used here because `cancel` does not bubble, and React's synthetic event delegation only intercepts bubbling events — so it never fires for portaled dialogs. The direct listener is attached inside `useShowModal` and removed on teardown. Escape handling is left entirely to the centralised `EscapeNavigation` stack (see [EscapeNavigation and Stacked Escape Handling](#escapenavigation-and-stacked-escape-handling) below).

#### Focus management on open and close

The guiding principle is that **focus indicators should only be visible when the user is actually navigating by keyboard**. This preserves the original Flash website's artistic intent — the Wipeout 3 site was a carefully designed visual experience, and focus rings appearing on mouse clicks would introduce unstyled browser chrome that the original never had. Beyond fidelity, a focus ring on a button that someone just clicked with a mouse is noise: it signals "you can reach this with Tab" when the user already knows exactly where they are from their cursor position. Conversely, keyboard users have no cursor, so a visible focus indicator and a predictable focus position are their primary means of orientation.

The CSS `:focus-visible` pseudo-class encodes exactly this intent. Every interactive element in the dialogs carries `focus-visible:ring-*` classes and no unconditional `ring-*`. Chromium 86+, Firefox 85+, and Safari 15.4+ all correctly suppress `:focus-visible` after pointer-triggered programmatic focus, so moving focus into a pointer-opened dialog does not produce a visible ring for mouse users — only for keyboard users.

Modals that auto-open without a preceding pointer event (e.g. `DisclaimerModal` on page load) have no pointer context, so the browser's heuristic treats programmatic focus as keyboard-initiated and the ring appears. For these cases, `useShowModal` accepts an opt-in `focusVisible: false` option that is forwarded to the `.focus()` call, explicitly suppressing `:focus-visible` on the initial target. This must not be used on modals that can be opened by keyboard (e.g. `DiscardConfirmOverlay`), where the ring correctly signals the focused safe-action to a keyboard user.

**On open:** before calling `.showModal()`, the opener element is unconditionally blurred:

```ts
previousActiveElement?.blur();
```

This prevents the trigger's focus ring from bleeding through the backdrop overlay.

After `.showModal()`, focus is first parked on the dialog container so VoiceOver registers the new top-layer context:

```ts
dialog.setAttribute("tabindex", "-1");
dialog.focus();
```

#### Accessible name and VoiceOver announcement

`Modal` always computes an accessible name, even when neither `label` nor `labelledBy` is supplied:

```ts
const dialogName = label ?? (labelledBy ? undefined : "Dialog");
```

If `labelledBy` is set, the element it points to provides the name; otherwise `dialogName` is either the explicit `label` string or the fallback `"Dialog"`. This ensures every `Modal` instance has a non-empty accessible name in the accessibility tree.

VoiceOver reads the dialog's accessible name as part of the context announcement, but only if focus lands on the dialog container or an element that can relay that name. To make the name audible as the very first thing VoiceOver announces — regardless of where the `initialFocus` strategy ultimately moves focus — `Modal` renders a visually hidden `<span>` containing `dialogName` and uses it as the `initialFocusRef` target when no other ref is specified:

```tsx
{
  dialogName && !initialFocusRef && (
    <span ref={labelFocusRef} tabIndex={-1} className="sr-only">
      {dialogName}
    </span>
  );
}
```

VoiceOver reads the span's text content on focus, giving users an immediate spoken announcement of the dialog's purpose before any interactive content is reached. The span is only rendered — and only used as the focus target — when no explicit `initialFocusRef` has been provided; callers that supply their own ref (e.g. `SettingsModal` pointing at its heading) get their own announcement through that element instead.

`BaseDialog` now exposes an explicit initial-focus API that is forwarded into `useShowModal`:

```ts
type InitialFocusStrategy = "dialog" | "first-control" | "safe-action";

interface BaseDialogProps extends ComponentPropsWithoutRef<"dialog"> {
  initialFocus?: InitialFocusStrategy;
  initialFocusRef?: RefObject<HTMLElement | null>;
}
```

After the dialog receives initial container focus, `useShowModal` applies the requested strategy after a short delay:

- `dialog` keeps focus on the dialog itself, which is best for larger or more complex dialogs where users need to orient first.
- `first-control` moves focus to the first interactive descendant.
- `safe-action` focuses the element marked with `data-dialog-safe-action`, falling back to the dialog if none exists.
- `initialFocusRef` overrides all strategy heuristics and focuses an explicit element instead. If that element is not normally focusable, `useShowModal` temporarily adds `tabindex="-1"` so it can receive programmatic focus.

`safe-action` is for choice dialogs where one option is clearly lower-risk than the others. In plain language: focus the option that leaves the user safest if they activate it accidentally. For example, the unsaved-changes confirm focuses `Edit` rather than `Discard`.

Current usage:

- `SettingsModal` uses `initialFocusRef` to focus its `Options` heading explicitly, which is more reliable than leaving focus on the dialog container in VoiceOver.
- `DiscardConfirmOverlay` uses `initialFocus="safe-action"` and marks `Edit` as the safe action.
- `DisclaimerModal` uses `initialFocus="first-control"` because it is short, informational, and has a single acknowledgment action.
- Generic `Modal` falls back to the shared default of `dialog`.

`setTimeout` (not `requestAnimationFrame`) is required because VoiceOver needs actual processing time — not just one paint frame — to absorb the top-layer promotion before it will follow a focus change. Without the delay, VoiceOver does not announce the newly focused element inside the dialog.

This follows the ARIA APG dialog pattern while avoiding a blanket "first tabbable element" rule. The dialog always receives focus first for announcement and context, then each modal chooses a focus target based on its semantics rather than raw DOM order.

This is intentionally different from route-change focus. Full page navigations prefer the first `<h1>` because the page heading is the best orientation cue for a new document. Dialogs that use `initialFocusRef` can point at their `<h1>` for the same effect, or at a different element when that better suits the dialog's layout.

**See also:** [Where to Put Focus When Opening a Modal Dialog — Adrian Roselli](https://adrianroselli.com/2025/06/where-to-put-focus-when-opening-a-modal-dialog.html) for the accessibility rationale behind context-sensitive focus strategies.

**On close:** focus is restored to whichever element was active when the dialog opened (typically the button that triggered it). This follows the ARIA dialog pattern and ensures screen readers (including VoiceOver) regain their previous context after dismissal. Without restoration, keyboard and screen reader users would land on `<body>` or lose focus entirely, forcing them to Tab back through the page from the top. The restoration runs inside a `requestAnimationFrame` to let React finish unmounting, with a fallback to `<main>` if the opener has since been removed from the DOM. A secondary effect: retaining a dead reference to a removed dialog element as the active element causes subsequent Escape presses to miss the `EscapeNavigation` handler, so the blur-before-close step in the cleanup also guards against that. Pointer users see no visible focus ring thanks to `:focus-visible` — programmatic focus after a pointer interaction does not match `:focus-visible` in any browser this project targets.

#### SettingsModal key-remount on reopen

`Footer` tracks a `settingsModalKey` counter and passes it as `key` to `SettingsModal`:

```tsx
const handleOpenSettings = () => {
  setSettingsModalKey((prev) => prev + 1);
  setIsSettingsOpen(true);
};

{isSettingsOpen && <SettingsModal key={settingsModalKey} ... />}
```

Because `SettingsModal` is conditionally rendered, each unmount/remount cycle already triggers a fresh `useShowModal` effect. The key increment is belt-and-suspenders: it guarantees a genuinely new component instance even if React's reconciler would otherwise reuse the existing tree (e.g. in future refactors), ensuring that `useShowModal` captures the correct opener element on every open.

### Menu Modal History Management

When a menu item opens a modal (e.g. Screenshots, Contact, movie clips), the `Menu` component needs to make the browser back button close the modal instead of navigating away from the page. Two strategies are used, chosen automatically based on the current history stack:

| Mode | When chosen | How it works |
| --- | --- | --- |
| **`intercept`** | Normal in-app navigation (history index > 0) | No history entry is pushed. A `popstate` listener catches the browser back button, closes the modal, and immediately calls `history.forward()` to cancel the traversal. Because no entry was added, closing the modal leaves no stale forward-stack entry. |
| **`synthetic`** | First-entry / direct-load visits (history index = 0) | A fake `pushState({ modal: true })` entry is added so the back button has somewhere to land. Closing the modal pops it with `history.back()`. This fallback is necessary because there is no prior same-document entry to intercept on the first visit. |

The strategy is tracked in a `ModalHistoryMode` ref (`"none" | "synthetic" | "intercept"`) inside `Menu`. A helper function `canInterceptBrowserBack()` inspects `window.history.state.idx` (set by React Router) to decide which path to take.

Focus is explicitly restored to the menu button that opened the modal. `Menu` captures the opener via `event.currentTarget` and calls `.focus({ preventScroll: true })` on it after every close path (user dismiss, Escape, or browser back button). For `Suspense`-wrapped route modals (e.g. Screenshots), the injected `onClose` is threaded through the `Suspense` boundary so the inner page component receives it correctly.

### EscapeNavigation and Stacked Escape Handling

`src/components/EscapeNavigation.tsx` wraps the application in a React context that exposes a push/pop handler stack. Components that need to intercept Escape (modals, overlays) register a callback on mount and unregister on unmount. The single `window` keydown listener always invokes the _most recently registered_ handler; when the stack is empty it falls back to `navigate(-1)` (i.e. browser back-navigation), unless the user is already on the home page.

The keydown listener reads `navigate` and `location.pathname` through refs so it is attached exactly once and never torn down/re-attached on route changes. The context value is memoised so consumer `useEscapeKey` effects only fire on mount/unmount, not on every navigation. Both `navigate(-1)` and handler paths call `e.preventDefault()` to suppress the native `cancel` event that would otherwise fire on any open `<dialog>`.

This design keeps Escape behaviour composable across nested dialogs without each layer needing direct knowledge of its siblings. It also means the suppression of the native `cancel` event in `useShowModal` is required — without it, the browser would silently close the dialog before `EscapeNavigation`'s keydown listener fires, breaking the centralised stack.

### Route-Change Focus Management

On every pathname change, `useRouteChangeFocus` (called from `Layout`) resets the scroll position of `<main>` and moves focus into the new page. The behaviour differs based on navigation direction, detected via React Router's `useNavigationType()`:

**Forward navigation (PUSH / REPLACE):** focus lands on the first `<h1>` inside `<main>` so VoiceOver announces the page heading immediately on arrival. Falls back to `<main>` itself when no `<h1>` is present.

**Back / forward navigation (POP):** focus is restored to the element the user originally interacted with — typically the menu link they clicked — so keyboard users return to a predictable position. A `focusin` listener continuously records the last focused element per pathname into a `Map`, storing both the DOM element reference and an ancestor-scoped CSS selector as fallback. On POP navigation, the hook first checks whether the original element is still connected to the DOM (true for persistent shell elements like footer links) and focuses it directly — this avoids selector ambiguity when the same route is linked from multiple places. If the element has been unmounted (route-specific content), it falls back to the CSS selector, which is scoped to the nearest identifiable ancestor (via `id` or `aria-label`) to reduce the chance of matching a duplicate. If no match is found (element removed, selector stale, etc.), focus falls back to the `<h1>` / `<main>` strategy above.

Focus is preferred on the first `<h1>` inside `<main>` rather than `<main>` itself. When VoiceOver focuses a landmark (`<main>`), it announces only the landmark type — the user then has to navigate forward to hear any content. When VoiceOver focuses an `<h1>`, it reads the heading text immediately, giving the user a spoken page title on every navigation.

`<main>` still carries `tabIndex={-1}` as a fallback for two cases:

1. **Pages without an `<h1>`** — focus lands on `<main>` directly.
2. **Modal fallback target** — when a modal's original opener unmounts while the dialog is open (e.g. navigating away during a modal), `useShowModal`'s teardown falls back to `document.querySelector("main")` for focus restoration rather than dropping focus on `<body>`.

#### Pages that portal their content out of `<main>`

Some pages (`WipeoutPage`, `XLPage`) render their visible content via `createPortal` / `VerticalBillboard` so it escapes the `LowResolution` CSS `scale()` transform context and stays correctly positioned relative to the real viewport. This leaves `<main>` with no rendered children, so VoiceOver would announce "empty main" after a route change.

Each such page adds a visually-hidden `<h1 className="sr-only">` as the first child. The heading is invisible but present in the accessibility tree, so `Layout`'s focus logic finds it and VoiceOver reads the page title on arrival.

## Converting Complex Flash Animations

### SVGs

Where possible, efforts were made to convert Flash animations to animated SVGs. These maintain the vector nature of the original animation, are easy to work with and make interactive, and remain accessible in modern browsers. This applies to pages such as the Teams landing page and Tracks, for example.

For animations that could not be reproduced as SVGs, see [SVG to Video Converter](#svg-to-video-converter).

## SVG to Video Converter

For Flash animations that could not be faithfully reproduced as animated SVGs, a custom shell script (`scripts/svg-to-video/animate_svgs.sh`) converts a numbered sequence of SVG frames into alpha-channel video files suitable for use in the browser.

The script produces three output formats to cover cross-browser transparency support:

| File                    | Codec       | Notes                                  |
| ----------------------- | ----------- | -------------------------------------- |
| `output_alpha.webm`     | VP9         | Best for web; Chrome and modern Safari |
| `output_alpha.mov`      | ProRes 4444 | Maximum Safari compatibility           |
| `output_alpha_hevc.mov` | HEVC        | Apple-native; best quality/size ratio  |

**Requirements:** `ffmpeg` plus one SVG rasteriser — ImageMagick, Inkscape, or librsvg.

**Usage:**

```bash
# Interactive prompts
./animate_svgs.sh

# With explicit dimensions
./animate_svgs.sh /path/to/svgs -w 418 -h 393
```

Key configuration variables at the top of the script:

- `DURATION_PER_FRAME` — how long each SVG frame is displayed (default: `0.5s`)
- `FPS` — output frame rate (default: `30`)

For full usage, flags, and troubleshooting see [`scripts/svg-to-video/README.md`](../scripts/svg-to-video/README.md).
