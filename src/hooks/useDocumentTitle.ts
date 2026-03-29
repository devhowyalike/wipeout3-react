import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Manages the browser document title (prefixed with the app name). Stores the title per route
 * pathname and restores it when navigating back to that path.
 */
export function useDocumentTitle() {
  const location = useLocation();
  const [documentTitle, setDocumentTitleState] = useState<string>("");
  const [titleHistory, setTitleHistory] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedTitle = titleHistory[location.pathname];
    if (savedTitle) {
      setDocumentTitleState(savedTitle);
    }
  }, [location, titleHistory]);

  useEffect(() => {
    if (documentTitle) {
      const prevTitle = document.title;
      document.title = `WIPEOUT 3 | ${documentTitle.toUpperCase()}`;
      return () => {
        document.title = prevTitle;
      };
    }
  }, [documentTitle]);

  const setDocumentTitle = (title: string) => {
    setDocumentTitleState(title);
    setTitleHistory((prev) => ({
      ...prev,
      [location.pathname]: title,
    }));
  };

  return {
    documentTitle,
    setDocumentTitle,
  };
}