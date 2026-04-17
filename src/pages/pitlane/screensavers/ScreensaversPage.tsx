import React from "react";
import { useNavigate } from "react-router-dom";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { TeamsLogos } from "@/components/Teams/TeamsLogos";
import { teamsData } from "@/components/Teams/teamsData";
import { prefetchRoute } from "@/utils/prefetchRoute";

const PAGE_TITLE = "Scr:Savers";

/** Screensavers download page. */
const ScreenSaversPage: React.FC = () => {
  const [headerText, setHeaderText] = React.useState(PAGE_TITLE);
  const navigate = useNavigate();

  const handleTeamHover = (teamId: string) => {
    const team = teamsData.find((team) => team.id === teamId);
    setHeaderText(team ? team.teamName : PAGE_TITLE);
    if (team) prefetchRoute(`${team.id}Screensaver`);
  };

  const handleTeamClick = (teamId: string) => {
    const team = teamsData.find((team) => team.id === teamId);
    if (team) {
      navigate(team.screenSaver);
    }
  };

  return (
    <Page
      theme="sandTheme"
      documentTitle="Pitlane | Screensavers"
      footerTitle="Screensavers"
      footerSubtitle="Pitlane Select"
    >
      <Headline
        level={1}
        variant="xl"
        className="text-white mb-14 subpixel-fix"
      >
        {headerText}
      </Headline>

      <TeamsLogos onTeamHover={handleTeamHover} onTeamClick={handleTeamClick} ariaLabelSuffix="screensaver" />
    </Page>
  );
};

export default ScreenSaversPage;
