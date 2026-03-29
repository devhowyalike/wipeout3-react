import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Auricom screensaver page. */
const AuricomScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "auricom");

  if (!team) {
    throw new Error("Auricom team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Auricom | Screensaver"
      footerTitle="Auricom"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default AuricomScreensaverPage;
