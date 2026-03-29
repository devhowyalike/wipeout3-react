import { useState, useEffect } from "react";
import { soundManager } from "@/utils/soundManager";

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 5.5a9 9 0 0 1 0 13"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m16 9 5 6" strokeWidth="2" strokeLinecap="round" />
      <path d="m21 9-5 6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Button that toggles global mute via {@link soundManager}, showing volume on/off icons.
 * Subscribes to sound state so the control stays in sync with other callers.
 */
export default function SoundToggle() {
  const [state, setState] = useState(() => soundManager.getState());

  useEffect(() => {
    return soundManager.subscribe(setState);
  }, []);

  const toggleSound = () => {
    soundManager.toggleMute();
  };

  return (
    <button
      onClick={toggleSound}
      type="button"
      aria-label={!state.isMuted ? "Turn sound off" : "Turn sound on"}
      tabIndex={0}
      className="inline-flex h-7 w-9 items-center justify-center angled-corner-sm bg-white/40 text-neutral-900 transition-colors hover:bg-neutral-100/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/40 dark:text-neutral-900 dark:hover:bg-neutral-100/80"
    >
      {!state.isMuted ? <VolumeOnIcon /> : <VolumeOffIcon />}
    </button>
  );
}
