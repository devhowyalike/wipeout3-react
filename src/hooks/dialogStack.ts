import { useSyncExternalStore } from "react";

/**
 * Module-level stack of open `<dialog>` ids, used to coordinate which
 * `FilterOverlays` instance is active at any given time.
 *
 * Native `<dialog>`s promoted to the top layer (via `.showModal()`) render
 * above the root-level filter canvas, so each `BaseDialog` also mounts its
 * own `FilterOverlays` as a child — that copy joins the dialog in the top
 * layer. Without coordination, the root overlay and the dialog's overlay
 * would both render at the same time, each spawning its own WebGL2 canvas
 * and RAF loop, doubling the `mix-blend-mode: multiply` effect.
 *
 * This store tracks every open dialog so:
 * - The root `FilterOverlays` only renders when the stack is empty.
 * - A dialog's `FilterOverlays` only renders when that dialog is top-most
 *   (relevant for nested dialogs such as `DiscardConfirmOverlay` opening on
 *   top of `SettingsModal`).
 */

const stack: string[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Push a dialog id onto the stack. Safe against duplicate pushes. */
export function pushDialog(id: string) {
  if (stack.includes(id)) return;
  stack.push(id);
  emit();
}

/** Remove a dialog id from the stack. Safe to call with unknown ids. */
export function popDialog(id: string) {
  const idx = stack.indexOf(id);
  if (idx === -1) return;
  stack.splice(idx, 1);
  emit();
}

function getTopId(): string | null {
  return stack.length === 0 ? null : stack[stack.length - 1];
}

/** Reactive id of the top-most open dialog, or `null` if none are open. */
export function useTopDialogId(): string | null {
  return useSyncExternalStore(subscribe, getTopId, getTopId);
}
