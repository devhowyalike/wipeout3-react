import React, { useRef } from "react";
import { TeamsButton } from "./TeamsButton";
import ColourBreakdown from "./icons/ColourBreakdown/ColourBreakdown";
import "./teamsLogos.css";

interface TeamsLogosProps {
  onTeamHover: (teamId: string) => void;
  onTeamClick?: (teamId: string) => void;
  ariaLabelSuffix?: string;
}

/**
 * Grid of team logo buttons plus the colour-breakdown column; drives hover CSS via `data-team`.
 */
export const TeamsLogos: React.FC<TeamsLogosProps> = ({
  onTeamHover,
  onTeamClick,
  ariaLabelSuffix,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset CSS transition to prevent unintended animations
  const resetHoverTransition = (iconId: string) => {
    if (!containerRef.current) return;

    // Reset to initial state before applying the transition
    containerRef.current.dataset.team = "";

    setTimeout(() => {
      if (!containerRef.current) return;
      // Restore transition
      containerRef.current.style.transition = "";
      // Restore data attribute
      containerRef.current.dataset.team = iconId;
      // Delay before applying the transition
    }, 50);
  };

  const handleTeamHover = (iconId: string) => {
    onTeamHover(iconId);
    resetHoverTransition(iconId);
  };

  const leftColumnIcons = {
    top: "agsystems",
    middle: ["assegai", "auricom"],
    bottom: "feisar",
  } as const;

  const rightColumnIcons = [
    "goteki45",
    "icaras",
    "pirhanaAdv",
    "qirex",
  ] as const;

  return (
    <div ref={containerRef} className="max-w-[480px]" data-team="">
      <div className="grid grid-cols-[160px_1fr] sm:grid-cols-3">
        {/* Left Column */}
        <div className="flex flex-col justify-between h-full">
          <TeamsButton
            iconId={leftColumnIcons.top}
            onHover={handleTeamHover}
            onClick={onTeamClick}
            ariaLabelSuffix={ariaLabelSuffix}
          />
          <div className="flex flex-col space-y-1">
            {leftColumnIcons.middle.map((iconId) => (
              <TeamsButton
                key={iconId}
                iconId={iconId}
                onHover={handleTeamHover}
                onClick={onTeamClick}
                ariaLabelSuffix={ariaLabelSuffix}
              />
            ))}
          </div>
          <TeamsButton
            iconId={leftColumnIcons.bottom}
            onHover={handleTeamHover}
            onClick={onTeamClick}
            ariaLabelSuffix={ariaLabelSuffix}
          />
        </div>

        {/* Middle Column */}
        <div className="flex flex-col space-y-1">
          {rightColumnIcons.map((iconId) => (
            <TeamsButton
              key={iconId}
              iconId={iconId}
              onHover={handleTeamHover}
              onClick={onTeamClick}
              ariaLabelSuffix={ariaLabelSuffix}
            />
          ))}
        </div>

        {/* Right Column - Colour Breakdown */}
        <div className="hidden sm:flex justify-end">
          <div className="colour-breakdown">
            <div>
              <ColourBreakdown.Top />
            </div>
            <div className="stretch-container">
              <ColourBreakdown.Stretch />
            </div>
            <div>
              <ColourBreakdown.Bottom />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
