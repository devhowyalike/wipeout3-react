import { useEffect, useContext, useRef } from "react";
import { EscapeContext } from "./EscapeNavigation";

type EscapeHandler = () => void;

/**
 * Registers `handler` with centralized `EscapeNavigation`: pushes on mount, pops on unmount so nested
 * overlays receive Escape in stack order.
 *
 * @param handler - Callback invoked when Escape is pressed and this handler is on top of the stack.
 */
export function useEscapeKey(handler: EscapeHandler) {
  const context = useContext(EscapeContext);
  const handlerRef = useRef(handler);
  const stableHandlerRef = useRef<EscapeHandler | null>(null);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!context) return;

    if (!stableHandlerRef.current) {
      stableHandlerRef.current = () => handlerRef.current();
    }

    const stableHandler = stableHandlerRef.current;
    context.registerHandler(stableHandler);

    return () => context.unregisterHandler(stableHandler);
  }, [context]);
}
