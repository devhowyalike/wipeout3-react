import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** AG Systems screensaver page. */
const AGSystemsScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "agsystems");

  if (!team) {
    throw new Error("AG Systems team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | AG-Systems International | Screensaver"
      footerTitle="AG-Systems International"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default AGSystemsScreensaverPage;
