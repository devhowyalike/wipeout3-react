import TimeDisplay from "@/components/TimeDisplay";
import { DESIGNERS_REPUBLIC_URL, KLEBER_URL } from "@/config/constants";
import { Link } from "react-router-dom";
import W3RightArrow from "@/components/Icons/W3RightArrow";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

/** News page with countdown and announcements. */
export default function NewsPage() {
  const { xsText } = useOptions();
  const textClass = bodyTextClass(xsText);

  const headerClass = xsText
    ? "flex flex-row mb-3 mt-[3px]"
    : "flex flex-row mb-3";

  return (
    <Page theme="sandTheme" documentTitle="News" footerTitle="News">
      <Headline
        level={1}
        variant="xl"
        className="font-wipeout3 theme-text lowercase text-6xl mb-3"
      >
        W3 Loaded.
      </Headline>
      <div className="mb-4">
        <TimeDisplay />
      </div>
      <div className="max-w-lg">
        <div className="grid grid-cols-[auto_1fr]">
          <div className="">
            <W3RightArrow size="lg" />
          </div>
          <section className="pt-[83px]">
            <article className="mb-7">
              <header className={headerClass}>
                <h2 className={textClass}>W3 UPDATE</h2>
                <time dateTime="1999-10-22" className={`ml-1 ${textClass}`}>
                  [221099]
                </time>
              </header>
              <div>
                <p className={textClass}>W3:BAFTA. BEST VISUAL DESIGN 1999</p>
                <p className={textClass}>
                  <Link to="/pitlane/screensavers" className="text-body-link">
                    SCREENSAVERS
                  </Link>{" "}
                  - LIVE 22ND OCTOBER 1999
                </p>
                <p className={textClass}>
                  EIGHT FLAVOURS: AG-SYSTEMS, ASSEGAI, AURICOM, FEISAR, GOTEKI,
                  ICARAS, PIRHANA & QIREX.
                </p>
              </div>
            </article>

            <article className="mb-7">
              <header className={headerClass}>
                <h2 className={textClass}>W3 UPDATE</h2>
                <time dateTime="1999-09-01" className={`ml-1 ${textClass}`}>
                  [010999]
                </time>
              </header>
              <p className={textClass}>
                <Link to="/pitlane/wallpaper/" className="text-body-link">
                  WALLPAPER
                </Link>{" "}
                - LIVE 1ST SEPTEMBER 1999
              </p>
            </article>

            <article className="mb-7">
              <header className={headerClass}>
                <h2 className={textClass}>W3 UPDATE</h2>
                <time dateTime="1999-08-05" className={`ml-1 ${textClass}`}>
                  [050899]
                </time>
              </header>
              <ul>
                <li className={textClass}>
                  <Link to="/pitlane/forum/" className="text-body-link">
                    FORUM
                  </Link>{" "}
                  - LIVE 5TH AUGUST 1999
                </li>
                <li className={textClass}>
                  <Link to="/pitlane/chat/" className="text-body-link">
                    CHAT ROOM
                  </Link>{" "}
                  - LIVE 5TH AUGUST 1999
                </li>
                <li className={textClass}>
                  <Link to="/soundtrack/" className="text-body-link">
                    SOUNDTRACK
                  </Link>{" "}
                  - UNDER CONSTRUCTION 5TH AUGUST 1999
                </li>
                <li className={textClass}>
                  <Link to="/tour/" className="text-body-link">
                    TOUR
                  </Link>{" "}
                  - UNDER CONSTRUCTION 5TH AUGUST 1999
                </li>
              </ul>
            </article>

            <article className="mb-7">
              <header className={headerClass}>
                <h2 className={textClass}>W3 UPDATE</h2>
                <time dateTime="1999-08-02" className={`ml-1 ${textClass}`}>
                  [020899]
                </time>
              </header>
              <div>
                <p className={textClass}>
                  <Link to="/pitlane/screensavers">SCREENSAVERS</Link>
                </p>
                <p className={textClass}>FOUR FLAVOURS: ASSEGAI, FEISAR, GOTEKI & PIRHANA.</p>
                <p className={textClass}>
                  <Link to="/game" className="text-body-link">
                    GAME INFO
                  </Link>{" "}
                  - LIVE 28TH JULY 1999
                </p>
                <p className={textClass}>
                  <Link to="/teams" className="text-body-link">
                    TEAM INFO
                  </Link>{" "}
                  - LIVE 28TH JULY 1999
                </p>
              </div>
            </article>

            <footer>
              <p className={`mb-3 ${textClass}`}>[COPYRIGHT] 1999 PSYGNOSIS LTD.</p>
              <p className={textClass}>
                <a
                  href={DESIGNERS_REPUBLIC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-link"
                >
                  MTDR
                </a>
                &#8194;VS&#8194;
                <a
                  href={KLEBER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-link"
                >
                  KLEBER
                </a>
              </p>
            </footer>
          </section>
        </div>
      </div>
    </Page>
  );
}
