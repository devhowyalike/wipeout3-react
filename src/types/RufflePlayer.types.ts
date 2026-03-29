import React from 'react';

// Define the window.RufflePlayer global interface
declare global {
  interface Window {
    RufflePlayer?: RuffleInstance;
  }
}

/** Configuration object that Ruffle reads from `window.RufflePlayer.config`. */
export interface RuffleWindowConfig {
  allowScriptAccess?: boolean;
  base?: string;
  autoplay?: string;
  unmuteOverlay?: string;
  letterbox?: string;
  warnOnUnsupportedContent?: boolean;
  contextMenu?: string;
  showSwfDownload?: boolean;
  upgradeToHttps?: boolean;
  maxExecutionDuration?: number;
}

/** Top-level Ruffle object exposed on `window.RufflePlayer`. */
export interface RuffleInstance {
  newest?: () => RuffleConstructor;
  config?: RuffleWindowConfig;
}

/** Factory returned by `RuffleInstance.newest()` for creating player elements. */
export interface RuffleConstructor {
  createPlayer: () => RufflePlayerElement;
}

/** DOM element created by `RuffleConstructor.createPlayer()` that plays SWF content. */
export interface RufflePlayerElement extends HTMLElement {
  load: (options: RuffleLoadOptions) => void;
  play?: () => void;
  pause?: () => void;
  destroy?: () => void;
}

/** Consolidated app + player configuration passed to the Ruffle loading utilities. */
export interface RuffleConfig {
  // Player configuration options
  allowScriptAccess?: boolean;
  base?: string;
  baseUrl?: string;
  autoplay?: string;
  unmuteOverlay?: string;
  letterbox?: string;
  warnOnUnsupportedContent?: boolean;
  contextMenu?: string;
  showSwfDownload?: boolean;
  upgradeToHttps?: boolean;
  maxExecutionDuration?: number;
  
  // These are required
  // Path to the Ruffle script
  ruffleScriptPath: string;
  // Timeout for loading operations
  loadTimeout: number;
  // Path for preloading WASM
  preloadFile?: string;
  // Show debug info in console
  debug?: boolean;
}

/** Options passed to `RufflePlayerElement.load()` when loading a SWF file. */
export interface RuffleLoadOptions {
  url: string;
  autoplay?: boolean;
  backgroundColor?: string;
  letterbox?: string;
  unmuteOverlay?: string;
  parameters?: Record<string, string>;
  splashScreen?: boolean;
  base?: string;
}

/** Props for the `RufflePlayer` React component. */
export interface RufflePlayerProps {
  // Path to the SWF file to play
  swfPath: string;
  
  // Width of the player (CSS value)
  width?: string | number;
  
  // Height of the player (CSS value)
  height?: string | number;
  
  // Whether to automatically play the SWF
  autoplay?: boolean;
  
  // Aspect ratio of the player (width/height)
  aspectRatio?: number;
  
  // Maximum percentage of viewport width
  viewportPercentage?: number;
}

/** `RufflePreloader` component type augmented with a static `preloadRuffle` method. */
export interface RufflePreloaderComponent extends React.FC {
  preloadRuffle: () => Promise<void>;
}