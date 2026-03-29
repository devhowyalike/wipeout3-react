import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Icaras team page. */
const IcarasPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "icaras")?.teamName;

  if (!teamName) {
    throw new Error("Icaras team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Icaras"
      footerTitle="Icaras"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default IcarasPage;
