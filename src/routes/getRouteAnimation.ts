import type { RouteId } from "./Route.Ids";
import type { RouteConfig } from "@/types/Route.types";
import { routesConfig } from "./routes";

/**
 * Looks up the hover-animation ID assigned to a route, returning `undefined`
 * if the route has no animation.
 *
 * @param routeId - The route identifier to look up.
 */
export const getRouteAnimation = (routeId: RouteId): RouteId | undefined => {
  const route = routesConfig.find((route): route is RouteConfig => route.id === routeId);
  return route?.animation;
};