import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Feisar screensaver page. */
const FeisarScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "feisar");

  if (!team) {
    throw new Error("Feisar team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Feisar | Screensaver"
      footerTitle="Feisar"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default FeisarScreensaverPage;
