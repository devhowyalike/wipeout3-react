import {
  useEffect,
  useCallback,
  createContext,
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

  const registerHandler = useCallback((handler: EscapeHandler) => {
    handlersRef.current.push(handler);
  }, []);

  const unregisterHandler = useCallback((handler: EscapeHandler) => {
    handlersRef.current = handlersRef.current.filter((h) => h !== handler);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (handlersRef.current.length > 0) {
          const lastHandler =
            handlersRef.current[handlersRef.current.length - 1];
          lastHandler();
        } else if (location.pathname !== "/") {
          navigate(-1);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, location.pathname]);

  return (
    <EscapeContext.Provider value={{ registerHandler, unregisterHandler }}>
      {children}
    </EscapeContext.Provider>
  );
}
