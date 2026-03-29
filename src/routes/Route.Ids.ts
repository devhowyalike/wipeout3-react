import { routeDefinitions } from "./routeDefinitions";

/** Union of all route identifier literals, derived from `routeDefinitions`. */
export type RouteId = (typeof routeDefinitions)[number]["id"];

/** Flat array of every route identifier string, derived from routeDefinitions. */
export const routeIds = routeDefinitions.map((r) => r.id);
