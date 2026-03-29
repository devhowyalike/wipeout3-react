import type { AnimationId } from "@/components/WipeoutLink/animations";
import type { RouteId } from "@/routes/Route.Ids";

/** A single navigation entry rendered by the `Menu` component. */
export interface MenuItem {
  id: string;
  path: string | undefined;
  label: string;
  animation: AnimationId | undefined;
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
  /**
   * EXPERIMENTAL — Fundamentally changes the touch UX to a two-tap system.
   *
   * When `true`, the first tap on a touch device shows the hover animation and
   * highlights the link; a second tap on the same item navigates. This is an
   * opinionated departure from the standard tap-to-navigate convention and may
   * surprise users who expect a single tap to follow a link.
   *
   * When `false`, taps navigate immediately and hover animations are not
   * triggered on touch. Defaults to `true`.
   */
  touchHover?: boolean;
}