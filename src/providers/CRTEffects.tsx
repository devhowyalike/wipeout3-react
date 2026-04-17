import { type ReactNode } from "react";
import { useOptions } from "@/hooks/useOptions";
import LowResolution from "@/components/LowResolution";
import FilterOverlays from "@/components/FilterOverlays";

/**
 * Composes CRT visual effects driven by user options: scales the viewport via
 * `LowResolution` and renders overlay filters from the `FILTER_REGISTRY`
 * (delegated to `FilterOverlays`, which is also mounted inside every modal
 * dialog so top-layer content receives the same effects).
 */
export default function CRTEffects({ children }: { children: ReactNode }) {
  const options = useOptions();

  return (
    <>
      {options.lowResolution ? <LowResolution>{children}</LowResolution> : children}
      <FilterOverlays />
    </>
  );
}
