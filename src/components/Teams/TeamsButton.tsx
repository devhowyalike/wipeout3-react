import React, { memo } from "react";
import { useUISounds } from "@/hooks/useUISounds";
import { teamsData } from "./teamsData";
import AGSystemsIcon from "./icons/AGSystemsIcon";
import AssegaiIcon from "./icons/AssegaiIcon";
import AuricomIcon from "./icons/AuricomIcon";
import FeisarIcon from "./icons/FeisarIcon";
import GotekiIcon from "./icons/GotekiIcon";
import IcarasIcon from "./icons/IcarasIcon";
import PirhanaIcon from "./icons/PirhanaIcon";
import QirexIcon from "./icons/QirexIcon";

type IconId = (typeof teamsData)[number]["id"];

const iconComponents: Record<IconId, React.FC> = {
  agsystems: AGSystemsIcon,
  assegai: AssegaiIcon,
  auricom: AuricomIcon,
  feisar: FeisarIcon,
  goteki45: GotekiIcon,
  icaras: IcarasIcon,
  pirhanaAdv: PirhanaIcon,
  qirex: QirexIcon,
};

interface TeamsButtonProps {
  iconId: IconId;
  onHover: (teamId: IconId) => void;
  onClick?: (teamId: IconId) => void;
}

const TeamsButtonComponent: React.FC<TeamsButtonProps> = ({
  iconId,
  onHover,
  onClick,
}) => {
  const IconComponent = iconComponents[iconId];

  const { playHoverSound, playClickSound } = useUISounds();

  const handleMouseEnter = () => {
    playHoverSound();
    onHover(iconId);
  };

  const handleMouseLeave = () => {
    onHover("" as IconId);
  };

  const handleClick = () => {
    playClickSound();
    onClick?.(iconId);
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      tabIndex={0}
      className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black inline-flex w-fit"
    >
      <IconComponent />
    </button>
  );
};

/**
 * Icon button for one team logo: plays UI hover/click sounds and reports hover or click to parent.
 */
export const TeamsButton = memo(TeamsButtonComponent);
