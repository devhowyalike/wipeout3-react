import type { RufflePlayerProps } from "@/types/RufflePlayer.types";
import type { RufflePlayerHandle } from "@/components/Ruffle/RufflePlayer";

/** Props shared by the `Banner`, `BannerRuffle`, and `BannerVideo` components. */
export interface BannerProps extends Omit<RufflePlayerProps, 'swfPath'> {
  // swfPath is only required for BannerRuffle
  swfPath?: string;
  disablePopupHandling?: boolean;
  onClose?: () => void;
  bannerId: string;
}

/** Imperative handle exposed by `Banner` and `BannerVideo` via `forwardRef`. */
export interface BannerHandle {
  cleanup: () => void;
}

/** Extended imperative handle for `BannerRuffle` that also exposes the underlying Ruffle player. */
export interface BannerRuffleHandle extends BannerHandle {
  getRufflePlayer: () => RufflePlayerHandle | null;
}