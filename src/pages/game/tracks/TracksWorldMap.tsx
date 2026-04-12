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

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    const svg = container.querySelector("svg");
    if (svg) {
      svg.setAttribute("role", "img");
      svg.setAttribute(
        "aria-label",
        `World map showing track locations: ${Array.from(
          container.querySelectorAll<SVGGElement>(".track-group"),
        )
          .map((g) => idToLabel(g.id))
          .join(", ")}`,
      );
    }
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
    container.addEventListener("mouseenter", handleMouseEnter, true);
    container.addEventListener("click", handleClick, true);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter, true);
      container.removeEventListener("click", handleClick, true);
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
