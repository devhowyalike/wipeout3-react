import { useRef, useState, useEffect } from "react";

export type SwipeDirection = "prev" | "next" | null;

interface UseSwipeGestureOptions {
  /** Called when a completed swipe crosses `minDistance`. */
  onSwipe: (direction: "prev" | "next") => void;
  /**
   * When this value changes (e.g. a new gallery set is opened), show the swipe
   * hint — unless the user has already swiped this session or hints are
   * disabled. Pass `null` / `undefined` to suppress the hint entirely.
   */
  hintTrigger?: string | null;
  /** Whether swipe hints are enabled via user options. */
  enableHints?: boolean;
  /** Minimum horizontal distance (px) required to register a swipe. */
  minDistance?: number;
}

export interface UseSwipeGestureResult {
  swipeDirection: SwipeDirection;
  showSwipeHint: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

/**
 * Manages horizontal swipe gesture detection and the first-use swipe hint for
 * touch-primary devices. Tracks touch coordinates, emits a direction during a
 * live drag, and calls `onSwipe` on release when the distance threshold is met.
 */
export function useSwipeGesture({
  onSwipe,
  hintTrigger = null,
  enableHints = false,
  minDistance = 50,
}: UseSwipeGestureOptions): UseSwipeGestureResult {
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const hasSwipedRef = useRef(false);
  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );

  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  useEffect(() => {
    if (!hintTrigger || !isTouchDevice.current || hasSwipedRef.current || !enableHints)
      return;
    setShowSwipeHint(true);
    const timer = setTimeout(() => setShowSwipeHint(false), 2500);
    return () => clearTimeout(timer);
  }, [hintTrigger, enableHints]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
    hasSwipedRef.current = true;
    setShowSwipeHint(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
    if (touchStartXRef.current !== null) {
      const delta = e.touches[0].clientX - touchStartXRef.current;
      if (Math.abs(delta) > 8) {
        setSwipeDirection(delta > 0 ? "prev" : "next");
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) {
      setSwipeDirection(null);
      return;
    }
    const distance = touchEndXRef.current - touchStartXRef.current;
    if (Math.abs(distance) >= minDistance) {
      onSwipe(distance > 0 ? "prev" : "next");
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setSwipeDirection(null);
  };

  return { swipeDirection, showSwipeHint, handleTouchStart, handleTouchMove, handleTouchEnd };
}
