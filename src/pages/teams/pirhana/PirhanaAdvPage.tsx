import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Pirhana Advancements team page. */
const PirhanaAdvPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "pirhanaAdv")?.teamName;

  if (!teamName) {
    throw new Error("Pirhana ADV team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Pirhana Advancements"
      footerTitle="Pirhana Advancements"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default PirhanaAdvPage;
