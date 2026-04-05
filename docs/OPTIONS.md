# Options

Options cover the quality of life improvements in wipeout3.com: React Edition that represent opinionated departures from the original Flash experience. They are managed through client-side options stored in the browser's `localStorage` under the key `wipeout3-options`. Options are defined in `src/config/options.ts`.

## Options Menu

The Options menu is accessible via the settings icon in the UI. It displays all toggleable options as labelled on/off switches.

- **Pure Mode** and **React Mode** appear as presets at the bottom of the panel. When a preset is active, individual toggles are disabled.
- Clicking **Apply** saves the current configuration to `localStorage` and reloads the page.
- Clicking **Cancel**, pressing `Escape`, or clicking the overlay closes the menu without saving.

## Pure Mode

Pure Mode is a preset that restores the app to its original Flash website configuration. When enabled, all individual options are overridden to replicate the 1999 Wipeout 3 Flash experience as closely as possible.

When active, Pure Mode applies the following overrides:

| Option                   | Pure Value | Effect                                     |
| ------------------------ | ---------- | ------------------------------------------ |
| `bannersFlash`           | `true`     | Flash banners via Ruffle emulator          |
| `contactModal`           | `false`    | mailto: link instead of contact modal      |
| `countdownToggle`        | `false`    | Countdown pause button hidden              |
| `disableHoverAnimations` | `false`    | Hover animations enabled                   |
| `modal`                  | `false`    | Pop-up windows instead of modals           |
| `reactEditionCredits`    | `false`    | React Edition credits hidden               |
| `remapL`                 | `false`    | "l" / "L" remapping disabled               |
| `soundToggle`            | `false`    | Sound toggle hidden                        |
| `swipeHints`             | `false`    | Swipe hints disabled                       |
| `wideCenter`             | `false`    | Widescreen centering disabled              |
| `xsText`                 | `true`     | Extra-small text as it originally appeared |

> [!NOTE]
> When Pure Mode is active, individual option toggles are locked. To customize individual options, disable Pure Mode first.

## React Mode

React Mode is a preset that activates the default React Edition configuration. It is the counterpart to Pure Mode — the two are mutually exclusive, and enabling one disables the other.

When active, React Mode applies the following overrides:

| Option                   | React Value | Effect                                     |
| ------------------------ | ----------- | ------------------------------------------ |
| `bannersFlash`           | `false`     | MP4 video banners instead of Flash         |
| `contactModal`           | `true`      | Contact form modal instead of mailto: link |
| `countdownToggle`        | `true`      | Countdown pause button visible             |
| `disableHoverAnimations` | `false`     | Hover animations enabled                   |
| `modal`                  | `true`      | Modals instead of pop-up windows           |
| `reactEditionCredits`    | `true`      | React Edition credits visible              |
| `remapL`                 | `false`     | "l" / "L" remapping disabled               |
| `soundToggle`            | `true`      | Sound toggle visible                       |
| `swipeHints`             | `true`      | Swipe hints enabled                        |
| `wideCenter`             | `false`     | Widescreen centering disabled              |
| `xsText`                 | `true`      | Extra-small text as it originally appeared |

## `bannersFlash`

> [!CAUTION]
> Experimental feature

Banners are optionally served with Flash. When enabled, the Ruffle Flash emulator (a WebAssembly-based decompiler built in Rust) loads the original `.swf` banner animations instead of the `mp4` video replacements.

Please note that this feature is still experimental. It has not been fully tested but should work in most cases.

Concerns:

- Some ad blockers restrict access to `.swf` files, so they have been renamed to `.fws`. This may ultimately prove problematic.
- The Ruffle Flash emulator is very capable, but may not accurately reproduce the original animation.
- Browsers may block the Ruffle Flash emulator from loading because it executes external content (due to CSP restrictions, enterprise security policies, browser extensions, etc.).
- Ruffle requires a large `.wasm` file to be downloaded (approximately 4.5 MB when gzipped), managed by the `RufflePreloader` component. On slower connections, this may cause a delay in rendering the banners.

