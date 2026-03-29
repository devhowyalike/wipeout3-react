import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  Suspense,
  lazy,
} from "react";
import type { RufflePlayerHandle } from "@/components/Ruffle/RufflePlayer";
import { BannerProps, BannerRuffleHandle } from "@/types/Banner.types";
import { modalWidth, modalHeight } from "./bannerConfig";

// Import RufflePlayer lazily
const RufflePlayer = lazy(() => import("@/components/Ruffle/RufflePlayer"));

/**
 * Banner that plays the team SWF via Ruffle (`.fws` path); lazy-loads the player chunk.
 * Exposes cleanup and optional popup `beforeunload` handling when opened from a window.
 */
export const BannerRuffle = forwardRef<BannerRuffleHandle, BannerProps>(
  (props, ref) => {
    const {
      bannerId,
      width = "100%",
      height = "auto",
      autoplay = true,
      aspectRatio = modalWidth / modalHeight,
      viewportPercentage = 80,
      disablePopupHandling = false,
      onClose,
      ...otherProps
    } = props;

    const rufflePlayerRef = useRef<RufflePlayerHandle>(null);
    const isInPopup =
      typeof window !== "undefined" &&
      window.opener !== null &&
      !disablePopupHandling;
    const hasRegisteredUnload = useRef(false);

    // Renamed .swf to .fws to prevent being blocked by ad blockers
    const swfPath = bannerId ? `/banners/edited/${bannerId}.fws` : undefined;

    useImperativeHandle(ref, () => ({
      cleanup: () => {
        if (rufflePlayerRef.current) {
          rufflePlayerRef.current.cleanup();
        }
        if (onClose) {
          onClose();
        }
      },
      getRufflePlayer: () => rufflePlayerRef.current,
    }));

    useEffect(() => {
      if (isInPopup && !hasRegisteredUnload.current) {
        const handleBeforeUnload = () => {
          if (rufflePlayerRef.current) {
            rufflePlayerRef.current.cleanup();
          }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        hasRegisteredUnload.current = true;

        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }
    }, [isInPopup]);

    if (!bannerId || !swfPath) {
      console.error("BannerRuffle component requires a bannerId prop");
      return null;
    }

    return (
      <div className="banner-container w-full">
        <Suspense fallback={null}>
          <RufflePlayer
            ref={rufflePlayerRef}
            swfPath={swfPath}
            width={width}
            height={height}
            aspectRatio={aspectRatio}
            viewportPercentage={viewportPercentage}
            autoplay={autoplay}
            {...otherProps}
          />
        </Suspense>
      </div>
    );
  }
);

BannerRuffle.displayName = "BannerRuffle";
