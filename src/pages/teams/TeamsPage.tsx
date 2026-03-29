import React from "react";
import { useNavigate } from "react-router-dom";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { TeamsLogos } from "@/components/Teams/TeamsLogos";
import { teamsData } from "@/components/Teams/teamsData";
import { prefetchRoute } from "@/utils/prefetchRoute";

const TEAMS_PAGE_TITLE = "Team Select";

/** Teams overview page with team selection. */
const TeamsPage: React.FC = () => {
  const [headerText, setHeaderText] = React.useState(TEAMS_PAGE_TITLE);
  const navigate = useNavigate();

  const handleTeamHover = (teamId: string) => {
    const team = teamsData.find((team) => team.id === teamId);
    setHeaderText(team ? team.teamName : TEAMS_PAGE_TITLE);
    if (team) prefetchRoute(team.id);
  };

  const handleTeamClick = (teamId: string) => {
    const team = teamsData.find((team) => team.id === teamId);
    if (team) {
      navigate(team.route);
    }
  };

  return (
    <Page
      theme="sandTheme"
      documentTitle="Team Select"
      footerTitle="Team Select"
    >
      <Headline
        level={1}
        variant="xl"
        className="text-white mb-14 subpixel-fix"
      >
        {headerText}
      </Headline>

      <TeamsLogos onTeamHover={handleTeamHover} onTeamClick={handleTeamClick} />
    </Page>
  );
};

export default TeamsPage;
