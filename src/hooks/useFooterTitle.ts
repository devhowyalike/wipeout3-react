import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Manages footer title text, keyed by pathname so returning via the history stack restores
 * the title for that route.
 */
export function useFooterTitle() {
  const location = useLocation();
  const [footerTitle, setFooterTitleState] = useState<string>("");
  const [titleHistory, setTitleHistory] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedTitle = titleHistory[location.pathname];
    if (savedTitle) {
      setFooterTitleState(savedTitle);
    }
  }, [location, titleHistory]);

  const setFooterTitle = (title: string) => {
    setFooterTitleState(title);
    setTitleHistory((prev) => ({
      ...prev,
      [location.pathname]: title,
    }));
  };

  return {
    footerTitle,
    setFooterTitle,
  };
}
