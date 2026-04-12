import { useEffect, type RefObject } from "react";
import { getLastInputModality } from "@/utils/inputModality";

export type InitialFocusStrategy =
  | "dialog"
  | "first-control"
  | "safe-action";

interface UseShowModalOptions {
  initialFocus?: InitialFocusStrategy;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'button:not(:disabled), [href], input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
const SAFE_ACTION = "[data-dialog-safe-action]";

function prepareFocusTarget(target: HTMLElement | null) {
  if (!target) return null;
  if (!target.matches(FOCUSABLE) && !target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  return target;
}

function getInitialFocusTarget(
  dialog: HTMLDialogElement,
  initialFocus: InitialFocusStrategy,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const explicitTarget = prepareFocusTarget(initialFocusRef?.current ?? null);
  if (explicitTarget) return explicitTarget;

  if (initialFocus === "safe-action") {
    const target = dialog.querySelector<HTMLElement>(SAFE_ACTION);
    if (target) return target;
  }

  if (initialFocus === "first-control") {
    return dialog.querySelector<HTMLElement>(FOCUSABLE);
  }

  return dialog;
}

/**
 * Calls `.showModal()` on mount and `.close()` on cleanup, promoting the
 * `<dialog>` to the top layer with native focus trapping, background
 * inertness, and scroll blocking.
 *
 * Also suppresses the native `cancel` event (Escape key) with a direct DOM
 * listener. React's `onCancel` prop doesn't work for portaled dialogs because
 * `cancel` doesn't bubble and React's delegation never intercepts it. Escape
 * handling is left to the centralised `EscapeNavigation` keydown listener.
 *
 * On teardown, keyboard-opened dialogs restore focus to the opener when
 * possible. This avoids an intermittent state where the browser keeps focus on
 * a removed dialog control, causing later Escape presses to miss the
 * page-level navigation handler, without re-focusing pointer-triggered links
 * and buttons.
 */
export function useShowModal(
  ref: RefObject<HTMLDialogElement | null>,
  { initialFocus = "dialog", initialFocusRef }: UseShowModalOptions = {},
) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const openedViaKeyboard = getLastInputModality() === "keyboard";

    // Blur the trigger so its focus ring doesn't bleed through the backdrop.
    // Done for all modalities because VoiceOver's navigation keys (VO+Arrow)
    // carry ctrlKey and are misclassified as "pointer" by the modality tracker.
    previousActiveElement?.blur();

    dialog.showModal();

    // Park focus on the dialog container first so VoiceOver registers the
    // dialog context before we move to a more specific target.
    dialog.setAttribute("tabindex", "-1");
    dialog.focus();

    const target = getInitialFocusTarget(dialog, initialFocus, initialFocusRef);
    const shouldMoveFocus = target !== dialog;

    // setTimeout (not requestAnimationFrame) is required because VoiceOver
    // needs actual processing time — not just one paint frame — to absorb the
    // top-layer promotion before it will follow a focus change.
    // `:focus-visible` suppresses the ring on pointer-opened dialogs in all
    // browsers that this project targets (Chrome 86+, Firefox 85+, Safari 15.4+).
    const focusTimer = shouldMoveFocus
      ? setTimeout(() => {
          target?.focus();
        }, 50)
      : null;

    const preventCancel = (e: Event) => e.preventDefault();
    dialog.addEventListener("cancel", preventCancel);

    return () => {
      if (focusTimer !== null) clearTimeout(focusTimer);
      dialog.removeEventListener("cancel", preventCancel);

      // If the browser still considers a dialog descendant focused, clear that
      // stale active element before the dialog leaves the top layer.
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement && dialog.contains(activeElement)) {
        activeElement.blur();
      }
      if (dialog.open) dialog.close();

      if (openedViaKeyboard) {
        requestAnimationFrame(() => {
          if (previousActiveElement?.isConnected) {
            previousActiveElement.focus({ preventScroll: true });
            return;
          }

          // Fallback for cases where the opener unmounted while the modal was open.
          const main = document.querySelector("main");
          if (main instanceof HTMLElement) {
            main.focus({ preventScroll: true });
          }
        });
      }
    };
  }, [initialFocus, initialFocusRef, ref]);
}
