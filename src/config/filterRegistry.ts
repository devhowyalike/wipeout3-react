import { type ComponentType, lazy } from "react";
import type { OptionKey } from "@/config/options";

export interface FilterRegistryEntry {
  /** Option key that gates this filter — the filter only renders when the option is `true`. */
  option: OptionKey;
  /** Lazy-loaded filter component. */
  component: React.LazyExoticComponent<ComponentType<Record<string, unknown>>>;
  /** Props forwarded to the filter component at render time. */
  props?: Record<string, unknown>;
}

/**
 * Registry of visual filter overlays. Each entry maps an option key to a
 * lazy-loaded component. `CRTEffects` iterates this list and renders every
 * filter whose option is enabled.
 *
 * To add a new filter: append an entry here and add the corresponding option
 * key to `src/config/options.ts`. No other wiring needed.
 *
 * Scope note on performance: `FilterOverlays` gates each entry with
 * `return null` when the current instance is not the active (top-layer)
 * overlay, which means every filter here is mounted and unmounted on each
 * dialog handoff. `ScanlineFilter1` avoids the cost of that churn by
 * delegating WebGL ownership to the `crtRenderer` singleton so the same
 * canvas + GL context survive mount/unmount cycles. Any new filter added
 * here should adopt the same pattern (module-level resources, thin host
 * component) if it owns heavyweight state — otherwise every top-layer
 * transition will rebuild that state from scratch.
 */
export const FILTER_REGISTRY: FilterRegistryEntry[] = [
  {
    option: "scanlineFilter1",
    component: lazy(() => import("@/components/ScanlineFilter1")),
    props: { roll: true },
  },
];
