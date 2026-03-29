import { useState } from "react";
import Page from "@/components/Page";
import { BorderedTable } from "@/components/BorderedTable";
import { Headline } from "@/components/Typography/Headline";
import DeveloperIconLayout from "./DeveloperIconLayout";
import { DeveloperDetails } from "./DeveloperDetails";
import { teamMembers } from "./teamMembers";

/** Developer credits page with team member icons. */
export default function DevelopersPage() {
  const [hoveredDeveloper, setHoveredDeveloper] = useState<
    (typeof teamMembers)[0] | null
  >(null);

  return (
    <Page
      theme="pinkTheme"
      documentTitle="The Game | Developers"
      footerTitle="Developers"
      footerSubtitle="Game Select"
    >
      <Headline level={1} variant="xl" className="mb-14">
        Developers
      </Headline>

      <BorderedTable
        title={
          <span>
            <span className="hidden sm:inline">E-MAIL CODE: </span>
            FIRSTNAMEDOTSECONDNAME@PSYGNOSISDOTCODOTUK
          </span>
        }
      >
        <DeveloperIconLayout
          onHover={setHoveredDeveloper}
          cycleEnabled={true}
        />
      </BorderedTable>

      <DeveloperDetails developer={hoveredDeveloper} />
    </Page>
  );
}
