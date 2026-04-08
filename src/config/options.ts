const STORAGE_KEY = "wipeout3-options";

/** Union of all user-configurable option keys (excludes mode flags). */
export type OptionKey =
  | "xsText"
  | "soundToggle"
  | "countdownToggle"
  | "modal"
  | "bannersFlash"
  | "reactEditionCredits"
  | "contactModal"
  | "psygnosisUrl"
  | "swipeHints"
  | "remapL"
  | "wideCenter"
  | "disableHoverAnimations"
  | "scanlineFilter1"
  | "lowResolution";

/** Full options object: every `OptionKey` boolean plus the `pureMode` / `reactMode` flags. */
export type AppOptions = Record<OptionKey, boolean> & {
  pureMode: boolean;
  reactMode: boolean;
};

/** Human-readable description for each option, displayed in the settings panel. */
export const OPTION_DESCRIPTIONS: Record<OptionKey, string> = {
  xsText:
    "Enables small font sizes as they originally appeared on the Flash website, sacrificing legibility on modern high-resolution screens.",
  soundToggle:
    "Shows a sound toggle button in the footer. When disabled, the button is hidden and sound continues to work within the browser's autoplay policy.",
  countdownToggle:
    "Shows a play/pause button on the News countdown for accessibility and sensitivity to motion.",
  modal:
    "Replaces the Flash site's pop-up windows with modals. Pop-ups may be blocked by browsers in any case; mobile users always see modals since pop-ups are not supported.",
  bannersFlash:
    "On the Banners page, animations are served via Flash, enabling the Ruffle emulator to load original Flash content instead of video replacements. May be blocked by ad blockers or browser policies.",
  reactEditionCredits:
    "Shows the React Edition credits on the credits page. When disabled, only the original credits are shown.",
  contactModal:
    "Replaces the Pitlane Contact mail link with a modal contact form for reaching the React Edition developer.",
  psygnosisUrl:
    "When enabled, the homepage back button links to the Psygnosis website (currently offline). When disabled, it links to the React Edition's GitHub repository.",
  swipeHints:
    "Shows animated swipe-direction icons in the Screenshots gallery on touch devices; auto-dismisses after the first swipe.",
  remapL:
    'Remaps every "L" to the Wipeout 3 custom glyph (U+E041), a vertical line matching the font\'s geometric style; opt-in due to inconsistent use on the original Flash site',
  wideCenter:
    "Centers the website in the middle of the screen on wide displays.",
  disableHoverAnimations:
    "Hover animations on menu links are disabled; on touch devices, taps navigate immediately without waiting for animations.",
  scanlineFilter1:
    "Simulates a period-accurate CRT monitor effect.",
  lowResolution:
    "Sets the site resolution to 800x600, emulating a period-accurate CRT monitor.",
};

/** Short description for each mode preset, displayed in the settings panel. */
export const MODE_DESCRIPTIONS: Record<"pureMode" | "reactMode", string> = {
  pureMode: "Restores original Flash website configuration",
  reactMode: "Activates default React Edition configuration",
};

/** Short UI label for each option toggle, shown in the settings panel. */
export const OPTION_LABELS: Record<OptionKey, string> = {
  lowResolution: "Low Resolution",
  scanlineFilter1: "Scanline Filter",
  psygnosisUrl: "Homepage: Psygnosis URL",
  bannersFlash: "Banners: Flash (via Ruffle)",
  xsText: "Small Text (original sizing)",
  soundToggle: "Sound Toggle",
  countdownToggle: "News: Countdown Accessibility",
  modal: "Modal Overlays",
  reactEditionCredits: "React Edition Credits",
  contactModal: "Contact: Developer Modal Form",
  swipeHints: "Swipe Hints (Touch devices only)",
  remapL: "Remap 'L' Glyph",
  wideCenter: "Widescreen: Center Content",
  disableHoverAnimations: "Menu: Disable Hover Animations",
};

/** Factory defaults applied when no persisted options exist in localStorage. */
export const DEFAULT_OPTIONS: AppOptions = {
  pureMode: false,
  reactMode: false,
  xsText: true,
  soundToggle: true,
  countdownToggle: true,
  modal: true,
  bannersFlash: false,
  reactEditionCredits: true,
  contactModal: true,
  psygnosisUrl: false,
  swipeHints: true,
  remapL: false,
  wideCenter: false,
  disableHoverAnimations: false,
  scanlineFilter1: false,
  lowResolution: false,
};

/** Option values forced when React Mode is active. */
export const REACT_MODE_OPTION_OVERRIDES: Omit<AppOptions, "pureMode" | "reactMode"> = {
  xsText: true,
  soundToggle: true,
  countdownToggle: true,
  modal: true,
  bannersFlash: false,
  reactEditionCredits: true,
  contactModal: true,
  psygnosisUrl: false,
  swipeHints: true,
  remapL: false,
  wideCenter: false,
  disableHoverAnimations: false,
  scanlineFilter1: false,
  lowResolution: false,
};

/** Option values forced when Pure Mode is active (restores original Flash site behavior). */
export const PURE_MODE_OPTION_OVERRIDES: Omit<AppOptions, "pureMode" | "reactMode"> = {
  xsText: true,
  soundToggle: false,
  countdownToggle: false,
  modal: false,
  bannersFlash: true,
  reactEditionCredits: false,
  contactModal: false,
  psygnosisUrl: true,
  swipeHints: false,
  remapL: false,
  wideCenter: false,
  disableHoverAnimations: false,
  scanlineFilter1: true,
  lowResolution: true,
};

/**
 * Compares the current options against the Pure and React mode presets,
 * returning which mode is active or `null` if options are customised.
 *
 * @param options - The full options object to evaluate.
 * @returns `"pure"`, `"react"`, or `null` when no preset matches.
 */
export function detectMode(options: AppOptions): "pure" | "react" | null {
  const keys = Object.keys(PURE_MODE_OPTION_OVERRIDES) as OptionKey[];
  if (keys.every((k) => options[k] === PURE_MODE_OPTION_OVERRIDES[k])) return "pure";
  if (keys.every((k) => options[k] === REACT_MODE_OPTION_OVERRIDES[k])) return "react";
  return null;
}

/**
 * Loads persisted app options from localStorage, merging with defaults.
 * Applies mode overrides when Pure or React mode is enabled.
 */
export function loadOptions(): AppOptions {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppOptions>;
      const merged = { ...DEFAULT_OPTIONS, ...parsed };
      if (merged.pureMode) {
        return { ...merged, ...PURE_MODE_OPTION_OVERRIDES, pureMode: true, reactMode: false };
      }
      if (merged.reactMode) {
        return { ...merged, ...REACT_MODE_OPTION_OVERRIDES, reactMode: true, pureMode: false };
      }
      return merged;
    }
  } catch {
    // Corrupted storage — fall through to defaults
  }
  return { ...DEFAULT_OPTIONS };
}

/**
 * Persists the given app options to localStorage.
 *
 * @param options - The complete options object to save.
 */
export function saveOptions(options: AppOptions): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
}
