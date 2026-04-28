import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { TeamsLogos } from "@/components/Teams/TeamsLogos";
import { useTeamHeaderNav } from "@/hooks/useTeamHeaderNav";

const PAGE_TITLE = "Scr:Savers";

/** Screensavers download page. */
const ScreenSaversPage: React.FC = () => {
  const { headerText, handleTeamHover, handleTeamClick } = useTeamHeaderNav({
    defaultTitle: PAGE_TITLE,
    getNavigatePath: (team) => team.screenSaver,
    getPrefetchKey: (team) => `${team.id}Screensaver`,
  });

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
