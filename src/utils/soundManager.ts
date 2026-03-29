import type { Howl } from "howler";

interface SoundState {
  isInitialized: boolean;
  isMuted: boolean;
}

/** Registration descriptor for a UI sound effect (source path and optional volume). */
export interface UISound {
  src: string;
  volume?: number;
}

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, Howl> = new Map();
  private configs: Map<string, UISound> = new Map();
  private stateListeners: Set<(state: SoundState) => void> = new Set();
  private howlerModulePromise: Promise<typeof import("howler")> | null = null;

  private _isInitialized: boolean = false;
  private _isMuted: boolean = true;
  private _navigationLocked: boolean = false;
  private _navLockFallback: ReturnType<typeof setTimeout> | null = null;
  private _prefetchScheduled: boolean = false;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public initialize(): void {
    if (this._isInitialized) return;
    this._isInitialized = true;
    this._isMuted = false;
    this.notifyListeners();
    void this.ensureHowlerLoaded();
  }

  public registerSound(id: string, config: UISound): void {
    if (!this.configs.has(id)) {
      this.configs.set(id, config);
    }
  }

  private async ensureHowlerLoaded(): Promise<typeof import("howler")> {
    if (!this.howlerModulePromise) {
      this.howlerModulePromise = import("howler").then(mod => {
        this.setupVisibilityResume(mod.Howler);
        return mod;
      });
    }

    const howlerModule = await this.howlerModulePromise;
    howlerModule.Howler.mute(this._isMuted);
    return howlerModule;
  }

  // Browsers (especially mobile Safari) suspend the AudioContext when the tab
  // is hidden or the device sleeps. On desktop, resuming on visibilitychange is
  // enough. On mobile, ctx.resume() requires an active user gesture, so the
  // visibilitychange call is silently ignored — we also hook touchstart/click
  // to catch the first interaction after waking and retry the resume there.
  private setupVisibilityResume(Howler: typeof import("howler").Howler): void {
    const tryResume = () => {
      const ctx = Howler.ctx as AudioContext | undefined;
      if (ctx?.state === "suspended") {
        void ctx.resume();
      }
    };

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") tryResume();
    });

    // Passive interaction listeners that fire within a user-gesture scope so
    // mobile browsers permit ctx.resume(). These stay registered permanently
    // and are cheap — tryResume() exits immediately if ctx is not suspended.
    document.addEventListener("touchstart", tryResume, { passive: true });
    document.addEventListener("click", tryResume);
  }

  private async getOrCreateHowl(soundId: string): Promise<Howl | undefined> {
    let howl = this.sounds.get(soundId);
    if (howl) return howl;

    const config = this.configs.get(soundId);
    if (!config) return undefined;

    const { Howl } = await this.ensureHowlerLoaded();

    howl = new Howl({
      src: [config.src],
      volume: config.volume ?? 0.4,
      preload: true,
    });
    this.sounds.set(soundId, howl);
    return howl;
  }

  /**
   * Eagerly load Howler and create Howl instances for every registered sound
   * during browser idle time so the first hover/click has zero startup cost.
   * Safe to call multiple times; only the first invocation schedules work.
   */
  public schedulePrefetch(): void {
    if (this._prefetchScheduled) return;
    this._prefetchScheduled = true;

    const run = () => {
      for (const id of this.configs.keys()) {
        void this.getOrCreateHowl(id);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 1);
    }
  }

  // Called synchronously when a menu link is tapped. Suppresses sounds until
  // the user makes a genuine new touchstart, preventing ghost mouse events
  // synthesized from the original touch firing sounds on the newly loaded page.
  public lockForNavigation(): void {
    this._navigationLocked = true;

    const unlock = () => {
      this._navigationLocked = false;
      if (this._navLockFallback) {
        clearTimeout(this._navLockFallback);
        this._navLockFallback = null;
      }
      document.removeEventListener("touchstart", unlock);
    };

    // touchstart is never synthesized — it only fires from a real finger press
    document.addEventListener("touchstart", unlock, { once: true, passive: true });
    // Fallback for non-touch environments so the lock doesn't persist forever
    if (this._navLockFallback) clearTimeout(this._navLockFallback);
    this._navLockFallback = setTimeout(unlock, 1500);
  }

  public async playSound(soundId: string): Promise<void> {
    if (!this._isInitialized || this._isMuted || this._navigationLocked) return;

    const sound = await this.getOrCreateHowl(soundId);
    if (sound) {
      if (sound.playing()) {
        sound.stop();
      }
      sound.play();
    }
  }

  public subscribe(listener: (state: SoundState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.getState());
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.stateListeners.forEach(listener => listener(state));
  }

  public getState(): SoundState {
    return {
      isInitialized: this._isInitialized,
      isMuted: this._isMuted
    };
  }

  public mute(muted: boolean): void {
    this._isMuted = muted;
    this.notifyListeners();
    void this.ensureHowlerLoaded().then(({ Howler }) => {
      if (muted) {
        Howler.mute(true);
      } else {
        // Fade in over 80ms to avoid the click/pop caused by a hard gain jump
        Howler.mute(false);
        const ctx = Howler.ctx as AudioContext | undefined;
        const masterGain = Howler.masterGain as GainNode | undefined;
        if (ctx && masterGain) {
          const now = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(0, now);
          masterGain.gain.linearRampToValueAtTime(1, now + 0.08);
        }
      }
    });
  }

  public toggleMute(): void {
    this.mute(!this._isMuted);
  }

  public dispose(): void {
    this.sounds.forEach(sound => sound.unload());
    this.sounds.clear();
    this.configs.clear();
    this.stateListeners.clear();
  }
}

/**
 * Singleton `SoundManager` for all UI sounds: lazy-loads Howler, tracks mute/init,
 * and plays registered effects. Use this instance app-wide.
 */
export const soundManager = SoundManager.getInstance();

// Auto-initialize on first user interaction so sound works even when the
// SoundToggle button is hidden (e.g. Pure mode / SOUND_TOGGLE_ENABLED=false).
document.addEventListener(
  "click",
  () => soundManager.initialize(),
  { once: true },
);