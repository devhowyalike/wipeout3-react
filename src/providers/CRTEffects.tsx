import { Suspense, type ReactNode } from "react";
import { useOptions } from "@/hooks/useOptions";
import LowResolution from "@/components/LowResolution";
import { FILTER_REGISTRY } from "@/config/filterRegistry";

/**
 * Composes CRT visual effects driven by user options: scales the viewport via
 * `LowResolution` and renders overlay filters from the `FILTER_REGISTRY`.
 */
export default function CRTEffects({ children }: { children: ReactNode }) {
  const options = useOptions();

  return (
    <>
      {options.lowResolution ? <LowResolution>{children}</LowResolution> : children}
      {FILTER_REGISTRY.map(
        ({ option, component: Filter, props }) =>
          options[option] && (
            <Suspense key={option} fallback={null}>
              <Filter {...props} />
            </Suspense>
          ),
      )}
    </>
  );
}
