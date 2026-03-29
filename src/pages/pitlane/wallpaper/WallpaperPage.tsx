import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import W3RightArrow from "@/components/Icons/W3RightArrow";
import WallpaperTable from "./WallpaperTable";

/** Wallpaper downloads page. */
export default function WallpaperPage() {
  return (
    <Page
      theme="sandTheme"
      documentTitle="Pitlane | Wallpaper"
      footerTitle="Wallpaper"
      footerSubtitle="Pitlane Select"
    >
      <Headline level={1} variant="xl" className="md:mb-7">
        Wallpaper
      </Headline>
      <div className="max-w-lg">
        <div className="md:grid grid-cols-[auto_1fr]">
          <div className="">
            <W3RightArrow size="lg" />
          </div>
          <section className="md:pt-[90px]">
            <article className="mb-7">
              <WallpaperTable />
            </article>
          </section>
        </div>
      </div>
    </Page>
  );
}
