import Page from "@/components/Page";
import { useOptions } from "@/hooks/useOptions";
import { Headline } from "@/components/Typography/Headline";
import { DESIGNERS_REPUBLIC_URL, GITHUB_PROFILE_URL, KLEBER_URL } from "@/config/constants";
import { useUISounds } from "@/hooks/useUISounds";

/** Credits page listing contributors. */
export default function CreditsPage() {
  const { reactEditionCredits } = useOptions();
  const { playHoverSound, playClickSound } = useUISounds();

  return (
    <Page
      theme="sandTheme"
      documentTitle="Pitlane | Credits"
      footerTitle="Credits"
      footerSubtitle="Pitlane Select"
    >
      <Headline>
        <span className="whitespace-pre-line">
          {`Site Design:
        `}
          <a
            href={DESIGNERS_REPUBLIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white subpixel-fix"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
          >
            mitdr
          </a>
          {` vs
        `}
          <a
            href={KLEBER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white subpixel-fix"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
          >
            kleber
          </a>
          {reactEditionCredits && (
            <>
              {` vs
        `}
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white subpixel-fix"
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
              >
                yameen
              </a>
            </>
          )}
        </span>
      </Headline>
    </Page>
  );
}
