import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface ScrollbarMetrics {
  visible: boolean;
  thumbHeight: number;
  thumbOffset: number;
}

interface UseSettingsScrollResult {
  headerRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollContentRef: React.RefObject<HTMLDivElement | null>;
  footerRef: React.RefObject<HTMLDivElement | null>;
  scrollbarMetrics: ScrollbarMetrics;
  modalMaxHeight: number | null;
  scrollAreaMaxHeight: number | null;
}

/**
 * Measures and updates modal/scroll-area max heights, custom scrollbar thumb geometry, and refs for the
 * settings panel — reacting to accordion open state, resize, and visual viewport changes (e.g. mobile Safari).
 *
 * @param openItems - Currently expanded option-accordion item IDs.
 * @param openModeItems - Currently expanded mode-accordion item IDs.
 * @returns Refs for header/scroll/footer elements, scrollbar metrics, and computed max heights.
 */
export function useSettingsScroll(
  openItems: string[],
  openModeItems: string[],
): UseSettingsScrollResult {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const [scrollbarMetrics, setScrollbarMetrics] = useState<ScrollbarMetrics>({
    visible: false,
    thumbHeight: 0,
    thumbOffset: 0,
  });
  const [modalMaxHeight, setModalMaxHeight] = useState<number | null>(null);
  const [scrollAreaMaxHeight, setScrollAreaMaxHeight] = useState<number | null>(null);

  const updateScrollAreaHeight = useCallback(() => {
    const header = headerRef.current;
    const footer = footerRef.current;
    if (!header || !footer) return;

    const headerStyles = window.getComputedStyle(header);
    const footerStyles = window.getComputedStyle(footer);
    const headerMarginBottom =
      Number.parseFloat(headerStyles.marginBottom || "0") || 0;
    const footerMarginTop =
      Number.parseFloat(footerStyles.marginTop || "0") || 0;
    // Safari reports changing viewport heights as browser chrome expands/collapses,
    // so derive the modal cap from the live visual viewport instead of fixed `vh`.
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    // Keep the panel tall on phones, but stop it from becoming overly stretched on desktop.
    const nextModalMaxHeight = Math.min(Math.floor(viewportHeight * 0.9), 720);
    const availableHeight =
      nextModalMaxHeight -
      header.getBoundingClientRect().height -
      headerMarginBottom -
      footer.getBoundingClientRect().height -
      footerMarginTop;
    const nextMaxHeight = Math.max(Math.floor(availableHeight), 0);

    setModalMaxHeight((prev) =>
      prev !== null && Math.abs(prev - nextModalMaxHeight) < 1
        ? prev
        : nextModalMaxHeight,
    );
    setScrollAreaMaxHeight((prev) =>
      prev !== null && Math.abs(prev - nextMaxHeight) < 1 ? prev : nextMaxHeight,
    );
  }, []);

  const updateScrollbarMetrics = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const { clientHeight, scrollHeight, scrollTop } = scrollContainer;
    const hasOverflow = scrollHeight > clientHeight + 1;

    if (!hasOverflow) {
      setScrollbarMetrics((prev) =>
        prev.visible || prev.thumbHeight !== 0 || prev.thumbOffset !== 0
          ? { visible: false, thumbHeight: 0, thumbOffset: 0 }
          : prev,
      );
      return;
    }

    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * clientHeight,
      24,
    );
    const maxThumbOffset = clientHeight - thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    const rawOffset =
      maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbOffset : 0;
    const thumbOffset = Math.min(Math.max(rawOffset, 0), maxThumbOffset);

    setScrollbarMetrics((prev) => {
      if (
        prev.visible &&
        prev.thumbHeight === thumbHeight &&
        prev.thumbOffset === thumbOffset
      ) {
        return prev;
      }
      return { visible: true, thumbHeight, thumbOffset };
    });
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const scrollContent = scrollContentRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    const visualViewport = window.visualViewport;
    if (!scrollContainer || !scrollContent || !header || !footer) return;

    updateScrollAreaHeight();
    updateScrollbarMetrics();

    const handleScroll = () => updateScrollbarMetrics();

    // Observe both chrome-driven viewport changes and content reflow from accordion opens
    // so the custom scrollbar stays in sync across Safari/mobile layout changes.
    const resizeObserver = new ResizeObserver(() => {
      updateScrollAreaHeight();
      updateScrollbarMetrics();
    });

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    resizeObserver.observe(header);
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(scrollContent);
    resizeObserver.observe(footer);
    window.addEventListener("resize", updateScrollAreaHeight);
    window.addEventListener("resize", updateScrollbarMetrics);
    window.addEventListener("orientationchange", updateScrollAreaHeight);
    visualViewport?.addEventListener("resize", updateScrollAreaHeight);
    visualViewport?.addEventListener("scroll", updateScrollAreaHeight);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollAreaHeight);
      window.removeEventListener("resize", updateScrollbarMetrics);
      window.removeEventListener("orientationchange", updateScrollAreaHeight);
      visualViewport?.removeEventListener("resize", updateScrollAreaHeight);
      visualViewport?.removeEventListener("scroll", updateScrollAreaHeight);
    };
  }, [updateScrollAreaHeight, updateScrollbarMetrics]);

  useLayoutEffect(() => {
    updateScrollAreaHeight();
    updateScrollbarMetrics();

    // Radix accordion animations can settle a frame or two later in Safari, so
    // re-measure after paint before finalizing the scroll area and thumb metrics.
    const firstFrameId = window.requestAnimationFrame(() => {
      updateScrollAreaHeight();
      updateScrollbarMetrics();

      window.requestAnimationFrame(() => {
        updateScrollAreaHeight();
        updateScrollbarMetrics();
      });
    });
    const timeoutId = window.setTimeout(() => {
      updateScrollAreaHeight();
      updateScrollbarMetrics();
    }, 300);

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [openItems, openModeItems, updateScrollAreaHeight, updateScrollbarMetrics]);

  useLayoutEffect(() => {
    if (scrollAreaMaxHeight === null) return;

    updateScrollbarMetrics();

    const frameId = window.requestAnimationFrame(() => {
      updateScrollbarMetrics();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [scrollAreaMaxHeight, updateScrollbarMetrics]);

  return {
    headerRef,
    scrollContainerRef,
    scrollContentRef,
    footerRef,
    scrollbarMetrics,
    modalMaxHeight,
    scrollAreaMaxHeight,
  };
}
