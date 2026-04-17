import Page from "@/components/Page";
import VerticalBillboard from "@/components/VerticalBillboard";
import svg1 from "/images/2097/1.svg";
import svg2 from "/images/2097/2.svg";
import svg3 from "/images/2097/3.svg";
import svg4 from "/images/2097/4.svg";
import svg5 from "/images/2097/5.svg";
import svg6 from "/images/2097/6.svg";
import svg7 from "/images/2097/7.svg";
import svg8 from "/images/2097/8.svg";
import svg9 from "/images/2097/9.svg";

/** Wipeout 2097/XL history page. */
export default function XLPage() {
  const imageUrls = [svg1, svg2, svg3, svg4, svg5, svg6, svg7, svg8, svg9];

  return (
    <Page theme="whiteTheme" documentTitle="History | 2097/XL" isFooterHidden>
      {/*
        VerticalBillboard portals its content to document.body (to escape the
        LowResolution CSS transform context), leaving <main> empty. The sr-only
        heading gives VoiceOver something to announce on route-change focus.
      */}
      <h1 className="sr-only">Wipeout 2097 / XL history</h1>
      <p className="sr-only">
        This page is a decorative display showing a rotating slideshow of
        imagery from the Wipeout 2097/XL website. There is no additional text
        content.
      </p>
      <VerticalBillboard images={imageUrls} interval={5000} />
    </Page>
  );
}
