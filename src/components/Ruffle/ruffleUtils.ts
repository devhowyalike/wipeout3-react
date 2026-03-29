import { RuffleConfig, RuffleInstance } from "@/types/RufflePlayer.types";
import { defaultRuffleConfig } from "./ruffleConfig";

/**
 * Checks if Ruffle is already loaded in the window
 */
export const isRuffleLoaded = (): boolean => {
  return !!window.RufflePlayer;
};

// Module-level variable to track loading promise
let ruffleLoadPromise: Promise<RuffleInstance | undefined> | null = null;

// Module-level variable to track if WASM has been loaded via invisible player
let wasmPreloaded = false;

function applyRuffleConfig(ruffle: RuffleInstance, config: RuffleConfig): void {
  if (!ruffle.config) {
    ruffle.config = {
      allowScriptAccess: config.allowScriptAccess,
      base: config.baseUrl || window.location.href,
      autoplay: config.autoplay || "on",
      unmuteOverlay: "hidden",
      letterbox: "on",
      warnOnUnsupportedContent: false,
      contextMenu: config.contextMenu ?? "on",
      showSwfDownload: false,
      upgradeToHttps: config.upgradeToHttps,
      maxExecutionDuration: config.maxExecutionDuration,
    };
  }
}

/**
 * Loads the Ruffle script if not already loaded
 * @param config Optional configuration object
 * @returns Promise that resolves to the RufflePlayer object
 */
export const loadRuffle = async (
  config: RuffleConfig = defaultRuffleConfig
): Promise<RuffleInstance | undefined> => {
  // If a loading process is already in progress, return that promise
  if (ruffleLoadPromise) {
    console.log("Ruffle loading already in progress, reusing promise");
    return ruffleLoadPromise;
  }

  // If Ruffle is already loaded, return it immediately
  if (isRuffleLoaded()) {
    console.log("Ruffle already loaded");
    const ruffle = window.RufflePlayer!;
    applyRuffleConfig(ruffle, config);
    return ruffle;
  }

  console.log("Loading Ruffle resources...");

  // Create a new loading promise using callbacks to avoid async executor
  ruffleLoadPromise = new Promise<RuffleInstance | undefined>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = config.ruffleScriptPath;
    script.async = true;
    document.head.appendChild(script);

    const timeoutId = setTimeout(() => {
      if (!isRuffleLoaded()) {
        console.error("Timeout waiting for Ruffle to load");
        ruffleLoadPromise = null;
        reject(new Error("Timeout loading Ruffle"));
      }
    }, config.loadTimeout);

    script.onload = () => {
      clearTimeout(timeoutId);
      console.log("Ruffle script loaded");
      if (window.RufflePlayer) {
        applyRuffleConfig(window.RufflePlayer, config);
      }
      resolve(window.RufflePlayer);
    };

    script.onerror = (e) => {
      clearTimeout(timeoutId);
      console.error("Error loading Ruffle script:", e);
      ruffleLoadPromise = null;
      reject(new Error("Failed to load Ruffle script"));
    };
  });

  return ruffleLoadPromise;
};

/**
 * Creates an invisible Ruffle player to preload WASM download
 * @param config Optional configuration object
 */
export const createInvisiblePlayer = async (
  config: RuffleConfig = defaultRuffleConfig
): Promise<void> => {
  // If WASM has already been preloaded, don't do it again
  if (wasmPreloaded) {
    console.log("WASM already preloaded, skipping invisible player creation");
    return;
  }

  try {
    const rufflePlayer = await loadRuffle(config);

    if (!rufflePlayer?.newest) {
      console.error("RufflePlayer.newest not available after script load");
      return;
    }

    console.log("Creating invisible Ruffle player to trigger WASM download...");
    const ruffleConstructor = rufflePlayer.newest();

    // Create a container that will never be visible
    const invisibleContainer = document.createElement("div");
    invisibleContainer.style.position = "absolute";
    invisibleContainer.style.width = "1px";
    invisibleContainer.style.height = "1px";
    invisibleContainer.style.opacity = "0";
    invisibleContainer.style.pointerEvents = "none";
    invisibleContainer.style.overflow = "hidden";
    invisibleContainer.style.left = "-9999px";
    invisibleContainer.style.top = "-9999px";
    document.body.appendChild(invisibleContainer);

    // Create the actual player
    const invisiblePlayer = ruffleConstructor.createPlayer();
    invisibleContainer.appendChild(invisiblePlayer);

    try {
      // Use the actual SWF file from config to trigger WASM download
      invisiblePlayer.load({
        // Provide a fallback if preloadFile is undefined
        url: config.preloadFile || "/banners/edited/auricom.fws",
        autoplay: false,
        unmuteOverlay: "hidden",
        splashScreen: false,
        base: window.location.href
      });
    } catch (error) {
      console.warn("Error during SWF preloading:", error);
    }
    
    // Mark as preloaded
    wasmPreloaded = true;
    console.log("Invisible Ruffle player created, WASM download triggered");

    // Remove after a delay
    setTimeout(() => {
      if (document.body.contains(invisibleContainer)) {
        document.body.removeChild(invisibleContainer);
        console.log("Removed temporary Ruffle player");
      }
    }, config.loadTimeout);
  } catch (playerError) {
    console.error("Error creating invisible Ruffle player:", playerError);
  }
};

/**
 * Resets the Ruffle loading state - mainly for testing purposes
 */
export const resetRuffleLoadState = (): void => {
  ruffleLoadPromise = null;
  wasmPreloaded = false;
  console.log("Ruffle loading state has been reset");
};