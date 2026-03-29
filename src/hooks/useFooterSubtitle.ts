import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Manages footer subtitle text, keyed by pathname so returning via the history stack restores
 * the subtitle for that route.
 */
export function useFooterSubtitle() {
  const location = useLocation();
  const [footerSubtitle, setFooterSubtitleState] = useState<string>("");
  const [subtitleHistory, setSubtitleHistory] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedSubtitle = subtitleHistory[location.pathname];
    if (savedSubtitle) {
      setFooterSubtitleState(savedSubtitle);
    }
  }, [location, subtitleHistory]);

  const setFooterSubtitle = (subtitle: string) => {
    setFooterSubtitleState(subtitle);
    setSubtitleHistory((prev) => ({
      ...prev,
      [location.pathname]: subtitle,
    }));
  };

  return {
    footerSubtitle,
    setFooterSubtitle,
  };
}