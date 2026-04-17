import { useState, useEffect, useRef } from "react";
import { useOptions } from "@/hooks/useOptions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PlayIcon, PauseIcon } from "./icons";

// The viewport width at which the time display begins to scale
const BEGIN_SCALING_WIDTH = 700;

const INITIAL_TOTAL_MS =
  (255 * 24 * 60 * 60 + 6 * 60 * 60 + 35 * 60 + 2) * 1000;

function msToTimeParts(remaining: number) {
  if (remaining <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, centiseconds: 0 };
  const days = Math.floor(remaining / 86_400_000);
  remaining %= 86_400_000;
  const hours = Math.floor(remaining / 3_600_000);
  remaining %= 3_600_000;
  const minutes = Math.floor(remaining / 60_000);
  remaining %= 60_000;
  const seconds = Math.floor(remaining / 1_000);
  const centiseconds = Math.floor((remaining % 1_000) / 10);
  return { days, hours, minutes, seconds, centiseconds };
}

/**
 * Large themed countdown from a fixed total, with optional pause when reduced motion is on
 * or when the user toggles pause (if the countdown control option is enabled).
 */
export default function TimeDisplay() {
  const { xsText, countdownToggle } = useOptions();
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [scale, setScale] = useState(
    Math.min(1, window.innerWidth / BEGIN_SCALING_WIDTH),
  );

  const elapsedBeforePauseRef = useRef(0);
  const runStartRef = useRef(Date.now());
  const [timeParts, setTimeParts] = useState(() =>
    msToTimeParts(INITIAL_TOTAL_MS),
  );

  useEffect(() => {
    setIsPaused(prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleResize = () => {
      setScale(Math.min(1, window.innerWidth / BEGIN_SCALING_WIDTH));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    runStartRef.current = Date.now();

    const id = setInterval(() => {
      const elapsed =
        elapsedBeforePauseRef.current + (Date.now() - runStartRef.current);
      const remaining = Math.max(0, INITIAL_TOTAL_MS - elapsed);
      setTimeParts(msToTimeParts(remaining));
      if (remaining <= 0) clearInterval(id);
    }, 100);

    return () => {
      elapsedBeforePauseRef.current += Date.now() - runStartRef.current;
      clearInterval(id);
    };
  }, [isPaused]);

  const formatNumber = (num: number, digits = 2) => {
    return num.toString().padStart(digits, "0");
  };

  const timeValues = [
    formatNumber(timeParts.days, 3),
    formatNumber(timeParts.hours),
    formatNumber(timeParts.minutes),
    formatNumber(timeParts.seconds),
    formatNumber(timeParts.centiseconds),
  ];

  const timeLabels = ["Days", "Hours", "Minutes", "Seconds", "Milliseconds"];

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div
      className="sm:overflow-hidden"
      // Scale the time display to fit the screen
      // End value represents margin offset
      style={{ height: `calc(${100 * scale - 20}px)` }}
    >
      <div
        className="flex items-start h-fit"
        style={{
          transform: `scale(${scale * 1.2})`,
          transformOrigin: "left top",
        }}
      >
        <div className="flex">
          <div className="flex items-start">
            {timeValues.map((value, index) => (
              <div key={index} className="flex flex-col relative">
                {/* Time value with separator */}
                <div className="flex items-start">
                  <div
                    className={`font-wipeout3 text-white subpixel-fix text-[35px] block w-[1ch] text-center leading-none ${
                      index === 0 ? "w-[3ch]" : "w-[2ch]"
                    }`}
                  >
                    {value}
                  </div>
                  {index < timeValues.length - 1 && (
                    <div className="font-wipeout3 text-white subpixel-fix theme-text-accent text-[35px] block w-[1ch] text-center leading-none">
                      /
                    </div>
                  )}
                </div>
                {/* Label */}
                <div
                  className={`${xsText ? "text-w3-xs font-bold" : "text-w3-sm"} pl-2 uppercase theme-text flex flex-col justify-end pt-2 border-l border-black ${
                    index === 0 ? "w-[3ch]" : "w-[2ch]"
                  }`}
                >
                  {timeLabels[index]}
                </div>
              </div>
            ))}
          </div>
          {countdownToggle && (
            <div className="flex flex-direction-column items-end ml-6">
              <button
                type="button"
                onClick={togglePause}
                aria-label={isPaused ? "Resume countdown" : "Pause countdown"}
                className="group ml-4 inline-flex h-9 scale-125 origin-bottom sm:scale-75 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="h-full inline-flex items-center justify-center angled-corner-sm bg-white/40 group-hover:bg-neutral-100/80 px-3 text-sm font-medium text-neutral-900 transition-colors">
                  {isPaused ? (
                    <PlayIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <PauseIcon className="h-4 w-4 shrink-0" />
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
