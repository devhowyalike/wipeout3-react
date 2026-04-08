import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./VerticalBillboard.css";
import { useOptions } from "@/hooks/useOptions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PlayIcon, PauseIcon } from "./icons";

interface VerticalBillboardProps {
  images: string[];
  interval?: number;
}

/**
 * Fixed side column that vertically scrolls a duplicated image list for a seamless loop.
 * Respects reduced motion (starts paused), hover/touch overlay for play/pause, and wide-center layout.
 */
const VerticalBillboard: React.FC<VerticalBillboardProps> = ({
  images = [],
  interval = 2000,
}) => {
  // Get reduced motion preference first
  const prefersReducedMotion = useReducedMotion();
  const { wideCenter } = useOptions();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const sequenceHeightRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Set initial pause state based on reduced motion preference
  useEffect(() => {
    setIsPaused(prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!sequenceRef.current || !images.length) return;

    const imageElements = Array.from(
      sequenceRef.current.querySelectorAll("img"),
    );
    let settledCount = 0;

    const updateHeight = () => {
      const height = sequenceRef.current?.getBoundingClientRect().height ?? 0;
      const normalizedHeight = Math.round(height * 1000) / 1000;
      if (sequenceHeightRef.current !== normalizedHeight) {
        sequenceHeightRef.current = normalizedHeight;
        scrollContainerRef.current?.style.setProperty(
          "--sequence-height",
          `${normalizedHeight}px`,
        );
      }
    };

    const onImageSettled = () => {
      settledCount++;
      if (settledCount >= imageElements.length) {
        // All images have loaded or errored — measure final height then
        // start animation on next frame so layout is fully committed.
        requestAnimationFrame(() => {
          updateHeight();
          setIsReady(true);
        });
      }
    };

    // Keep --sequence-height accurate after the billboard is ready
    // (e.g. on viewport resize).
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(sequenceRef.current);

    // Images already in browser cache will have complete=true synchronously.
    imageElements.forEach((img) => {
      if (img.complete) {
        onImageSettled();
      } else {
        img.addEventListener("load", onImageSettled);
        img.addEventListener("error", onImageSettled);
      }
    });

    return () => {
      resizeObserver.disconnect();
      imageElements.forEach((img) => {
        img.removeEventListener("load", onImageSettled);
        img.removeEventListener("error", onImageSettled);
      });
    };
  }, [images]);

  const togglePause = () => {
    setIsPaused((prev) => {
      if (prev) setIsHovering(false);
      return !prev;
    });
  };

  const slides = useMemo(
    () =>
      images.map((image, index) => (
        <div
          className="vertical-billboard-slide w-full"
          key={`${image}-${index}`}
        >
          <img
            src={image}
            alt={`Slide ${index}`}
            className="vertical-billboard-image w-full h-auto"
            draggable={false}
            decoding="async"
          />
        </div>
      )),
    [images],
  );

  const clonedSlides = useMemo(
    () =>
      images.map((image, index) => (
        <div
          className="vertical-billboard-slide w-full"
          key={`${image}-clone-${index}`}
        >
          <img
            src={image}
            alt={`Slide ${index % images.length}`}
            className="vertical-billboard-image w-full h-auto"
            draggable={false}
            decoding="async"
          />
        </div>
      )),
    [images],
  );

  if (!images.length) return null;

  const billboardLeftOffset = wideCenter
    ? "max(0px, calc((100vw - var(--w3-app-max-width)) / 2))"
    : "0px";

  const billboard = (
    <div
      className="fixed top-0 h-screen w-1/2 sm:w-1/4"
      style={{ left: billboardLeftOffset }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchEnd={(e) => {
        e.preventDefault();
        togglePause();
      }}
    >
      <div className="vertical-billboard overflow-hidden h-full">
        <div
          ref={scrollContainerRef}
          className={`relative scroll-container ${isReady ? "animating" : ""} ${
            isPaused ? "paused" : ""
          }`}
          style={
            {
              "--scroll-duration": `${interval}ms`,
            } as React.CSSProperties
          }
        >
          <div
            ref={sequenceRef}
            className="vertical-billboard-sequence vertical-billboard-sequence-primary"
          >
            {slides}
          </div>
          <div
            className="vertical-billboard-sequence vertical-billboard-sequence-secondary"
            aria-hidden="true"
          >
            {clonedSlides}
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/40 cursor-pointer ${
          isHovering || isPaused
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={togglePause}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          togglePause();
        }}
      >
        <div
          className="pointer-events-none p-4 bg-black/50 text-white"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </div>
      </div>
    </div>
  );

  // Portal so the billboard escapes the LowResolution
  // transform optin and stays fixed to the real viewport.
  return createPortal(billboard, document.body);
};

export default VerticalBillboard;
