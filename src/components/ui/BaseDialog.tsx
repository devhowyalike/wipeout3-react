import { useRef, type ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";
import { useShowModal } from "@/hooks/useShowModal";

interface BaseDialogProps extends ComponentPropsWithoutRef<"dialog"> {
  portal?: boolean;
  closeOnBackdrop?: boolean;
  onClose?: () => void;
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
  onClick,
  children,
  ...rest
}: BaseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useShowModal(dialogRef);

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
    onClick?.(e);
  };

  const dialog = (
    <dialog ref={dialogRef} onClick={handleClick} {...rest}>
      {children}
    </dialog>
  );

  if (portal) return createPortal(dialog, document.body);
  return dialog;
}
