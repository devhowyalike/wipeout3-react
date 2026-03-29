import type { RouteId } from "@/routes/Route.Ids";
import type { Animation } from "./types";
import { homeAnimations } from "./home";
import { gameAnimations } from "./game";
import { previewsAnimations } from "./previews";
import { pitlaneAnimations } from "./pitlane";

export type { VideoSource, Animation } from "./types";
export { createVideoSources, makeAnimations } from "./utils";
export { getMovieAnimation } from "./movies";

/**
 * Combined animation lookup table for all menus, keyed by route ID.
 */
export const animations: Partial<Record<RouteId, Animation>> = {
  ...homeAnimations,
  ...gameAnimations,
  ...previewsAnimations,
  ...pitlaneAnimations,
} as const;

/** Union of route IDs that have a registered hover animation. */
export type AnimationId = keyof typeof animations;
