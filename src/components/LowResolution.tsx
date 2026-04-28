import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useOptions } from "@/hooks/useOptions";
import { BREAKPOINT_MD } from "@/config/constants";

const CRT_WIDTH = 800;
const CRT_HEIGHT = 600;

type LowResolutionMetrics = {
  scale: number;
  height: number;
};

/**
 * Returns the scale factor needed to fit the CRT viewport into the
 * current window. Returns `null` when the viewport is narrower than the `md`
 * breakpoint (scaling is skipped on small screens).
 */
function useLowResolution() {
  const compute = useCallback((): LowResolutionMetrics | null => {
    if (window.innerWidth < BREAKPOINT_MD) return null;
    const scale = Math.min(
      window.innerWidth / CRT_WIDTH,
      window.innerHeight / CRT_HEIGHT,
    );

    return {
      scale,
      // When width limits the scale, reserve extra unscaled height so the
      // footer can still sit at the bottom of the viewport.
      height: Math.max(CRT_HEIGHT, window.innerHeight / scale),
    };
  }, []);

  const [scale, setScale] = useState<LowResolutionMetrics | null>(() =>
    compute(),
  );

  useEffect(() => {
    const onResize = () => setScale(compute());
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [compute]);

  return scale;
}

/**
 * Wraps content in a scaled viewport to emulate a period-accurate CRT
 * monitor resolution. Below the `md` breakpoint the wrapper is a no-op and
 * children render at their natural size.
 *
 * When `wideCenter` is active the scaled box is centered in the viewport
 * (pillarboxed) rather than anchored to the top-left corner.
 */
export default function LowResolution({ children }: { children: ReactNode }) {
  const { wideCenter } = useOptions();
  const metrics = useLowResolution();

  if (metrics == null) return <>{children}</>;

  const { scale, height } = metrics;

  const scaledBox = (
    <div
      style={{
        width: CRT_WIDTH,
        height,
        transform: `scale(${scale})`,
        transformOrigin: wideCenter ? "top center" : "top left",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );

  if (wideCenter) {
    return (
      <div className="flex justify-center" style={{ height: height * scale }}>
        {scaledBox}
      </div>
    );
  }

  return scaledBox;
}
