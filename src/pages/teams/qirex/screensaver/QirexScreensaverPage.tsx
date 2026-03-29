import React from "react";
import Page from "@/components/Page";
import { teamsData } from "@/components/Teams/teamsData";
import ScreenSaverDownload from "@/components/ScreenSaverDownload";

/** Qirex screensaver page. */
const QirexScreensaverPage: React.FC = () => {
  const team = teamsData.find((team) => team.id === "qirex");

  if (!team) {
    throw new Error("Qirex team data not found");
  }

  return (
    <Page
      theme="yellowTheme"
      documentTitle="Teams | Qirex RD | Screensaver"
      footerTitle="Qirex Research And Development"
      footerSubtitle="Team Select"
    >
      <ScreenSaverDownload teamName={team.teamName} teamId={team.id} />
    </Page>
  );
};

export default QirexScreensaverPage;
