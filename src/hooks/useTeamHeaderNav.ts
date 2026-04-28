import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamsData } from "@/components/Teams/teamsData";
import { prefetchRoute } from "@/utils/prefetchRoute";

type TeamEntry = (typeof teamsData)[number];

interface UseTeamHeaderNavOptions {
  defaultTitle: string;
  getNavigatePath: (team: TeamEntry) => string;
  getPrefetchKey: (team: TeamEntry) => string;
}

/**
 * Shared logic for pages that display a `TeamsLogos` grid and update a header
 * on hover. Handles the hover → headerText update + prefetch, and the click →
 * navigate flow.
 */
export function useTeamHeaderNav({
  defaultTitle,
  getNavigatePath,
  getPrefetchKey,
}: UseTeamHeaderNavOptions) {
  const [headerText, setHeaderText] = useState(defaultTitle);
  const navigate = useNavigate();

  const handleTeamHover = (teamId: string) => {
    const team = teamsData.find((t) => t.id === teamId);
    setHeaderText(team ? team.teamName : defaultTitle);
    if (team) prefetchRoute(getPrefetchKey(team));
  };

  const handleTeamClick = (teamId: string) => {
    const team = teamsData.find((t) => t.id === teamId);
    if (team) navigate(getNavigatePath(team));
  };

  return { headerText, handleTeamHover, handleTeamClick };
}
