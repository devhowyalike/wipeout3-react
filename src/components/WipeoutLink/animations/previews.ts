import { makeAnimations } from "./utils";
import { positionSetOne as pos } from "./positions";

/**
 * Hover animation mappings for the Previews sub-menu items.
 */
export const previewsAnimations = makeAnimations('previews', [
  ['welcome',     pos.row1],
  ['movies',      pos.row2],
  ['screenshots', pos.row3],
  ['typography',  pos.row4]
]);

