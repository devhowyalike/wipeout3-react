import type { RouteId } from "@/routes/Route.Ids";
import type { ModalConfig } from "./Menu.types";

/** Fully resolved route entry used by the router and menu system. */
export interface RouteConfig {
  id: RouteId;
  label: string;
  path: string;
  element: React.ReactElement;
  animation?: RouteId;
  modalConfig?: ModalConfig;
}