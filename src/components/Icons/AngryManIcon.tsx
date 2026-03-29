import { useEffect, useState } from "react";

type Size = "sm" | "md" | "lg" | "xl" | "xxl" | "";

interface AngryManIconProps {
  size?: Size;
  blink?: boolean;
  fill?: string;
  highlightFill?: string;
  activeFill?: string;
  highlightFillActive?: string;
  isHovered?: boolean;
  className?: string;
}

const sizeClasses: Record<Size, { dimensions: string }> = {
  "": { dimensions: "w-full h-full" },
  sm: { dimensions: "w-12 h-12" },
  md: { dimensions: "w-32 h-32" },
  lg: { dimensions: "w-64 h-64" },
  xl: { dimensions: "w-80 h-80" },
  xxl: { dimensions: "w-96 h-96" },
};

const AngryManIcon = ({
  size = "",
  blink = false,
  fill = "currentColor",
  highlightFill = "#ca0088",
  activeFill = "#ffffff",
  highlightFillActive = "#ff00ff",
  isHovered = false,
  className = "",
}: AngryManIconProps) => {
  const [blinkDelay, setBlinkDelay] = useState("1.5s");

  useEffect(() => {
    if (!blink) return;
    const randomizeBlink = () => {
      const newDelay = (1 + Math.random() * 1.5).toFixed(2);
      setBlinkDelay(`${newDelay}s`);
    };
    randomizeBlink();
    const interval = setInterval(randomizeBlink, 1500);
    return () => clearInterval(interval);
  }, [blink]);

  // Combine the size dimensions with any additional className passed in
  const containerClassName =
    `${sizeClasses[size].dimensions} ${className}`.trim();

  // Use the activeFill when hovered, otherwise use the regular fill
  const currentFill = isHovered ? activeFill : fill;

  return (
    <div className={containerClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="16.257 22.88 160.241 146.997"
        className="block"
        fill={currentFill}
        preserveAspectRatio="xMidYMid meet"
      >
        {blink && (
          <style>
            {`
              @keyframes blink {
                0%, 88% { opacity: 1; }
                89%, 100% { opacity: 0; }
              }
              .isBlinking {
                animation: blink ${blinkDelay} infinite;
                animation-delay: 0s;
              }
            `}
          </style>
        )}
        <g fillRule="evenodd" clipRule="evenodd">
          <path d="M176.498 119.965H16.257v25.613h33.275l-14.229 24.299h25.956l14.229-24.299h42.563l14.228 24.299h25.957l-14.23-24.299h32.492v-25.613zM109.949 85.816v13.791H82.368V85.816H67.482v26.705h57.354V85.816h-14.887z" />
          <path d="M125.273 22.88H67.482c-17.591 0-32.07 14.26-32.07 31.851v57.791H59.82v-63.92h73.116v63.92h24.408V54.731c0-17.591-14.479-31.851-32.071-31.851z" />
          <path
            className={blink ? "isBlinking" : ""}
            fill={isHovered ? highlightFillActive : highlightFill}
            d="M110.607 56.044L96.378 79.905 82.149 56.044H59.82l17.294 29.772H115.643l17.293-29.772h-22.329z"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Angry Man silhouette SVG with optional randomized blink on the magenta chest wedge.
 * Supports preset sizes, hover/active fills, and wrapping className on the container.
 */
export default AngryManIcon;
