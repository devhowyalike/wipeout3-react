import { makeAnimations } from "./utils";
import { positionSetTwo as pos } from "./positions";

/**
 * Hover animation mappings for the Game sub-menu items.
 */
export const gameAnimations = makeAnimations('game', [
  ['previews',   pos.row1],
  ['modes',      pos.row2],
  ['gameplay',   pos.row3],
  ['tracks',     pos.row4],
  ['weapons',    pos.row5],
  ['developers', pos.row6],
]);
