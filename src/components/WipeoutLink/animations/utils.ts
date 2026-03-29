import type { RouteId } from "@/routes/Route.Ids";
import type { Animation, VideoSource } from "./types";

type Entry = [RouteId, Animation['style']?, string?];

/**
 * @param folder - Asset folder under `/hover-animation/` containing the clip files (e.g. `'home'`, `'game'`).
 * @param entries - Tuples of `[routeId, style?, clipName?]`. `clipName` defaults to `routeId` if omitted; use it when the clip filename differs from the route (e.g. `'hover1'`).
 *
 * @remarks
 * Clip naming convention:
 * - When clips map 1:1 to their own routes (e.g. `game/`, `previews/`), omit `clipName` — the route ID doubles as the filename.
 * - When clips are shared across multiple pages (e.g. `home/` clips reused by pitlane), use generic names (`hover1`–`hoverN`) so the filename carries no page-specific meaning.
 */
export function makeAnimations(
  folder: string,
  entries: Entry[]
): Partial<Record<RouteId, Animation>> {
  return Object.fromEntries(
    entries.map(([id, style, sources = id]) => [id, { folder, sources, style }])
  );
}

const animationsBasePath = '/hover-animation';

/**
 * Generates an array of video source objects (HEVC .mov + VP9 .webm) for a hover animation clip.
 *
 * @param folder - Subfolder under `/hover-animation/` (e.g. `'home'`, `'game'`).
 * @param baseFilename - Clip filename without extension (e.g. `'hover1'`, `'developers'`).
 */
export const createVideoSources = (folder: string, baseFilename: string): VideoSource[] => [
  {
    src: `${animationsBasePath}/${folder}/${baseFilename}.mov`,
    type: 'video/quicktime; codecs="hvc1"'
  },
  {
    src: `${animationsBasePath}/${folder}/${baseFilename}.webm`,
    type: 'video/webm'
  }
];
