import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import {
  RufflePlayerProps,
  RufflePlayerElement,
} from "@/types/RufflePlayer.types";
import { loadRuffle } from "./ruffleUtils";

function destroyPlayerRef(playerRef: { current: RufflePlayerElement | null }) {
  if (playerRef.current && typeof playerRef.current.destroy === "function") {
    try {
      playerRef.current.destroy();
    } catch (err) {
      console.warn("Error destroying Ruffle player:", err);
    }
  }
  playerRef.current = null;
}

/** Imperative handle: clears the container and destroys the Ruffle instance when present. */
export interface RufflePlayerHandle {
  cleanup: () => void;
}

/**
 * Embeds a Ruffle Flash player for a given SWF URL, with optional autoplay and aspect sizing.
 * Reloads when `swfPath` or `autoplay` changes; fades in once the player reports loaded.
 */
const RufflePlayer = forwardRef<RufflePlayerHandle, RufflePlayerProps>(
  (
    {
      swfPath,
      width = "100%",
      height = "auto",
      autoplay = true,
      aspectRatio = 16 / 9,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerInstanceRef = useRef<RufflePlayerElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Expose cleanup method to parent components
    useImperativeHandle(ref, () => ({
      cleanup: () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        destroyPlayerRef(playerInstanceRef);
      },
    }));

    useEffect(() => {
      // Capture the container node at effect-setup time so the cleanup function
      // always has a stable reference, even after the component unmounts.
      const container = containerRef.current;

      // Reset loaded state when SWF changes
      setIsLoaded(false);

      // Initialize player
      const initPlayer = async () => {
        try {
          const rufflePlayer = await loadRuffle();

          if (!rufflePlayer || !rufflePlayer.newest || !containerRef.current) {
            console.error("Ruffle player failed to load properly");
            return;
          }

          // Clear container
          containerRef.current.innerHTML = "";

          // Create player
          const ruffle = rufflePlayer.newest();
          const player = ruffle.createPlayer();
          playerInstanceRef.current = player;

          // Set player to take full container size
          player.style.width = "100%";
          player.style.height = "100%";

          // Add to container
          containerRef.current.appendChild(player);

          // Load SWF
          player.load({
            url: swfPath,
            autoplay: autoplay,
            unmuteOverlay: "hidden",
            splashScreen: false,
          });

          // Set the loaded state to trigger the fade-in
          setIsLoaded(true);

          // Force autoplay through direct play call if needed
          if (autoplay) {
            setTimeout(() => {
              try {
                if (player.play && typeof player.play === "function") {
                  player.play();
                }
              } catch (e) {
                console.warn("Auto-play prevented:", e);
              }
            }, 100);
          }
        } catch (error) {
          console.error("Error initializing Ruffle player:", error);
        }
      };

      initPlayer();

      // Cleanup
      return () => {
        if (container) {
          container.innerHTML = "";
        }
        destroyPlayerRef(playerInstanceRef);
      };
    }, [swfPath, autoplay]);

    return (
      <div
        ref={containerRef}
        className={`ruffle-container transition-opacity duration-200 ease-in ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: width,
          height: height,
          aspectRatio: aspectRatio,
        }}
      />
    );
  },
);

RufflePlayer.displayName = "RufflePlayer";

export default RufflePlayer;
