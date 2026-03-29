import React, { useEffect, Suspense } from "react";
import { RufflePreloaderComponent } from "@/types/RufflePlayer.types";
import { createInvisiblePlayer } from "./ruffleUtils";

// Preloader function - exposed as static method
const preloadRuffle = async (): Promise<void> => {
  await createInvisiblePlayer();
};

/**
 * Inner component that handles the actual preloading
 * This component doesn't render anything visible
 */
const InnerPreloader: React.FC = () => {
  useEffect(() => {
    // Start preloading
    preloadRuffle();
    // No cleanup needed for preloading
  }, []);

  // This component doesn't render anything visible
  return null;
};

/**
 * Preloads Ruffle WASM in the background with Suspense
 * Wraps the inner preloader with Suspense to handle loading state
 */
const RufflePreloader: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <InnerPreloader />
    </Suspense>
  );
};

// Attach the preload function as a static method
(RufflePreloader as RufflePreloaderComponent).preloadRuffle = preloadRuffle;

export default RufflePreloader as RufflePreloaderComponent;
