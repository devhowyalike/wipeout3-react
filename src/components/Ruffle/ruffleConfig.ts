import { RuffleConfig } from "@/types/RufflePlayer.types";

// Determine the script path based on environment
const getRuffleScriptPath = (): string => {
  return "/ruffle/ruffle.js";
};

/** Default Ruffle Flash emulator configuration used for banner playback. */
export const defaultRuffleConfig: RuffleConfig = {
  // App config
  ruffleScriptPath: getRuffleScriptPath(),
  loadTimeout: 5000,
  // small, blank file to trigger WASM preload
  preloadFile: "/banners/edited/preloader.fws",
  debug: false,
  
  // Player config
  allowScriptAccess: false,
  baseUrl: window.location.href,
  autoplay: "on",
  upgradeToHttps: window.location.protocol === "https:",
  maxExecutionDuration: 15
};