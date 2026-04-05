import type { Animation, AnimationId } from "@/components/WipeoutLink/animations";
import type { RouteId } from "@/routes/Route.Ids";

/** A single navigation entry rendered by the `Menu` component. */
export interface MenuItem {
  id: string;
  path: string | undefined;
  label: string;
  animation: AnimationId | Animation | undefined;
  modalConfig?: ModalConfig;
}

/** Configuration for content that opens in a modal overlay instead of navigating to a route. */
export interface ModalConfig {
  content: React.ReactNode;
  width?: number;
  height?: number;
}

/** Props for the `Menu` component that renders a list of `WipeoutLink` items. */
export interface MenuProps {
  items: MenuItem[];
  modalItems?: Partial<Record<RouteId, ModalConfig>>;
  /**
   * When `true` (default), eagerly fetches the JS chunk for each menu link
   * on `mouseenter` / `touchstart` so navigation feels instant.
   * Set to `false` to disable prefetching (e.g. for menus with many items
   * where bandwidth is a concern).
   */
  prefetch?: boolean;
}