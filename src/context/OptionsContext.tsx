import { createContext } from "react";
import type { AppOptions } from "@/config/options";

/** Shape of the value stored in `OptionsContext`. */
interface OptionsContextType {
  options: AppOptions;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export { OptionsContext };
