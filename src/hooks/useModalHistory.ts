import { useRef, useEffect } from "react";

/**
 * Controls how the hook manages the browser history stack while a modal is open.
 *
 * - `"none"` — no modal session is active; the history stack is untouched.
 * - `"synthetic"` — a fake `pushState` entry was added so the browser back
 *   button has somewhere to land. Used on first-entry / direct-load visits
 *   where there is no prior same-document entry to intercept.
 * - `"intercept"` — the modal was opened during normal in-app navigation, so
 *   the existing history entry is reused. A `popstate` listener catches the
 *   browser back button and cancels the traversal with `history.forward()`,
 *   avoiding a stale forward-stack entry after close.
 */
type ModalHistoryMode = "none" | "synthetic" | "intercept";

function canInterceptBrowserBack() {
  const state = window.history.state as { idx?: unknown } | null;
  return typeof state?.idx === "number" && state.idx > 0;
}

interface UseModalHistoryOptions {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Manages browser history integration for a modal so the back button closes
 * the modal instead of navigating away.
 *
 * Uses in-place back-button interception during normal in-app navigation, and
 * falls back to a synthetic history entry on first-entry/direct-load visits.
 */
export function useModalHistory({ isOpen, onClose }: UseModalHistoryOptions) {
  const modalHistoryMode = useRef<ModalHistoryMode>("none");
  const modalHistoryPushed = useRef(false);
  const ignoreNextPopState = useRef(false);
  const modalTriggerRef = useRef<HTMLElement | null>(null);

  const restoreTriggerFocus = () => {
    const trigger = modalTriggerRef.current;
    if (!trigger) return;

    requestAnimationFrame(() => {
      if (trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    });
  };

  const requestClose = () => {
    onClose();
    restoreTriggerFocus();

    if (
      modalHistoryMode.current === "synthetic" &&
      modalHistoryPushed.current
    ) {
      modalHistoryPushed.current = false;
      window.history.back();
    }

    modalHistoryMode.current = "none";
  };

  const prepareOpen = (trigger: HTMLElement) => {
    modalTriggerRef.current = trigger;

    if (canInterceptBrowserBack()) {
      modalHistoryMode.current = "intercept";
      modalHistoryPushed.current = false;
    } else {
      window.history.pushState({ modal: true }, "");
      modalHistoryMode.current = "synthetic";
      modalHistoryPushed.current = true;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      if (ignoreNextPopState.current) {
        ignoreNextPopState.current = false;
        return;
      }

      if (
        modalHistoryMode.current === "synthetic" &&
        modalHistoryPushed.current
      ) {
        modalHistoryPushed.current = false;
        modalHistoryMode.current = "none";
        onClose();
        restoreTriggerFocus();
        return;
      }

      if (modalHistoryMode.current === "intercept") {
        modalHistoryMode.current = "none";
        onClose();
        restoreTriggerFocus();
        ignoreNextPopState.current = true;
        window.history.forward();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);

  return { prepareOpen, requestClose };
}
