import { useCallback } from "react";
import { soundManager, UISound } from "@/utils/soundManager";

const UI_SOUNDS: Record<string, UISound> = {
  hover: { src: "/audio/hover.mp3", volume: 0.4 },
  click: { src: "/audio/select.mp3", volume: 0.4 },
} as const;

type UISoundType = keyof typeof UI_SOUNDS;

Object.entries(UI_SOUNDS).forEach(([id, config]) => {
  soundManager.registerSound(id, config);
});
soundManager.schedulePrefetch();

/**
 * Returns a stable callback that plays the registered UI sound for `soundType` via `soundManager`.
 *
 * @param soundType - Key into the `UI_SOUNDS` map (e.g. `"hover"`, `"click"`).
 */
export function useUISound(soundType: UISoundType) {
  const play = useCallback(() => {
    void soundManager.playSound(soundType);
  }, [soundType]);

  return play;
}

/** Returns pre-bound play callbacks for the hover and click UI sounds. */
export function useUISounds() {
  const playHoverSound = useUISound("hover");
  const playClickSound = useUISound("click");
  return { playHoverSound, playClickSound };
}
