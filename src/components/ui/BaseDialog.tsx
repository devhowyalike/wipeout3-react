import { useRef, type ComponentPropsWithoutRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  useShowModal,
  type InitialFocusStrategy,
} from "@/hooks/useShowModal";

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
  useShowModal(dialogRef, { initialFocus, initialFocusRef, focusVisible });

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
    onClick?.(e);
  };

  const dialog = (
    <dialog ref={dialogRef} aria-modal="true" onClick={handleClick} {...rest}>
      {children}
    </dialog>
  );

  if (portal) return createPortal(dialog, document.body);
  return dialog;
}
