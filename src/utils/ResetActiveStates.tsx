import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ResetActiveStates = () => {
  const location = useLocation();

  useEffect(() => {
    // Prevent active state from persisting on route change
    // Primarily affects menu links between pages
    const disablePointerEvents = () => {
      const style = document.createElement("style");
      style.innerHTML = `
        a {
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);

      // Re-enable pointer events after a short delay
      setTimeout(() => {
        style.remove();
      }, 100);
    };

    disablePointerEvents();
  }, [location.pathname]);

  return null;
};

/**
 * On pathname change, briefly turns off pointer events on all links so `:active` styles
 * do not stick on navigations (e.g. menu links). Renders nothing.
 */
export default ResetActiveStates;
