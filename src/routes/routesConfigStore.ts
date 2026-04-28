import type { RouteConfig } from "@/types/Route.types";

/** Populated once at app startup by `routes.tsx` via `setRoutesConfig`.
 *  Keeping the store in its own module lets utilities like `getMenuItemsById`
 *  and `getRouteAnimation` read route data without importing `routes.tsx`,
 *  which would create circular dependencies through `routeDefinitions`. */
let _routesConfig: RouteConfig[] = [];

export function setRoutesConfig(config: RouteConfig[]): void {
  _routesConfig = config;
}

export function getRoutesConfig(): RouteConfig[] {
  return _routesConfig;
}
