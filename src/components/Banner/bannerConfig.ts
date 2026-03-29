/** Default dimensions (px) for banner modal/popup windows. */
export const modalWidth = 400;
export const modalHeight = 200;

/** Available video resolution labels keyed by breakpoint size. */
export const videoResolutions = {
  sm: "224p",
  md: "720p",
  lg: "1080p"
};

/** Viewport width breakpoints (px) for responsive banner sizing. */
export const breakpoints = {
  sm: 450,
  md: 768,
  lg: 1024
};

/**
 * Returns the pixel width used to fetch the appropriately sized video for the
 * given resolution key.
 *
 * @param resolution - Breakpoint size key (`"sm"`, `"md"`, or `"lg"`).
 */
export const getVideoWidth = (resolution: keyof typeof videoResolutions) => {
  const widthMap = {
    sm: 450,
    md: 1440,
    lg: 2160
  };
  
  return widthMap[resolution];
};