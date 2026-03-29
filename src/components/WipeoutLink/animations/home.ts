import { makeAnimations } from "./utils";
import { positionSetOne as pos } from "./positions";

/**
 * Hover animation mappings for the Home menu items, each positioned relative to its menu row.
 */
export const homeAnimations = makeAnimations('shared', [
  ['news',       pos.row1, 'hover1'],
  ['tour',       pos.row2, 'hover2'],
  ['game',       pos.row3, 'hover3'],
  ['teams',      pos.row4, 'hover4'],
  ['soundtrack', pos.row5, 'hover5'],
  ['history',    pos.row6, 'hover6'],
  ['pitlane',    pos.row7, 'hover7'],
]);
