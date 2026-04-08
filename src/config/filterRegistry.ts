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
 */
export const FILTER_REGISTRY: FilterRegistryEntry[] = [
  {
    option: "scanlineFilter1",
    component: lazy(() => import("@/components/ScanlineFilter1")),
    props: { roll: true },
  },
];
