import { forwardRef, lazy, Suspense, type Ref } from "react";
import { useOptions } from "@/hooks/useOptions";
import { BannerProps, BannerHandle, BannerRuffleHandle } from "@/types/Banner.types";
import { BannerVideo } from "./BannerVideo";

// Conditionally import components
const BannerRuffle = lazy(() =>
  import("./BannerRuffle").then((module) => ({
    default: module.BannerRuffle,
  })),
);

/**
 * Site banner: lazy Ruffle SWF when “banners flash” is on, otherwise responsive MP4 video.
 * Forwards the same imperative handle shape as the underlying implementation.
 */
const Banner = forwardRef<BannerHandle, BannerProps>((props, ref) => {
  const { bannersFlash } = useOptions();

  if (bannersFlash) {
    // Using type assertion,
    // but it's safe because we only render this when the flag is enabled
    return (
      <Suspense fallback={null}>
        <BannerRuffle ref={ref as unknown as Ref<BannerRuffleHandle>} {...props} />
      </Suspense>
    );
  }
  return <BannerVideo ref={ref} {...props} />;
});

Banner.displayName = "Banner";

export default Banner;
