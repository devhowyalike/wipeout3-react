/** A single screenshot image with a numeric ID and URL. */
export interface Screenshot {
  id: number;
  url: string;
  image?: string;
}

/** Hover and keyboard-active states for the screenshot gallery navigation controls. */
export type UIState = {
  prevHovered: boolean;
  nextHovered: boolean;
  menuHovered: boolean;
  prevKeyActive: boolean;
  nextKeyActive: boolean;
};

/** Track metadata used before screenshots are loaded (listing view). */
export interface BaseScreenshotSet {
  id: string;
  name: string;
  titleCard: string;
  count: number;
}

/** Track data with its resolved screenshot array (used after selection). */
export interface ScreenshotSet extends BaseScreenshotSet {
  screenshots: Screenshot[];
}

/** Direction for stepping through the screenshot gallery. */
export type NavigationDirection = "next" | "prev";