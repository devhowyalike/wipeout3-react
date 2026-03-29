import { getRouteAnimation } from "@/routes/getRouteAnimation";
import { routesConfig } from "@/routes/routes";
import type { RouteId } from "@/routes/Route.Ids";
import type { RouteConfig } from "@/types/Route.types";

/**
 * Maps each route ID to a menu item with path, label, route animation, and modal config.
 *
 * @param ids - Array of route identifiers to resolve.
 * @returns Menu item objects with `id`, `path`, `label`, `animation`, and `modalConfig`.
 * @throws If `routesConfig` is uninitialized or any ID is not found.
 */
export function getMenuItemsById(ids: RouteId[]) {
  if (!routesConfig) {
    throw new Error("routesConfig is not initialized");
  }

  return ids.map((id) => {
    const route = routesConfig.find(
      (route): route is RouteConfig => route.id === id
    );
    if (!route) {
      throw new Error(`Route with id "${id}" not found in routesConfig`);
    }
    return {
      id: route.id,
      path: route.path,
      label: route.label,
      animation: getRouteAnimation(route.id),
      modalConfig: route.modalConfig,
    };
  });
}
