import Page from "@/components/Page";
import wipeout1Image from "/images/wipeout/f3600.gif";

/** Original Wipeout history page. */
export default function WipeoutPage() {
  return (
    <Page
      theme="whiteTheme"
      documentTitle="History | Wipeout [1]"
      isFooterHidden
      className="w-full"
    >
      <div className="grid min-h-[calc(100svh-3rem)] place-items-center">
        <img
          src={wipeout1Image}
          alt="Logo for FE600 Anti-Gravity Racing League featuring a stylized red and navy blue curved design with a Wipeout craft silhouette racing toward an orange star. The text curves around the design reading 'FE600 Anti-Gravity Racing League.'"
          decoding="async"
          className="max-w-full"
        />
      </div>
    </Page>
  );
}
