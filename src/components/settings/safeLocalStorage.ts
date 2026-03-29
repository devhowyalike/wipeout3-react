// localStorage.getItem/setItem throw a SecurityError in browsers where storage
// is disabled (e.g. Firefox private browsing, iOS Safari with cross-site
// tracking prevention, or sandboxed iframes). Wrapping every access here
// prevents that from crashing the modal on mount or during user interaction.
function safeLocalStorage(action: "get", key: string): string | null;
function safeLocalStorage(action: "set", key: string, value: string): void;
function safeLocalStorage(
  action: "get" | "set",
  key: string,
  value?: string,
): string | null | void {
  try {
    if (action === "get") return localStorage.getItem(key);
    localStorage.setItem(key, value!);
  } catch {
    // localStorage unavailable (private browsing, restricted context, etc.)
  }
  return null;
}

/**
 * Safely reads from or writes to localStorage, returning `null` when storage is
 * unavailable.
 */
export { safeLocalStorage };
