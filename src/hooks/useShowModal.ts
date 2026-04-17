import { useLayoutEffect, type RefObject } from "react";

declare global {
  interface FocusOptions {
    focusVisible?: boolean;
  }
}

export type InitialFocusStrategy =
  | "dialog"
  | "first-control"
  | "safe-action";

interface UseShowModalOptions {
  initialFocus?: InitialFocusStrategy;
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Pass `false` to suppress `:focus-visible` on the initial programmatic focus (e.g. auto-opened modals with no preceding user interaction). */
  focusVisible?: boolean;
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
 * On teardown, restores focus to the element that was active before the dialog
 * opened. This follows the ARIA dialog pattern and ensures screen readers
 * (including VoiceOver) regain their previous context after dismissal.
 */
export function useShowModal(
  ref: RefObject<HTMLDialogElement | null>,
  { initialFocus = "dialog", initialFocusRef, focusVisible }: UseShowModalOptions = {},
) {
  // `useLayoutEffect` (not `useEffect`) so `showModal()` runs after the DOM
  // commit but *before* the browser paints. With `useEffect`, an auto-opening
  // modal (e.g. `DisclaimerModal` on first load) would let the page behind it
  // — including skeleton loaders — paint for a frame before the dialog gets
  // promoted to the top layer, producing a visible flash.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // Blur the trigger so its focus ring doesn't bleed through the backdrop.
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
    const focusOpts: FocusOptions =
      focusVisible === false ? { focusVisible: false } : {};
    const focusTimer = shouldMoveFocus
      ? setTimeout(() => {
          target?.focus(focusOpts);
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

      if (previousActiveElement) {
        requestAnimationFrame(() => {
          if (previousActiveElement.isConnected) {
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
  }, [initialFocus, initialFocusRef, focusVisible, ref]);
}
