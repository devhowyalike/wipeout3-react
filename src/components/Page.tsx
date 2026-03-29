import { ReactNode, useEffect, useLayoutEffect } from "react";
import { usePage } from "@/hooks/usePage";
import { ThemeName } from "@/types/Theme.types";
import {
  DEFAULT_FOOTER_MENU_SUBTITLE,
  DEFAULT_FOOTER_MENU_TITLE,
} from "@/config/constants";

interface PageProps {
  theme: ThemeName;
  documentTitle: string;
  footerTitle?: string;
  footerSubtitle?: string;
  isFooterHidden?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that applies a theme, sets the document title, and configures the footer for the current page.
 */
export default function Page({
  theme,
  documentTitle,
  footerTitle = DEFAULT_FOOTER_MENU_TITLE,
  footerSubtitle = DEFAULT_FOOTER_MENU_SUBTITLE,
  isFooterHidden = false,
  children,
  className = "",
}: PageProps) {
  const {
    setTheme,
    setDocumentTitle,
    setFooterTitle,
    setFooterSubtitle,
    setFooterHidden,
  } = usePage();

  // Apply theme before browser paint to prevent flash of wrong theme colors
  useLayoutEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  useEffect(() => {
    setDocumentTitle(documentTitle);
    setFooterTitle(footerTitle);
    setFooterSubtitle(footerSubtitle);
    setFooterHidden(isFooterHidden);
  }, [
    documentTitle,
    footerTitle,
    footerSubtitle,
    isFooterHidden,
    setDocumentTitle,
    setFooterTitle,
    setFooterSubtitle,
    setFooterHidden,
  ]);

  return <div className={className}>{children}</div>;
}
