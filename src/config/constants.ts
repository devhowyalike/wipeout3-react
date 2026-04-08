/** Web3Forms API key for the contact form, read from env. */
export const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";

/** Theme applied on initial load before a page sets its own. */
export const DEFAULT_THEME = "sandTheme";
/** Footer title shown while the page is loading. */
export const DEFAULT_FOOTER_MENU_TITLE = "Loading...";
/** Footer subtitle shown while the page is loading. */
export const DEFAULT_FOOTER_MENU_SUBTITLE = "Menu Select";

/** Original Psygnosis webmaster email used for the Contact mailto link. */
export const PSY_CONTACT_EMAIL = "webmaster@psygnosis.com";

/** @see https://www.psygnosis.co.uk — original Psygnosis site (offline). */
export const PSYGNOSIS_URL = "http://www.psygnosis.co.uk";
/** @see https://www.thedesignersrepublic.com */
export const DESIGNERS_REPUBLIC_URL = "https://www.thedesignersrepublic.com";
/** @see https://kleber.net */
export const KLEBER_URL = "https://kleber.net";
/** GitHub profile URL for the React Edition developer. */
export const GITHUB_PROFILE_URL = "https://github.com/devhowyalike";
/** GitHub repository URL for the React Edition source code. */
export const GITHUB_URL = "https://github.com/devhowyalike/wipeout3-react";

/** Small-screen breakpoint (px), aligned with Tailwind's `sm`. */
export const BREAKPOINT_SM = 640;
/** Medium-screen breakpoint (px), aligned with Tailwind's `md`. */
export const BREAKPOINT_MD = 768;
/** Large-screen breakpoint (px), aligned with Tailwind's `lg`. */
export const BREAKPOINT_LG = 1024;
