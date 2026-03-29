interface DiscardConfirmOverlayProps {
  onDiscard: () => void;
  onEdit: () => void;
}

/**
 * Blocking overlay when closing settings with unsaved draft: discard (lose changes) or keep editing.
 */
export function DiscardConfirmOverlay({
  onDiscard,
  onEdit,
}: DiscardConfirmOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-page">
      <span className="font-wipeout3 text-w3-fluid-xl tracking-[.01em] leading-[.875] lowercase text-nav">
        Unsaved
        <br />
        changes
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          className="angled-corner-sm bg-white/20 hover:bg-white/30 px-6 h-7 uppercase text-xs font-extrabold tracking-wide text-nav cursor-pointer transition-colors"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="angled-corner-sm bg-accent-primary hover:bg-accent-primary-hover px-6 h-7 uppercase text-xs font-extrabold tracking-wide text-white cursor-pointer transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
