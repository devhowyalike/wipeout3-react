import { ReactNode, useMemo } from "react";
import { OptionsContext } from "@/context/OptionsContext";
import { loadOptions } from "@/config/options";

/**
 * Provides read-only app options to the component tree via OptionsContext.
 */
export function OptionsProvider({ children }: { children: ReactNode }) {
  const options = useMemo(() => loadOptions(), []);

  return (
    <OptionsContext.Provider value={{ options }}>
      {children}
    </OptionsContext.Provider>
  );
}
