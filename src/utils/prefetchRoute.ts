/** Route IDs that have already been prefetched. Prevents redundant network
 *  requests when the user hovers over the same menu item multiple times. */
const prefetched = new Set<string>();

/** Import factories keyed by route ID. Populated once at app startup via
 *  `setPrefetchMap` — keeping this module free of a `routeDefinitions` import
 *  so that lazily-loaded pages can safely import `prefetchRoute` without
 *  introducing a circular dependency. */
let prefetchMap: Record<string, () => Promise<unknown>> = {};

/**
 * Called once at app startup (from `routes.tsx`) with the full set of lazy
 * import factories keyed by route ID.
 */
export function setPrefetchMap(map: Record<string, () => Promise<unknown>>): void {
  prefetchMap = map;
}

/**
 * Eagerly fetches the JS chunk for a lazy-loaded route by calling its dynamic
 * `import()`. The browser module cache deduplicates the request, so when
 * React.lazy later resolves the same import the chunk is already available
 * — eliminating the loading spinner on navigation.
 *
 * Safe to call multiple times; subsequent calls for the same ID are no-ops.
 *
 * @param id - The route identifier (matches keys in the prefetch map).
 */
export function prefetchRoute(id: string): void {
  if (prefetched.has(id) || !prefetchMap[id]) return;
  prefetched.add(id);
  prefetchMap[id]();
}
