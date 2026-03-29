import { ReactNode, useState, useLayoutEffect } from "react";
import type { ThemeName } from "@/types/Theme.types";
import { PageContext } from "@/context/PageContext";
import { useTheme } from "@/hooks/useTheme";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFooterTitle } from "@/hooks/useFooterTitle";
import { useFooterSubtitle } from "@/hooks/useFooterSubtitle";
import { useFooterHidden } from "@//hooks/useFooterHidden";

/**
 * Provides page-level state (theme, document title, footer text, loading flag)
 * to the component tree via PageContext.
 */
export function PageProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName | null>(null);
  const { setTheme: updateTheme } = useTheme();

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme);
    updateTheme(theme);
  };
  const { documentTitle, setDocumentTitle } = useDocumentTitle();
  const { footerTitle, setFooterTitle } = useFooterTitle();
  const { footerSubtitle, setFooterSubtitle } = useFooterSubtitle();
  const { isFooterHidden, setFooterHidden } = useFooterHidden();
  const [isLoading, setLoading] = useState(true);
  const [isThemeApplied, setThemeApplied] = useState(false);

  useLayoutEffect(() => {
    setThemeApplied(!!currentTheme);
  }, [currentTheme]);

  return (
    <PageContext.Provider
      value={{
        documentTitle,
        footerTitle,
        footerSubtitle,
        isFooterHidden,
        isLoading,
        isThemeApplied,
        setLoading,
        setTheme: handleThemeChange,
        setDocumentTitle,
        setFooterTitle,
        setFooterSubtitle,
        setFooterHidden,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}
