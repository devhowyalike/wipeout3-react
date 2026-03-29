import { makeAnimations } from "./utils";
import { positionSetOne as pos } from "./positions";

/**
 * Hover animation mappings for the Pitlane sub-menu items, using the shared clip set.
 */
export const pitlaneAnimations = makeAnimations('shared', [
  ['forum',        pos.row1, 'hover1'],
  ['chat',         pos.row2, 'hover2'],
  ['screensavers', pos.row3, 'hover3'],
  ['wallpaper',    pos.row4, 'hover4'],
  ['banners',      pos.row7, 'hover7'],
  ['subscribe',    pos.row5, 'hover5'],
  ['contact',      pos.row6, 'hover6'],
  ['credits',      pos.row7, 'hover7'],
]);