## `contactModal`

Replaces the "Contact" `mailto` link in the Pitlane section with a modal contact form powered by [Web3Forms](https://web3forms.com/).

Setting to `false` will restore the original `mailto` behavior (`webmaster@psygnosis.com`).

To use the contact form, the `VITE_WEB3FORMS_ACCESS_KEY` environment variable must be set (see [Environment Setup](../CONTRIBUTING.md#environment-setup) in the contributing guide).

## `countdownToggle`

Enables a play/pause button on the News countdown to enhance accessibility and accommodate sensitivity to motion.

Setting to `false` will hide the countdown toggle button entirely, restoring the original design.

## `disableHoverAnimations`

Disables hover animations on menu links.

When enabled, the `<video>` element is not rendered and no network request is made for the animation asset.

- **Desktop:** hover animations never play.
- **Touch:** a single tap navigates immediately instead of playing the animation and waiting for it to finish.

This option is also respected when `prefers-reduced-motion` is active, in which case animations are already skipped regardless of this setting.

Setting to `false` (default) re-enables hover animations: desktop users see them on hover, and touch users see a brief animation before navigation completes.

## `modal`

Replaces pop-up windows with modals for a more modern, accessible experience.

Setting to `false` will restore the original pop-up windows on the `lg` breakpoint only.

Most modern browsers block pop-up windows by default, degrading the user experience.

## `reactEditionCredits`

Setting this to `true` exposes the new credits for the React Edition of the Wipeout 3 website on the credits page.

## `remapL`

Enables remapping of every "l" / "L" character to the WipEout 3 custom glyph stored in the Private Use Area of the font (`U+E041`). Unlike the standard lowercase "l" which has a hook at the base, this glyph renders as a plain vertical line, matching the font's geometric aesthetic.

Application of this substitution is inconsistent across the original Flash website — different pages and menus handle "l" / "L" differently — so this option is opt-in and defaults to `false`.

Setting to `true` applies the substitution consistently wherever `remapL` / `remapLNode` is called.

## `soundToggle`

Enables a sound toggle button for accessibility.

Setting to `false` will hide the sound toggle button entirely, restoring the original design. Sound will continue to work within the constrictions of the browser's autoplay policy.

### Sound & Autoplay

Per the [**autoplay** web standards](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide), autoplaying media, such as audio, is blocked at the browser level. This means that the sound effects on the Wipeout 3 website will not play unless the user interacts with the page.

After a user's first interaction, `audio` is enabled by way of the `soundManager` class, which is built on top of [Howler.js](https://howlerjs.com/).

Consequently, users with sound enabled will not hear the `hover` or `click` sounds until they interact with the page (by clicking, tapping, pressing keys, etc.).

#### Autoplay policies

- [Chrome](https://developer.chrome.com/blog/autoplay/)
- [Firefox](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
- [Safari](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)

## `swipeHints`

Shows animated swipe-direction chevrons on the Screenshots gallery when a touch-capable device is detected.

The hint auto-dismisses on first touch, and will not reappear once the user begins swiping between screenshots or sections.

When enabled, tapping the left or right half of the photo also navigates to the previous or next screenshot respectively, as an alternative to swiping.

Setting to `false` disables both the hint and the tap zones entirely.

## `wideCenter`

Centers the app content horizontally on wide displays within a constrained column.

When enabled, the main content area is capped at `1730px` and centered within the viewport, preventing the layout from stretching across ultra-wide screens.

When disabled (default), the main content area has no maximum width and stretches naturally to fill the viewport, preserving the original Flash website's full-width layout.

Modals are always centered and capped at `1730px` regardless of this setting. The footer bar is also always capped at `1730px` to keep navigation controls accessible on wide screens, but is only horizontally centered when `wideCenter` is enabled.

## `xsText`

Enables small font sizes as they originally appeared on the Wipeout 3 Flash website, sacrificing legibility and accessibility on modern, higher resolution screens.

## Technical Notes

For implementation details see [Technical Notes](TechnicalNotes.md).
