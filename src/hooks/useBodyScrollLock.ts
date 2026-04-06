import { useEffect } from "react";

let lockCount = 0;
let savedOverflow = "";

/**
 * Locks `document.body` scroll while the component is mounted (or while
 * `enabled` is true). Uses reference counting so overlapping locks from
 * multiple modals don't clobber each other on cleanup.
 */
export function useBodyScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow;
    }
    lockCount++;
    document.body.style.overflow = "hidden";
    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow;
      }
    };
  }, [enabled]);
}
