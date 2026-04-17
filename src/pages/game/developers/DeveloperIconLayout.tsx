import { useState, useEffect, useRef } from "react";
import { teamMembers } from "./teamMembers";
import { DeveloperIcon } from "./DeveloperIcon";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DeveloperIconsProps {
  onHover: (developer: (typeof teamMembers)[0] | null) => void;
  // Enables a cycling animation on the icons
  cycleEnabled?: boolean;
}

/** Two-row grid of developer icons with optional cycling highlight. */
const DeveloperIconLayout = ({
  onHover,
  cycleEnabled = true,
}: DeveloperIconsProps) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();
  // Top row icons
  const topRowCount = 7;

  // Total team members excluding the last one (AngryMan)
  const totalMembers = teamMembers.length - 1;

  // Calculate bottom row count based on remaining members
  const bottomRowCount = totalMembers - topRowCount;

  // Track the currently highlighted icon
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Track if the cycle is paused (when user is hovering)
  const [isCyclePaused, setIsCyclePaused] = useState(false);

  // Timer reference for delayed cycle resume
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reference to the cycle interval
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle interval duration
  const CYCLE_INTERVAL = 50;

  // Delay before resuming cycle after hover ends
  const RESUME_DELAY = 1000;

  // Handle hover events (called from DeveloperIcon focus/mouse handlers)
  const handleIconHover = (developer: (typeof teamMembers)[0] | null) => {
    // Clear any pending resume timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    if (developer === null) {
      resumeTimerRef.current = setTimeout(() => {
        setIsCyclePaused(false);
        resumeTimerRef.current = null;
      }, RESUME_DELAY);
    } else {
      setIsCyclePaused(true);
    }

    onHover(developer);
  };

  // Set up the cycling effect
  useEffect(() => {
    // If cycling is disabled or user prefers reduced motion,
    // clear any existing interval and reset the highlight
    if (!cycleEnabled || prefersReducedMotion) {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
      setHighlightedIndex(null);
      return;
    }

    // Increment the highlighted index
    const incrementHighlight = () => {
      setHighlightedIndex((prevIndex) => {
        // If cycle is paused, keep the current index (or null)
        if (isCyclePaused) return prevIndex;

        // If no previous index, start at 0
        if (prevIndex === null) return 0;

        // Cycle to the next index, wrapping back to 0 when reaching the end
        return (prevIndex + 1) % teamMembers.length;
      });
    };

    // Set up interval for cycling
    cycleIntervalRef.current = setInterval(incrementHighlight, CYCLE_INTERVAL);

    // Clean up interval on component unmount
    return () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
    };
  }, [isCyclePaused, cycleEnabled, prefersReducedMotion]);

  // Update developer details when the cycling highlight changes
  useEffect(() => {
    if (!isCyclePaused && highlightedIndex !== null) {
      const developer = teamMembers[highlightedIndex];
      onHover(
        highlightedIndex === teamMembers.length - 1
          ? {
              firstName: teamMembers[highlightedIndex].firstName,
              lastName: teamMembers[highlightedIndex].lastName,
              title: teamMembers[highlightedIndex].title,
            }
          : developer
      );
    }
  }, [highlightedIndex, isCyclePaused, onHover]);

  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
        cycleIntervalRef.current = null;
      }
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="mt-1 -mb-2 -ml-2">
      {/* Top row */}
      <div className="flex justify-start gap-0.5 sm:gap-1 mb-1">
        <div className="flex gap-1">
          {Array.from({ length: topRowCount }).map((_, i) => (
            <div key={`top-icon-${i}`} className="w-5 sm:w-10">
              <DeveloperIcon
                index={i}
                onHover={handleIconHover}
                isHighlighted={
                  cycleEnabled &&
                  !prefersReducedMotion &&
                  !isCyclePaused &&
                  highlightedIndex === i
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row - remaining icons + AngryMan */}
      <div className="flex gap-1">
        {Array.from({ length: bottomRowCount }).map((_, i) => (
          <div key={`bottom-icon-${i}`} className="w-5 sm:w-10">
            <DeveloperIcon
              index={i + topRowCount}
              onHover={handleIconHover}
              isHighlighted={
                cycleEnabled &&
                !prefersReducedMotion &&
                !isCyclePaused &&
                highlightedIndex === i + topRowCount
              }
            />
          </div>
        ))}

        {/* AngryManIcon */}
        <div className="w-10 sm:w-20">
          <DeveloperIcon
            index={teamMembers.length - 1}
            onHover={handleIconHover}
            isHighlighted={
              cycleEnabled &&
              !prefersReducedMotion &&
              !isCyclePaused &&
              highlightedIndex === teamMembers.length - 1
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DeveloperIconLayout;
