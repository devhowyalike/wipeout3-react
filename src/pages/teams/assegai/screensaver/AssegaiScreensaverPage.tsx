import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Assegai screensaver page. */
const AssegaiScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "assegai");

  if (!team) {
    throw new Error("Assegai team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Assegai Developments | Screensaver"
      footerTitle="Assegai Developments"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default AssegaiScreensaverPage;
