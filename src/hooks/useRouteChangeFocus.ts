import { useEffect, useRef, RefObject } from "react";
import { NavigationType } from "react-router-dom";

interface FocusRecord {
  element: Element;
  selector: string | null;
}

/**
 * Walk up from `el` to find the closest ancestor with an `id` or an
 * `aria-label`, and return a selector prefix that scopes the match to
 * that region of the page (e.g. `nav[aria-label="Secondary navigation"]`).
 */
function getAncestorPrefix(el: Element): string | null {
  let node = el.parentElement;
  while (node && node !== document.body) {
    if (node.id) return `#${CSS.escape(node.id)}`;
    const label = node.getAttribute("aria-label");
    if (label) {
      return `${node.tagName.toLowerCase()}[aria-label="${CSS.escape(label)}"]`;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Builds a CSS selector that can re-identify `el` after a remount.
 * Scoped to the nearest identifiable ancestor when possible so that
 * duplicate hrefs in different page regions don't collide.
 */
function getFocusSelector(el: Element | null): string | null {
  if (!el || el === document.body) return null;
  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute("href");
    if (href) {
      const base = `a[href="${CSS.escape(href)}"]`;
      const prefix = getAncestorPrefix(el);
      return prefix ? `${prefix} ${base}` : base;
    }
  }
  return null;
}

/**
 * On every pathname change, resets the scroll position of the given container
 * and moves focus into the new page.
 *
 * **Forward navigation (PUSH / REPLACE):** focus lands on the first `<h1>`
 * inside the container so VoiceOver announces the page heading immediately on
 * arrival. Falls back to the container itself (which should carry
 * `tabIndex={-1}`) when no `<h1>` is present.
 *
 * **Back / forward navigation (POP):** focus is restored to the element the
 * user originally interacted with (e.g. the menu link they clicked) if it can
 * be found in the newly mounted DOM, giving keyboard users a predictable
 * return point. Falls back to the `<h1>` / container strategy above.
 *
 * Focus restoration uses a two-tier strategy: the original DOM element
 * reference is tried first (covers persistent shell elements like the footer),
 * falling back to an ancestor-scoped CSS selector for remounted content.
 */
export function useRouteChangeFocus(
  containerRef: RefObject<HTMLElement | null>,
  pathname: string,
  navigationType: NavigationType,
) {
  const focusMapRef = useRef(new Map<string, FocusRecord>());

  useEffect(() => {
    const handler = () => {
      const active = document.activeElement;
      if (!active || active === document.body) return;
      focusMapRef.current.set(pathname, {
        element: active,
        selector: getFocusSelector(active),
      });
    };
    document.addEventListener("focusin", handler);
    return () => document.removeEventListener("focusin", handler);
  }, [pathname]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: 0 });

    if (navigationType === "POP") {
      const record = focusMapRef.current.get(pathname);
      if (record) {
        if (record.element.isConnected) {
          (record.element as HTMLElement).focus({ preventScroll: true });
          return;
        }
        if (record.selector) {
          const target =
            container.querySelector<HTMLElement>(record.selector) ??
            document.querySelector<HTMLElement>(record.selector);
          if (target) {
            target.focus({ preventScroll: true });
            return;
          }
        }
      }
    }

    const h1 = container.querySelector<HTMLElement>("h1");
    if (h1) {
      if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    } else {
      container.focus({ preventScroll: true });
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
}
