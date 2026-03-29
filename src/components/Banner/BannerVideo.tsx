import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { BannerProps, BannerHandle } from "@/types/Banner.types";
import {
  videoResolutions,
  breakpoints,
} from "@/components/Banner/bannerConfig";

/**
 * Banner as autoplaying, muted, looping MP4; picks resolution from breakpoints on resize.
 * Imperative `cleanup` forwards to `onClose` when provided.
 */
export const BannerVideo = forwardRef<BannerHandle, BannerProps>(
  (props, ref) => {
    const { onClose, bannerId } = props;

    // Track which video source to use
    const [videoSrc, setVideoSrc] = useState("");

    // Determine video resolution based on screen width
    const getVideoResolution = () => {
      if (window.innerWidth <= breakpoints.sm) {
        return videoResolutions.sm;
      } else if (window.innerWidth < breakpoints.lg) {
        return videoResolutions.md;
      } else {
        return videoResolutions.lg;
      }
    };

    // Update video source based on screen width
    useEffect(() => {
      const updateVideoSource = () => {
        if (!bannerId) return;
        setVideoSrc(`/banners/video/${getVideoResolution()}/${bannerId}.mp4`);
      };

      // Set initial source
      updateVideoSource();

      // Update source on window resize
      window.addEventListener("resize", updateVideoSource);

      // Cleanup
      return () => {
        window.removeEventListener("resize", updateVideoSource);
      };
    }, [bannerId]);

    useImperativeHandle(ref, () => ({
      cleanup: () => {
        if (onClose) {
          onClose();
        }
      },
    }));

    if (!bannerId) {
      console.error("BannerVideo requires a bannerId prop");
      return null;
    }

    return (
      <div className="banner-container w-full h-full flex items-center justify-center">
        {videoSrc && (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            src={videoSrc}
          >
            <div className="bg-gray-100 text-gray-500 p-4 rounded-sm text-center">
              Angryman&#8482; says: This device does not support video playback.
            </div>
          </video>
        )}
      </div>
    );
  }
);

BannerVideo.displayName = "BannerVideo";
