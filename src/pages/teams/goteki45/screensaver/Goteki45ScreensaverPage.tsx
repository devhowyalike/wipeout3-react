import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Goteki 45 screensaver page. */
const Goteki45ScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "goteki45");

  if (!team) {
    throw new Error("Goteki45 team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Goteki 45 | Screensaver"
      footerTitle="Goteki 45"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default Goteki45ScreensaverPage;
