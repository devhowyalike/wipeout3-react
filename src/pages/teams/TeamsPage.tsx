import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { TeamsLogos } from "@/components/Teams/TeamsLogos";
import { useTeamHeaderNav } from "@/hooks/useTeamHeaderNav";

const TEAMS_PAGE_TITLE = "Team Select";

/** Teams overview page with team selection. */
const TeamsPage: React.FC = () => {
  const { headerText, handleTeamHover, handleTeamClick } = useTeamHeaderNav({
    defaultTitle: TEAMS_PAGE_TITLE,
    getNavigatePath: (team) => team.route,
    getPrefetchKey: (team) => team.id,
  });

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
