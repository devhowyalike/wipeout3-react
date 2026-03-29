import Page from "@/components/Page";
import typographyImage from "/images/typography/wipeout-3-typography.svg";

/** Typography showcase page. */
export default function TypographyPage() {
  return (
    <Page
      theme="cremeTheme"
      documentTitle="Game | Previews | Typography"
      isFooterHidden
      className="-m-6 h-dvh w-[calc(100%+3rem)]"
    >
      <div className="flex h-full w-full items-end justify-center overflow-hidden">
        <img
          src={typographyImage}
          alt="Visual language document featuring Wipeout 3 typography, iconography, and layout specifications. The word 'Three' appears in the center of the image, with three numerical '3' characters appearing above it. The letters of the alphabet and numbers between 0-9 are primted to demonstrate the font's range of characters. A reference to the font's name, 'F500 Angu-lar' appears at the top-right corner of the image. Thin vertical lines and stylized arrows with 90 degree angles (refered to as 'Directional Devices') supplement the layout."
          decoding="async"
          className="h-full w-full object-contain object-bottom"
        />
      </div>
    </Page>
  );
}
