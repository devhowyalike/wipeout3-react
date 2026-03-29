import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Blocks synthetic mouse events on the given element for 500ms after each
 * route change, preventing ghost events from a previous page's navigation
 * tap from triggering handlers on the newly loaded page.
 *
 * Example: tapping a menu link loads a new route; without this guard the
 * browser synthesizes mouseenter/mouseover/click from the original touch
 * and fires them on whatever content sits under the finger on the new
 * page — selecting a weapon, highlighting a developer icon, etc.
 *
 * Only synthetic events (mouseenter, mouseover, click) are blocked. Real
 * touch events (touchstart, touchend) are never synthesized by the browser
 * and always pass through immediately.
 *
 * Uses a permanent capture-phase listener on the target element so there
 * is no timing gap — the listener is attached once and stays for the
 * lifetime of the component.
 *
 * @param ref - Ref to the element whose events should be guarded.
 * @param pathname - Current route pathname; a change resets the suppression window.
 * @param threshold - Suppression window in ms after each navigation (default 500).
 */
export function useNavigationEventGuard(
  ref: RefObject<HTMLElement | null>,
  pathname: string,
  threshold = 500
) {
  const navTimeRef = useRef(Date.now());

  useLayoutEffect(() => {
    navTimeRef.current = Date.now();
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const guard = (e: Event) => {
      if (Date.now() - navTimeRef.current < threshold) {
        e.stopPropagation();
      }
    };

    const events = ["mouseenter", "mouseover", "click"];
    events.forEach((evt) => el.addEventListener(evt, guard, true));
    return () => {
      events.forEach((evt) => el.removeEventListener(evt, guard, true));
    };
  }, [ref, threshold]);
}
