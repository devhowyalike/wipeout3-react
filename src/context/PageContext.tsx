import { createContext } from "react";
import { ThemeName } from "@/types/Theme.types";

/** Shape of the value stored in `PageContext` — page-level state and setters. */
interface PageContextType {
  documentTitle: string;
  footerTitle: string;
  footerSubtitle: string;
  isFooterHidden: boolean;
  isLoading: boolean;
  isThemeApplied: boolean;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: ThemeName) => void;
  setDocumentTitle: (title: string) => void;
  setFooterTitle: (title: string) => void;
  setFooterSubtitle: (subtitle: string) => void;
  setFooterHidden: (hidden: boolean) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export { PageContext };
export type { PageContextType };
