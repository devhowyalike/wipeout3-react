import { useEffect, useRef, useState } from "react";
import "./TracksWorldMap.css";
import { useUISounds } from "@/hooks/useUISounds";

const SVG_URL = "/images/tracks-world-map.svg";

function idToLabel(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Interactive SVG world map of tracks (hover/click sounds). */
const TracksWorldMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const { playHoverSound, playClickSound } = useUISounds();

  useEffect(() => {
    fetch(SVG_URL)
      .then((res) => res.text())
      .then(setSvgContent);
  }, []);

  // Make each track group keyboard- and VoiceOver-accessible after injection.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    container
      .querySelectorAll<SVGGElement>(".track-group")
      .forEach((group) => {
        group.setAttribute("tabindex", "0");
        group.setAttribute("role", "img");
        group.setAttribute("aria-label", `${idToLabel(group.id)} track`);
      });
  }, [svgContent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    const handleMouseEnter = (e: Event) => {
      if ((e.target as Element).closest(".track-group")) playHoverSound();
    };
    const handleClick = (e: Event) => {
      if ((e.target as Element).closest(".track-group")) playClickSound();
    };
    const handleFocusIn = (e: Event) => {
      const group = (e.target as Element).closest(".track-group");
      // Only fire for focus arriving directly on the group (tabindex="0"),
      // not bubbling up from a child element.
      if (group === e.target) playHoverSound();
    };
    const handleKeyDown = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key !== "Enter" && ke.key !== " ") return;
      if ((ke.target as Element).closest(".track-group")) {
        ke.preventDefault();
        playClickSound();
      }
    };

    container.addEventListener("mouseenter", handleMouseEnter, true);
    container.addEventListener("click", handleClick, true);
    container.addEventListener("focusin", handleFocusIn);
    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter, true);
      container.removeEventListener("click", handleClick, true);
      container.removeEventListener("focusin", handleFocusIn);
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [svgContent, playHoverSound, playClickSound]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default TracksWorldMap;
