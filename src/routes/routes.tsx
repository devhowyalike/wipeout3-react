import { lazy, Suspense, createElement, Fragment, type ComponentType } from "react";
import { routeDefinitions } from "./routeDefinitions";
import { animations } from "@/components/WipeoutLink/animations";
import Loading from "@/components/Loading";
import type { RouteConfig } from "@/types/Route.types";
import { setPrefetchMap } from "@/utils/prefetchRoute";
import { setRoutesConfig } from "./routesConfigStore";

setPrefetchMap(
  Object.fromEntries(
    routeDefinitions
      .filter((def): def is Extract<typeof def, { load: unknown }> => "load" in def)
      .map((def) => [def.id, def.load]),
  ),
);

/**
 * Fully resolved route configuration array — each entry includes a lazy-loaded
 * React element, label, path, and optional animation/modal config. Derived from
 * routeDefinitions.
 */
export const routesConfig: RouteConfig[] = routeDefinitions.map((def) => {
  if ("type" in def && def.type === "mailto") {
    const hasAnimation = Object.prototype.hasOwnProperty.call(animations, def.id);
    return {
      id: def.id,
      label: def.label,
      path: `mailto:${def.email}`,
      element: createElement(Fragment),
      ...(hasAnimation && { animation: def.id }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Route = lazy(def.load as () => Promise<{ default: ComponentType<any> }>);
  const element = (
    <Suspense fallback={<Loading />}>
      <Route />
    </Suspense>
  );
  const hasAnimation = Object.prototype.hasOwnProperty.call(animations, def.id);

  if ("type" in def && def.type === "modal") {
    return {
      id: def.id,
      label: def.label,
      path: "",
      element,
      modalConfig: { content: element },
      ...(hasAnimation && { animation: def.id }),
    };
  }

  return {
    id: def.id,
    label: def.label,
    path: def.path,
    element,
    ...(hasAnimation && { animation: def.id }),
  };
});

setRoutesConfig(routesConfig);
