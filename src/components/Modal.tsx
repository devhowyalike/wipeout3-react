import { useEffect, useState, useRef, useCallback } from "react";
import { useModal } from "@/hooks/useModal";
import { ModalProps } from "@/types/Modal.types";
import { useEscapeKey } from "./useEscapeKey";
import { BaseDialog } from "./ui/BaseDialog";
import { ModalCloseButton } from "./ui/ModalCloseButton";

interface ModalDialogProps {
  children: ModalProps["children"];
  onClose: () => void;
  dialogName?: string;
  labelledBy?: string;
  initialFocus?: ModalProps["initialFocus"];
  initialFocusRef?: ModalProps["initialFocusRef"];
  finalModalWidth: string | number;
  aspectRatio: number;
}

function ModalDialog({
  children,
  onClose,
  dialogName,
  labelledBy,
  initialFocus,
  initialFocusRef,
  finalModalWidth,
  aspectRatio,
}: ModalDialogProps) {
  useEscapeKey(onClose);

  // When a label is provided and the caller hasn't specified an explicit focus
  // target, automatically focus a sr-only span so VoiceOver announces the
  // dialog name as the landing announcement instead of the first control.
  const labelFocusRef = useRef<HTMLSpanElement>(null);
  const dialogFocusRef = initialFocusRef ?? (dialogName ? labelFocusRef : undefined);

  // Convert number to pixel string if needed for modal dimensions
  const getStyleValue = (value: string | number) => {
    if (typeof value === "number") {
      return `${value}px`;
    }
    return value;
  };

  return (
    <BaseDialog
      closeOnBackdrop
      onClose={onClose}
      aria-label={dialogName}
      aria-labelledby={labelledBy}
      initialFocus={initialFocus}
      initialFocusRef={dialogFocusRef}
      className="bg-page"
      data-overlay="true"
    >
      <div className="w3-app-max-width mx-auto relative flex h-full w-full items-center justify-center px-6 py-4 pointer-events-none">
        {dialogName && !initialFocusRef && (
          <span ref={labelFocusRef} tabIndex={-1} className="sr-only">
            {dialogName}
          </span>
        )}
        <div
          className="relative w-full pointer-events-auto"
          style={{
            maxWidth: getStyleValue(finalModalWidth),
            maxHeight: "90vh",
            aspectRatio: aspectRatio,
          }}
        >
          <div className="h-full w-full">{children}</div>
        </div>

        <ModalCloseButton onClick={onClose} />
      </div>
    </BaseDialog>
  );
}

/**
 * Renders content as a centered modal overlay (with portal) or delegates to a browser popup window,
 * depending on screen size and user preference.
 */
export function Modal({
  children,
  popUpWidth,
  popUpHeight,
  modalWidth,
  width = 400,
  height = 400,
  isPopUp,
  onClose,
  label,
  labelledBy,
  initialFocus,
  initialFocusRef,
}: ModalProps) {
  const dialogName = label ?? (labelledBy ? undefined : "Dialog");

  const { isModalEnabled, openPopup } = useModal(isPopUp);
  const [isOpen, setIsOpen] = useState(true);
  const popupWindowRef = useRef<Window | null>(null);
  const popupCloseTimeoutRef = useRef<number | null>(null);

  // Handle legacy props and defaults
  const finalPopUpWidth = popUpWidth || width;
  const finalPopUpHeight = popUpHeight || height;
  const finalModalWidth = modalWidth || width;
  const aspectRatio = finalPopUpWidth / finalPopUpHeight;

  useEffect(() => {
    if (popupCloseTimeoutRef.current !== null) {
      window.clearTimeout(popupCloseTimeoutRef.current);
      popupCloseTimeoutRef.current = null;
    }

    // Open the popup only when modal mode is disabled.
    if (isModalEnabled) {
      if (popupWindowRef.current && !popupWindowRef.current.closed) {
        popupWindowRef.current.close();
      }
      popupWindowRef.current = null;
      return;
    }

    if (!popupWindowRef.current || popupWindowRef.current.closed) {
      const popup = openPopup(
        finalPopUpWidth,
        finalPopUpHeight,
        children,
        onClose,
      );
      if (popup) {
        popupWindowRef.current = popup;
      }
    }

    return () => {
      if (popupWindowRef.current && !popupWindowRef.current.closed) {
        const popupToClose = popupWindowRef.current;
        popupCloseTimeoutRef.current = window.setTimeout(() => {
          if (popupToClose && !popupToClose.closed) {
            popupToClose.close();
          }
          if (popupWindowRef.current === popupToClose) {
            popupWindowRef.current = null;
          }
        }, 100);
      }
    };
  }, [
    isModalEnabled,
    finalPopUpWidth,
    finalPopUpHeight,
    openPopup,
    children,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  // Don't render if we're not in modal mode or if it's closed
  if (!isOpen || !isModalEnabled) return null;

  return (
    <ModalDialog
      onClose={handleClose}
      dialogName={dialogName}
      labelledBy={labelledBy}
      initialFocus={initialFocus}
      initialFocusRef={initialFocusRef}
      finalModalWidth={finalModalWidth}
      aspectRatio={aspectRatio}
    >
      {children}
    </ModalDialog>
  );
}
