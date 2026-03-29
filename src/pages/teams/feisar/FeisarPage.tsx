import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Feisar team page. */
const FeisarPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "feisar")?.teamName;

  if (!teamName) {
    throw new Error("Feisar team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Feisar"
      footerTitle="Feisar"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default FeisarPage;
