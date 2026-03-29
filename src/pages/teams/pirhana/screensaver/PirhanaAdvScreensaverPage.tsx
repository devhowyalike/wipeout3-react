import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Pirhana Advancements screensaver page. */
const PirhanaAdvScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "pirhanaAdv");

  if (!team) {
    throw new Error("Pirhana ADV team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Pirhana Advancements | Screensaver"
      footerTitle="Pirhana Advancements"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default PirhanaAdvScreensaverPage;
