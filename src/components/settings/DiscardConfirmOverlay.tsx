import { useEscapeKey } from "../useEscapeKey";
import { BaseDialog } from "../ui/BaseDialog";
import { AngledButton } from "../ui/AngledButton";

interface DiscardConfirmOverlayProps {
  onDiscard: () => void;
  onEdit: () => void;
}

const HEADING_ID = "discard-confirm-heading";

/**
 * Blocking overlay when closing settings with unsaved draft: discard (lose changes) or keep editing.
 */
export function DiscardConfirmOverlay({
  onDiscard,
  onEdit,
}: DiscardConfirmOverlayProps) {
  useEscapeKey(onEdit);

  return (
    <BaseDialog
      portal={false}
      role="alertdialog"
      aria-labelledby={HEADING_ID}
      className="bg-page flex flex-col items-center justify-center gap-6"
    >
      <span
        id={HEADING_ID}
        className="font-wipeout3 text-w3-fluid-xl tracking-[.01em] leading-[.875] lowercase text-nav"
      >
        Unsaved
        <br />
        changes
      </span>
      <div className="flex items-center gap-2">
        <AngledButton variant="secondary" onClick={onDiscard}>
          Discard
        </AngledButton>
        <AngledButton variant="primary" onClick={onEdit}>
          Edit
        </AngledButton>
      </div>
    </BaseDialog>
  );
}
