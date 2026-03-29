import { useState, useEffect, useRef } from "react";
import PersonIcon from "@/components/Icons/PersonIcon";
import AngryManIcon from "@/components/Icons/AngryManIcon";
import { useUISounds } from "@/hooks/useUISounds";
import { teamMembers, angryManLogo } from "./teamMembers";

interface DeveloperIconProps {
  index: number;
  onHover: (developer: (typeof teamMembers)[0] | null) => void;
  isHighlighted: boolean;
}

/** Single developer (or Angry Man) icon with hover sound and highlight state. */
export const DeveloperIcon = ({
  index,
  onHover,
  isHighlighted,
}: DeveloperIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const developer = teamMembers[index];
  const isAngryMan = index === teamMembers.length - 1;

  const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { playHoverSound } = useUISounds();

  const fillColor = "#acaba7";
  const activeFillColor = "#fff";

  // Display highlight from either hover or cycling mechanism
  const shouldHighlight = isHovered || isHighlighted;

  // Blink Angry-Man eye
  useEffect(() => {
    // Clear any existing interval first
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    if (isAngryMan && shouldHighlight) {
      blinkIntervalRef.current = setInterval(() => {
        setIsBlinking((prev) => !prev);
      }, 65);
    }

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    };
  }, [isAngryMan, shouldHighlight]);

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (isAngryMan) {
      onHover({
        firstName: angryManLogo.firstName,
        lastName: angryManLogo.lastName,
        title: angryManLogo.fullTitle,
      });
    } else {
      onHover(developer);
    }
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset blinking state only if not highlighted by cycle
    if (!isHighlighted) {
      setIsBlinking(false);
    }
    onHover(null);
  };

  return (
    <div
      className="cursor-pointer h-full flex items-end"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isAngryMan ? (
        <div className="flex items-end justify-center w-full">
          <AngryManIcon
            fill={fillColor}
            activeFill={activeFillColor}
            isHovered={shouldHighlight}
            highlightFill={fillColor}
            highlightFillActive={isBlinking ? "red" : activeFillColor}
            className="h-auto w-full"
          />
        </div>
      ) : (
        <PersonIcon
          isHovered={shouldHighlight}
          activeFill={activeFillColor}
          fill={fillColor}
        />
      )}
    </div>
  );
};
