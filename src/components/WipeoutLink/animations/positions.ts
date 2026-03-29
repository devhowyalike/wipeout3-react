import type { Animation } from "./types";

/**
 * Builds a position set — a row-keyed map of top/left offsets (in em) for
 * hover animation clips relative to their menu item. Pass styles in row order
 * (row1 first); the resulting keys are `row1`–`rowN`.
 */
function createPositionSet(rows: Animation["style"][]): Record<string, Animation["style"]> {
  return Object.fromEntries(rows.map((style, i) => [`row${i + 1}`, style]));
}

export const positionSetOne = createPositionSet([
  { top: '2em',    left: '4.2em' },
  { top: '-.4em',  left: '3.6em' },
  { top: '-.8em',  left: '-.5em' },
  { top: '-1.5em', left: '4em'   },
  { top: '-.4em',  left: '1em'   },
  { top: '-1.2em', left: '3.4em' },
  { top: '-.6em',  left: '3.6em' },
]);

export const positionSetTwo = createPositionSet([
  { top: '2.1em',  left: '3.9em' },
  { top: '-.4em',  left: '3.7em' },
  { top: '-.5em',  left: '-.5em' },
  { top: '-1.6em', left: '3.8em'   },
  { top: '-.3em',  left: '.7em'  },
  { top: '-1.1em',   left: '3.4em' },
]);
