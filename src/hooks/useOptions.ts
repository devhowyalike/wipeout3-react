import { useContext } from "react";
import { OptionsContext } from "@/context/OptionsContext";
import type { AppOptions } from "@/config/options";

/**
 * Returns the current app options from `OptionsContext`.
 *
 * @throws If called outside an `OptionsProvider`.
 */
export function useOptions(): AppOptions {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context.options;
}
