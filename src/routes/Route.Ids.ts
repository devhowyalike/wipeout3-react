import { routeDefinitions } from "./routeDefinitions";

/** Union of all route identifier literals, derived from `routeDefinitions`. */
export type RouteId = (typeof routeDefinitions)[number]["id"];
