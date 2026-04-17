import { Suspense, useContext } from "react";
import { OptionsContext } from "@/context/OptionsContext";
import { FILTER_REGISTRY } from "@/config/filterRegistry";
import { useTopDialogId } from "@/hooks/dialogStack";

interface FilterOverlaysProps {
  /**
   * When mounted inside a `<dialog>`, pass the dialog's id (as registered
   * in `dialogStack`). The overlays only render while this dialog is the
   * top-most open dialog.
   *
   * Omit at the root level; overlays render only when no dialog is open.
   */
  dialogId?: string;
}

/**
 * Renders every filter in `FILTER_REGISTRY` whose option is currently enabled.
 *
 * Mounted in two places:
 * - Once at the top of the app via `CRTEffects` (root scope).
 * - Once inside every `BaseDialog` — rendering filters as children of a
 *   native `<dialog>` promotes them to the browser's top layer alongside
 *   the dialog, so modal content receives the same CRT effect as the rest
 *   of the page.
 *
 * To avoid stacking two active filter canvases (which would double the
 * `mix-blend-mode: multiply` effect and run two RAF loops), only one
 * instance renders at a time:
 * - The root instance yields while any dialog is open.
 * - A dialog instance yields unless it is the top-most open dialog.
 *
 * Reads `OptionsContext` directly (rather than `useOptions`) so it's safe to
 * mount in contexts where no `OptionsProvider` is present (e.g. isolated
 * component tests of `BaseDialog` consumers). When no provider exists, no
 * filters are rendered.
 *
 * Scope note: the persistence optimisation (keeping WebGL state alive across
 * top-layer handoffs) is implemented *inside* `ScanlineFilter1` via the
 * `crtRenderer` singleton. This file still swaps filters by unmounting the
 * inactive branch (`return null` below), so any filter added to
 * `FILTER_REGISTRY` later will pay the full mount/unmount cost on each
 * top-layer handoff unless it adopts the same singleton pattern.
 */
export default function FilterOverlays({ dialogId }: FilterOverlaysProps = {}) {
  const context = useContext(OptionsContext);
  const topDialogId = useTopDialogId();

  if (!context) return null;

  // Root overlay: active only when the dialog stack is empty.
  // Dialog overlay: active only when this dialog is top-most.
  const active =
    dialogId === undefined ? topDialogId === null : topDialogId === dialogId;
  if (!active) return null;

  const { options } = context;

  return (
    <>
      {FILTER_REGISTRY.map(
        ({ option, component: Filter, props }) =>
          options[option] && (
            <Suspense key={option} fallback={null}>
              <Filter {...props} />
            </Suspense>
          ),
      )}
    </>
  );
}
