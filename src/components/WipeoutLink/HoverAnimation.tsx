import { useRef, useEffect, useState } from "react";
import { Animation, createVideoSources } from "./animations";

interface HoverAnimationProps {
  animationData: Animation | undefined;
  isVisible: boolean;
  /** Fires when the video clip finishes playing or if autoplay fails, so callers can proceed with deferred navigation. */
  onEnded?: () => void;
}

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

/**
 * Renders a transparent video overlay that plays a short hover animation clip
 * and hides itself on completion. The {@link HoverAnimationProps.onEnded | onEnded}
 * callback fires when the clip finishes naturally or when autoplay is rejected
 * by the browser, so callers can proceed with deferred navigation in either case.
 *
 * When `animationData` is `undefined` the component returns `null` — no `<video>`
 * element is created and no network request is made, making this the preferred
 * way to skip animations for performance.
 */
export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  animationData,
  isVisible,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const animationSources = animationData?.folder && animationData?.sources
    ? createVideoSources(animationData.folder, animationData.sources)
    : undefined;

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        setHasEnded(false);
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.log("Video autoplay failed:", err);
          setHasEnded(true);
          onEnded?.();
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isVisible, onEnded]);

  const handleVideoEnded = () => {
    setHasEnded(true);
    onEnded?.();
  };

  // Return null if no animation data is provided
  if (!animationSources) {
    return null;
  }

  return (
    <div
      className={`absolute left-0 top-0 z-50 pointer-events-none transition-opacity duration-200 ${
        isVisible && !hasEnded ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={animationData?.style}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        preload={isTouchDevice() ? "metadata" : "auto"}
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="pointer-events-none"
        style={undefined}
      >
        {animationSources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  );
};
