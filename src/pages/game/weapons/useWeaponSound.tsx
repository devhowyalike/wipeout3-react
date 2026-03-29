import { useCallback, useRef } from "react";
import { Howl } from "howler";
import { soundManager } from "@/utils/soundManager";
import { WEAPON_SOUND_PATH } from "./weaponConstants";

const soundCache = new Map<string, Howl>();

function getOrCreateHowl(soundFile: string): Howl {
  let howl = soundCache.get(soundFile);
  if (!howl) {
    howl = new Howl({
      src: [WEAPON_SOUND_PATH + soundFile],
      volume: 0.2,
      preload: true,
    });
    soundCache.set(soundFile, howl);
  }
  return howl;
}

/**
 * Eagerly constructs `Howl` instances for each file so audio is preloaded and ready for instant playback.
 *
 * @param soundFiles - Array of filenames relative to `WEAPON_SOUND_PATH`.
 */
export function preloadAllWeaponSounds(soundFiles: string[]): void {
  for (const soundFile of soundFiles) {
    getOrCreateHowl(soundFile);
  }
}

/**
 * Returns a callback that plays the weapon clip for `soundFile`, no-op when sound is muted or the manager
 * is not initialized yet.
 *
 * @param soundFile - Filename relative to `WEAPON_SOUND_PATH`.
 */
export function useWeaponSound(soundFile: string) {
  const soundRef = useRef<Howl | null>(null);

  const playSound = useCallback(() => {
    const state = soundManager.getState();
    if (!state.isInitialized || state.isMuted) return;

    if (!soundRef.current) {
      soundRef.current = getOrCreateHowl(soundFile);
    }

    soundRef.current.play();
  }, [soundFile]);

  return playSound;
}
