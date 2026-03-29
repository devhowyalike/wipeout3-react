import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import TracksWorldMap from "./TracksWorldMap";

/** Track listing page. */
export default function TracksPage() {
  return (
    <Page
      theme="madeInDrTheme"
      documentTitle="Track Select"
      footerTitle="Track Select"
      footerSubtitle="Game Select"
    >
      <Headline level={1} variant="xl" className="mb-14">
        Tracks
      </Headline>

      <div className="max-w-[570px]">
        <TracksWorldMap />
      </div>
    </Page>
  );
}
