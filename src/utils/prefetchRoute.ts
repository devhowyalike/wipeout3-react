import { routeDefinitions } from "@/routes/routeDefinitions";

/** Route IDs that have already been prefetched. Prevents redundant network
 *  requests when the user hovers over the same menu item multiple times. */
const prefetched = new Set<string>();

/** Import factories keyed by route ID, derived from `routeDefinitions`.
 *  Only includes routes that have a `load` function (excludes mailto). */
const prefetchMap: Record<string, () => Promise<unknown>> = Object.fromEntries(
  routeDefinitions
    .filter((def): def is Extract<typeof def, { load: unknown }> => "load" in def)
    .map((def) => [def.id, def.load]),
);

/**
 * Eagerly fetches the JS chunk for a lazy-loaded route by calling its dynamic
 * `import()`. The browser module cache deduplicates the request, so when
 * React.lazy later resolves the same import the chunk is already available
 * — eliminating the loading spinner on navigation.
 *
 * Safe to call multiple times; subsequent calls for the same ID are no-ops.
 *
 * @param id - The route identifier (matches keys in `prefetchMap`).
 */
export function prefetchRoute(id: string): void {
  if (prefetched.has(id) || !prefetchMap[id]) return;
  prefetched.add(id);
  prefetchMap[id]();
}
