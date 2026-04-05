# Quality of Life Improvements

wipeout3.com: React Edition includes a number of quality of life improvements over the original Flash website.

Most improvements are enabled by default. Where a change represents an opinionated departure from the original Flash experience, it is configurable via the [Options](OPTIONS.md) menu, allowing users to tailor the experience to their preferences or restore the original behavior.

## General

- Mobile-enhanced
  - Added support for mobile devices & multiple screen resolutions (also known as Responsive Web Design).
  - Added touch-enabled hover animations on menu links, with an option to disable them via [`disableHoverAnimations`](OPTIONS.md#disablehoveranimations).

- Accessibility
  - Added a sound toggle button in the footer.
  - Added keyboard navigation, including support for `Tab` and `Escape` keys.
    - `Escape` key handler to navigate to the previous page or close a modal.
  - Added `aria` attributes for assistive technologies.
  - Added support for `prefers-reduced-motion`.

- Modals
  - Optional modal support to replace pop-up windows which are typiclly blocked in modern browsers.
    - Pop-ups can be enabled with the [`modal`](OPTIONS.md#modal) option to restore the original behavior.
      - Pop-up windows are only available at the `lg` breakpoint.

- Custom pages
  - Added a 404 server error page.
  - Forum & Chat:Room
    - Added a "Not Archived" message featuring Angryman™ for pages that are unavailable because they have not been archived.

- Widescreen monitor support
  - An optional [`wideCenter`](OPTIONS.md#widecenter) setting centers the main content within a `1730px` max-width column on wide monitors.
    - When disabled (default), the main content area has no maximum width and stretches naturally to fill the viewport, preserving the original Flash website's full-width layout.
  - Modals are always centered and capped at `1730px` regardless of the `wideCenter` setting, keeping the close button and content within a predictable area on any screen size.
  - The footer bar is always capped at `1730px` to keep the navigation controls, sound toggle, and settings button accessible on ultra-wide screens, but is only centered when `wideCenter` is enabled.

- Animation boosts (targeting 60fps)
  - Animations across the site have been tuned for smoother, more fluid playback — targeting 60fps where doing so does not stray from the artistic intent of the original Flash website.
  - CSS animations are driven by `transform` and `opacity` exclusively, keeping all motion on the GPU compositor thread and avoiding layout or paint work.
  - `will-change: transform` is applied to elements that animate on a recurring basis (e.g. marquees, hover transitions, icon cycling) so the browser can promote them to their own compositor layer ahead of time.
  - JavaScript-driven animations use `requestAnimationFrame` rather than `setInterval` or `setTimeout`, ensuring frame timing aligns with the display refresh rate.
  - Heavy or off-screen animations (e.g. the 2097/XL vertical marquee, banner videos) are paused when they leave the viewport via `IntersectionObserver`, freeing compositor resources for on-screen content.

- Footer navigation naming consistency
  - Updated the naming conventions of certain footer menu items to align with the rest of the website.
    - Sub-menu titles (e.g., "Pitlane Select," "History Select," etc.) are now consistently contextualized with their respective parent menu items.

## Page-specific

- News
  - Added a pause button on the countdown for accessibility.
    - This can be configured with the [`countdownToggle`](OPTIONS.md#countdowntoggle) option.

- Movie Clips
  - Now presented as modals, replacing the pop-up windows previously used on the Flash website.
    - Pop-ups can be enabled with the [`modal`](OPTIONS.md#modal) option to restore the original behavior.
  - Doubled movie clip dimensions to `320 x 240`, sacrificing some sharpness.
  - Added a play/pause button to movie clips (when the [`modal`](OPTIONS.md#modal) option is enabled).

- Contact
  - By default, "Contact" opens a modal contact form powered by [Web3Forms](https://web3forms.com/). The original `mailto` behavior can be restored by disabling the [`contactModal`](OPTIONS.md#contactmodal) option.
    - On the original Flash website, clicking "Contact" opened a `mailto` link to `webmaster@psygnosis.com`. This can be disorienting for modern users, as it launches the system mail client for an email address that is no longer valid.

- Subscription
  - Left a `console.info` message informing users that subscription is offline, and no data is collected.

- Wallpapers
  - Now presented as modals, replacing the pop-up windows previously used on the Flash website.
    - Pop-ups can be enabled with the [`modal`](OPTIONS.md#modal) option to restore the original behavior.
  - On mobile, only the highest-resolution wallpaper (`1084 x 768 px`) is presented.
    - At smaller screen sizes, lower-resolution wallpapers appear identical to higher-resolution ones, making the choice of wallpaper sizes seem arbitrary.

- Screenshots
  - Converted to modals, replacing the pop-up windows previously used on the Flash website.
    - Pop-ups can be enabled with the [`modal`](OPTIONS.md#modal) option to restore the original behavior.
  - Added swipe gestures to allow users to navigate between screenshots on mobile.
  - Added keyboard navigation to allow users to navigate between screenshots with the arrow keys.
  - Added optional swipe hints: animated `‹` `›` chevrons that appear briefly when the Screenshots page is opened on a touch device, hinting that swipe gestures are supported.
    - The hint auto-dismisses on first touch and will not reappear once the user begins swiping. Controlled by the [`swipeHints`](OPTIONS.md#swipehints) option.
  - When [`swipeHints`](OPTIONS.md#swipehints) is enabled, tapping the left or right half of the photo navigates to the previous or next screenshot respectively.

- Screensavers
  - The Mac screensaver link has been disabled because its archive is currently unavailable. The `.sea.hqx` files previously saved from the Kleber archive are Kleber-related HTML files and not the original Wipeout 3 binary screensaver files.

- Developers
  - Implemented a prop to toggle the icon cycling animation effect: `cycleEnabled`.
    - The cycling effect can be intense or fast for some users. To ensure accessibility, the cycling effect is disabled—regardless of the `cycleEnabled` prop—if the user has enabled `prefers-reduced-motion`.

- 2097/XL Vertical Marquee
  - Now pauses on hover/touch. If user has `prefers-reduced-motion`, the animation is paused by default, and plays on hover/touch.

- Banners
  - A new section called "Banners" has been added to the Pitlane section. This section contains a collection of animated logo marquees that were originally presented on the Wipeout 3 Flash website as pop-up windows that randomly appeared as you navigated the website.
    - The banners are now presented as modals, replacing the pop-up windows previously used on the Flash website.
      - Pop-ups can be enabled with the [`modal`](OPTIONS.md#modal) option to restore the original pop-up behavior.
  - To provide a more accessible and modern experience, the banners have been converted to `mp4` videos from the original Flash animations.
  - EXPERIMENTAL: To more accurately reproduce the original animation, the banners can alternatively utilize Ruffle, a Flash emulator powered by JavaScript and WebAssembly.
    - Flash banners can be enabled with the [`bannersFlash`](OPTIONS.md#bannersflash) option, which loads the original Flash `.swf` files and renders them via the Ruffle emulator.

- Teams
  - Individual team pages currently display an "under construction" notice styled after actual internal fax transmissions sent by The Designers Republic to Psygnosis during _Wipeout_'s production.
  - The original team pages are among the more complex sections of the Flash website to adapt, so full implementations have been added to the roadmap for a later update.

## Technical Notes

For implementation details see [Technical Notes](TechnicalNotes.md).
