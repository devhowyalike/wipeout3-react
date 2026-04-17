import {
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  useShowModal,
  type InitialFocusStrategy,
} from "@/hooks/useShowModal";
import FilterOverlays from "@/components/FilterOverlays";

interface BaseDialogProps extends ComponentPropsWithoutRef<"dialog"> {
  portal?: boolean;
  closeOnBackdrop?: boolean;
  onClose?: () => void;
  initialFocus?: InitialFocusStrategy;
  initialFocusRef?: RefObject<HTMLElement | null>;
  focusVisible?: boolean;
}

/**
 * Thin wrapper around `<dialog>` that owns the ref / `useShowModal` lifecycle
 * and optionally renders through a portal. Consumers control escape-key
 * behaviour, close buttons, and inner layout independently.
 */
export function BaseDialog({
  portal = true,
  closeOnBackdrop = false,
  onClose,
  initialFocus,
  initialFocusRef,
  focusVisible,
  onClick,
  children,
  ...rest
}: BaseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // `useShowModal` registers `dialogId` with the shared `dialogStack` when
  // it calls `.showModal()` and removes it on `.close()` / unmount. The
  // stack drives `FilterOverlays` so only the top-most open dialog renders
  // filters — see `dialogStack.ts` for rationale.
  const dialogId = useId();
  useShowModal(dialogRef, {
    initialFocus,
    initialFocusRef,
    focusVisible,
    dialogId,
  });

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
    onClick?.(e);
  };

  const dialog = (
    <dialog ref={dialogRef} aria-modal="true" onClick={handleClick} {...rest}>
      {children}
      {/* Filters registered in FILTER_REGISTRY render here so they join the
          browser's top layer alongside the dialog and overlay modal content.
          Only the top-most dialog's instance actually renders — the root
          `CRTEffects` overlay and any underlying dialog overlays stand down
          to avoid stacking multiple filter canvases. */}
      <FilterOverlays dialogId={dialogId} />
    </dialog>
  );

  if (portal) return createPortal(dialog, document.body);
  return dialog;
}
