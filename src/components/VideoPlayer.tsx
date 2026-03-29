import { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon } from "./icons";

interface VideoPlayerProps {
  src: string;
  width: number;
  height: number;
  autoPlay?: boolean;
  nativeControls?: boolean;
}

/**
 * MP4 player with optional native controls or a custom play/pause overlay on tap/hover.
 * Syncs internal playing state with video `play` / `pause` events.
 */
export default function VideoPlayer({
  src,
  width,
  height,
  autoPlay = false,
  nativeControls = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsHovering(false);
    }
  };

  if (nativeControls) {
    return (
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay={autoPlay}
        controls
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay={autoPlay}
        playsInline
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          togglePlay();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          togglePlay();
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying && !isHovering
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <button
          onClick={togglePlay}
          className="cursor-pointer p-4 bg-black/50 text-white hover:bg-black/70"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </div>
  );
}
