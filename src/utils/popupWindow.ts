/**
 * Applies base body styles to a popup window so it renders correctly
 * without default browser margins or a white flash.
 *
 * @param popup - The popup `Window` to style.
 */
export function applyPopupBodyStyles(popup: Window): void {
  const { style } = popup.document.body;
  style.margin = '0';
  style.padding = '0';
  style.overflow = 'hidden';
  style.background = '#000';
}

/**
 * Copies all live `<style>` tags and `<link rel="stylesheet">` elements from
 * the parent window into the popup so Tailwind and Vite-injected styles
 * are available there.
 *
 * @param popup - The popup `Window` to receive the copied styles.
 */
export function copyStylesToPopup(popup: Window): void {
  document.querySelectorAll('style').forEach((style) => {
    const cloned = popup.document.createElement('style');
    cloned.textContent = style.textContent;
    popup.document.head.appendChild(cloned);
  });

  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const cloned = popup.document.createElement('link');
    cloned.rel = 'stylesheet';
    cloned.href = (link as HTMLLinkElement).href;
    popup.document.head.appendChild(cloned);
  });
}

/**
 * Creates the React mount point inside the popup and returns the element.
 *
 * @param popup - The popup `Window` in which to create the root element.
 * @returns The `<div>` element to pass to `ReactDOM.createRoot`.
 */
export function createPopupRoot(popup: Window): HTMLDivElement {
  const rootEl = popup.document.createElement('div');
  rootEl.id = 'popup-root';
  popup.document.body.appendChild(rootEl);
  return rootEl;
}
