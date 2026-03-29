import { useState } from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

type EffectLetter = "m" | "i" | "t" | "d" | "r" | null;

interface TextSegment {
  text: string;
  effect: EffectLetter;
  className?: string;
}

/** Made In The Designers Republic page. */
export default function MitdrPage() {
  const textClass = bodyTextClass(useOptions().xsText);
  const [activeEffect, setActiveEffect] = useState<EffectLetter>(null);

  const handleMouseEnter = (letter: EffectLetter) => {
    setActiveEffect(letter);
  };

  const handleMouseLeave = () => {
    setActiveEffect(null);
  };

  const textContent: TextSegment[] = [
    // \n for line breaks
    // Line 1
    { text: "qwe", effect: null },
    { text: "r", effect: "r" },
    { text: "t", effect: "t" },
    { text: "yu", effect: null },
    { text: "i", effect: "i" },
    { text: "op[]\n", effect: null },
    // Line 2
    { text: "zis", effect: null },
    { text: "d", effect: "d" },
    { text: "fqhjk;'", effect: null },
    { text: "/\n", effect: null, className: "scale-x-[-1] inline-block" },
    // Line 3
    { text: "ZXCNAN", effect: null },
    { text: "M", effect: "m" },
    { text: ",./", effect: null },
  ];

  return (
    <Page
      theme="mitdrTheme"
      documentTitle="History | Mitdr"
      footerTitle="Mitdr"
      footerSubtitle="History Select"
    >
      <div className="max-w-md" role="main">
        <div aria-label="MITDR Interactive Title">
          <Headline variant="xl" level={1} className="mb-1">
            <div role="group" aria-label="Interactive letter effects">
              {["m", "i", "t", "d", "r"].map((letter, index) => (
                <button
                  key={index}
                  data-trigger={letter.toLowerCase()}
                  onMouseEnter={() =>
                    handleMouseEnter(letter.toLowerCase() as EffectLetter)
                  }
                  onMouseLeave={handleMouseLeave}
                  className="cursor-pointer"
                  aria-pressed={activeEffect === letter.toLowerCase()}
                  aria-label={`Activate ${letter} effect`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </Headline>
        </div>

        <div
          role="region"
          aria-label="Interactive text display"
          aria-live="polite"
        >
          <Headline variant="xl" level={2} className="whitespace-pre-line mb-8">
            {textContent.map((segment, index) => (
              <span
                key={index}
                data-effect={segment.effect}
                className={`subpixel-fix ${segment.className || ""} ${
                  segment.effect
                    ? activeEffect === segment.effect
                      ? ""
                      : "invisible"
                    : activeEffect
                    ? "invisible"
                    : ""
                }`}
                aria-hidden={
                  segment.effect
                    ? activeEffect !== segment.effect
                    : activeEffect !== null
                }
              >
                {segment.text}
              </span>
            ))}
          </Headline>
        </div>

        <div aria-label="Typographic Solutions">
          <Headline variant="lg" level={3} className="mb-7 whitespace-pre-line">
            {`Typographic\nSolutions`}
          </Headline>
        </div>

        <p className={textClass} aria-label="About The Designers Republic">
          The Designers Republic were the design agency chosen by the team to
          tie the in game icons to the packaging and the manual. Based in
          Sheffield, they spent many months coming up with in-game icons,
          head-up display (HUD) and worked closely with the team on all artistic
          content including the team logos and liveries. They ensured the right
          look and feel for the product and have been brought in for both PSX
          sequels to ensure continuity.
        </p>
      </div>
    </Page>
  );
}
