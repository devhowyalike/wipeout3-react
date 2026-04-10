import { createPortal } from "react-dom";
import Page from "@/components/Page";
import wipeout1Image from "/images/wipeout/f3600.gif";

/** Original Wipeout history page. */
export default function WipeoutPage() {
  const imageLayer = (
    <div className="fixed inset-0 grid place-items-center p-6">
      <img
        src={wipeout1Image}
        alt="Logo for FE600 Anti-Gravity Racing League featuring a stylized red and navy blue curved design with a Wipeout craft silhouette racing toward an orange star. The text curves around the design reading 'FE600 Anti-Gravity Racing League.'"
        decoding="async"
        className="max-w-full max-h-full"
      />
    </div>
  );

  return (
    <Page
      theme="whiteTheme"
      documentTitle="History | Wipeout [1]"
      isFooterHidden
      className="w-full"
    >
      {/*
        The heading is visually hidden but gives VoiceOver something to
        announce when focus lands on <main> during route changes. Without it,
        <main> is empty because the image is portalled outside it (necessary
        to escape the LowResolution CSS transform context so the fixed
        positioning works correctly relative to the real viewport).
      */}
      <h1 className="sr-only">
        FE600 Anti-Gravity Racing League — Original Wipeout history
      </h1>
      {/* Portal so the image escapes the LowResolution
          option container and stays fixed to the real viewport. */}
      {createPortal(imageLayer, document.body)}
    </Page>
  );
}
