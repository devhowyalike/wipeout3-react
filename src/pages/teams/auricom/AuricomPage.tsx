import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Auricom team page. */
const AuricomPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "auricom")?.teamName;

  if (!teamName) {
    throw new Error("Auricom team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Auricom"
      footerTitle="Auricom"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default AuricomPage;
