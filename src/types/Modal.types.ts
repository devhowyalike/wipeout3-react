import type { ReactNode, RefObject } from "react";
import type { InitialFocusStrategy } from "@/hooks/useShowModal";

/** Props for the `Modal` component that renders content as an overlay or popup window. */
export interface ModalProps {
  children: ReactNode;
  // Dimensions for popup window
  popUpWidth?: number;
  popUpHeight?: number;
  // Dimensions for modal (can use vw, px, etc.)
  modalWidth?: string | number;
  modalHeight?: string | number;
  // Legacy props for backward compatibility
  // Controls both popup and modal
  width?: number;
  height?: number;
  // Override modal behavior and force popup
  // Only available in large breakpoint
  isPopUp?: boolean;
  // Callback when modal is closed
  onClose?: () => void;
  // Optional accessible-name source for the underlying dialog
  labelledBy?: string;
  // Optional direct accessible name for the underlying dialog
  label?: string;
  // Optional initial-focus strategy forwarded to BaseDialog
  initialFocus?: InitialFocusStrategy;
  // Optional initial-focus target forwarded to BaseDialog
  initialFocusRef?: RefObject<HTMLElement | null>;
}