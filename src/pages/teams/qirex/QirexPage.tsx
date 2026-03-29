import React from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import UnderConstructionStatus from "@/components/UnderConstructionStatus/UnderConstructionStatus";
import { teamsData } from "@/components/Teams/teamsData";

/** Qirex team page. */
const QirexPage: React.FC = () => {
  const teamName = teamsData.find((team) => team.id === "qirex")?.teamName;

  if (!teamName) {
    throw new Error("Qirex team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Qirex RD"
      footerTitle="Qirex Research And Development"
      footerSubtitle="Team Select"
    >
      <Headline level={1} variant="xl">
        {teamName}
      </Headline>
      <UnderConstructionStatus />
    </Page>
  );
};

export default QirexPage;
