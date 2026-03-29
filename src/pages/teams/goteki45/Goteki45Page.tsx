import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Goteki 45 team page. */
const Goteki45Page: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "goteki45")?.teamName;

  if (!teamName) {
    throw new Error("Goteki45 team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Goteki 45"
      footerTitle="Goteki 45"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default Goteki45Page;
