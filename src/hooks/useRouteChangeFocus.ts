import { useEffect, RefObject } from "react";

/**
 * On every pathname change, resets the scroll position of the given container
 * and moves focus into the new page.
 *
 * Focus lands on the first <h1> inside the container so VoiceOver announces
 * the page heading immediately on arrival. Falls back to the container itself
 * (which should carry tabIndex={-1}) when no <h1> is present.
 */
export function useRouteChangeFocus(
  containerRef: RefObject<HTMLElement | null>,
  pathname: string,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: 0 });
    const h1 = container.querySelector<HTMLElement>("h1");
    if (h1) {
      // tabIndex=-1 lets us focus it programmatically without adding it to the
      // Tab order. Only set it if not already present so we don't stomp on
      // any intentional tabIndex the page placed on the heading.
      if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    } else {
      container.focus({ preventScroll: true });
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
}
