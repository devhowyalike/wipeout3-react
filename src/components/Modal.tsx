import { useEffect, useState, useRef } from "react";
import { useModal } from "@/hooks/useModal";
import { ModalProps } from "@/types/Modal.types";
import { useEscapeKey } from "./useEscapeKey";
import { BaseDialog } from "./ui/BaseDialog";
import { ModalCloseButton } from "./ui/ModalCloseButton";

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
  labelledBy,
  initialFocusRef,
}: ModalProps) {
  const { isModalEnabled, openPopup } = useModal(isPopUp);
  const [isOpen, setIsOpen] = useState(true);
  const popupWindowRef = useRef<Window | null>(null);
  const popupCloseTimeoutRef = useRef<number | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Handle legacy props and defaults
  const finalPopUpWidth = popUpWidth || width;
  const finalPopUpHeight = popUpHeight || height;
  const finalModalWidth = modalWidth || width;
  const aspectRatio = finalPopUpWidth / finalPopUpHeight;

  useEffect(() => {
    // Store the previously focused element when modal opens
    previousActiveElementRef.current = document.activeElement as HTMLElement;

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

  const handleClose = () => {
    setIsOpen(false);
    // Blur the previously focused element to remove active state
    if (previousActiveElementRef.current) {
      previousActiveElementRef.current.blur();
    }
    if (onClose) {
      onClose();
    }
  };

  // Register ESC key handler with centralized escape navigation
  useEscapeKey(handleClose);

  // Don't render if we're not in modal mode or if it's closed
  if (!isOpen || !isModalEnabled) return null;

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
      onClose={handleClose}
      aria-labelledby={labelledBy}
      initialFocusRef={initialFocusRef}
      className="bg-page"
      data-overlay="true"
    >
      <div className="w3-app-max-width mx-auto relative flex h-full w-full items-center justify-center px-6 py-4 pointer-events-none">
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

        <ModalCloseButton onClick={handleClose} />
      </div>
    </BaseDialog>
  );
}
