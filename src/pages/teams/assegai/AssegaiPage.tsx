import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Assegai team page. */
const AssegaiPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "assegai")?.teamName;

  if (!teamName) {
    throw new Error("Assegai team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Assegai Developments"
      footerTitle="Assegai Developments"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default AssegaiPage;
