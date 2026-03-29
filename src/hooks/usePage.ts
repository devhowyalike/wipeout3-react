import { useContext } from "react";
import { PageContext } from "@/context/PageContext";

/**
 * Returns page context (theme, titles, loading flags, etc.) from `PageContext`.
 *
 * @throws If called outside a `PageProvider`.
 */
export function usePage() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
}