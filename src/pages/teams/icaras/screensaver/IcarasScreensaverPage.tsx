import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Icaras screensaver page. */
const IcarasScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "icaras");

  if (!team) {
    throw new Error("Icaras team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Icaras | Screensaver"
      footerTitle="Icaras"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default IcarasScreensaverPage;
