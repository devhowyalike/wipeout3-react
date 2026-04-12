import {
  useEffect,
  useCallback,
  createContext,
  useMemo,
  ReactNode,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

type EscapeHandler = () => void;

interface EscapeContextType {
  registerHandler: (handler: EscapeHandler) => void;
  unregisterHandler: (handler: EscapeHandler) => void;
}

/** React context for the stacked Escape-key handler system provided by `EscapeNavigation`. */
// eslint-disable-next-line react-refresh/only-export-components -- context and provider are intentionally co-located
export const EscapeContext = createContext<EscapeContextType | undefined>(
  undefined
);

/**
 * Provides a stacked escape-key handler system; the most recently registered handler fires first,
 * falling back to browser back-navigation when no handlers are registered.
 */
export function EscapeNavigation({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handlersRef = useRef<EscapeHandler[]>([]);
  // Refs let the stable keydown listener (attached once, never re-created)
  // always read the latest values without closing over stale state.
  const navigateRef = useRef(navigate);
  const pathnameRef = useRef(location.pathname);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  const registerHandler = useCallback((handler: EscapeHandler) => {
    handlersRef.current.push(handler);
  }, []);

  const unregisterHandler = useCallback((handler: EscapeHandler) => {
    handlersRef.current = handlersRef.current.filter((h) => h !== handler);
  }, []);

  // Empty deps → listener attached once, never torn down/re-attached on route
  // changes. Reads navigate and pathname through refs so the closure is never
  // stale. preventDefault on both paths suppresses the native dialog `cancel`
  // event that the browser would otherwise fire on any open <dialog>.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (handlersRef.current.length > 0) {
          e.preventDefault();
          const lastHandler =
            handlersRef.current[handlersRef.current.length - 1];
          lastHandler();
        } else if (pathnameRef.current !== "/") {
          e.preventDefault();
          navigateRef.current(-1);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Memoised so useEscapeKey consumers only run their registration effect on
  // mount/unmount — not on every navigation that re-renders this provider.
  const contextValue = useMemo(
    () => ({ registerHandler, unregisterHandler }),
    [registerHandler, unregisterHandler],
  );

  return (
    <EscapeContext.Provider value={contextValue}>
      {children}
    </EscapeContext.Provider>
  );
}
