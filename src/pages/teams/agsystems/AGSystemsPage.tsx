import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** AG Systems team page. */
const AGSystemsPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "agsystems")?.teamName;

  if (!teamName) {
    throw new Error("AG Systems team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | AG-Systems International"
      footerTitle="AG-Systems International"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default AGSystemsPage;
