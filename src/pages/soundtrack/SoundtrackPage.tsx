import TablePage from "@/components/TablePage";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

const trackList = [
  {
    artist: "Sasha",
    tracks: ["Auricom", "Goteki 45", "Feisar", "Icaras", "Pirhana", "Xpander"],
  },
  {
    artist: "MKL",
    tracks: ["Control", "Surrender"],
  },
  {
    artist: "Underworld",
    tracks: ["Kittens"],
  },
  {
    artist: "Orbital",
    tracks: ["Know Where to Run"],
  },
  {
    artist: "Paul Van Dyk",
    tracks: ["Avenue"],
  },
  {
    artist: "Propellerheads",
    tracks: ["Lethal Cut"],
  },
  {
    artist: "The Chemical Brothers",
    tracks: ["Under the Influence"],
  },
];

/** Soundtrack listing page. */
export default function SoundtrackPage() {
  const textClass = bodyTextClass(useOptions().xsText);

  return (
    <TablePage
      theme="aquaSonicTheme"
      documentTitle="Soundtrack"
      headlineTitle="Sound:track"
      tableTitle="W3.00.02 AUDIO SPECIFICATION"
      footerTitle="Soundtrack"
    >
      <p className={textClass}>
        Wipeout has always been synonymous with quality music right from it's
        beginnings.
      </p>
      <p className={textClass}>
        We have gone from a number of licensed tracks to a full licensed
        soundtrack on 2097/XL.
      </p>
      <p className={textClass}>
        With this version of Wipeout we have taken a different approach on the
        soundtrack by hiring international DJ Sasha to be musical director for
        the project.
      </p>
      <p className={textClass}>
        Sasha got involved in the project last December and has worked very
        closely with the development team at Leeds to ensure we get a film score
        feel to the game. He was also instrumental in getting the other artists
        involved in the game and suggested the flow of music throughout.
      </p>
      <Headline level={2} variant="lg">
        Tracklisting
      </Headline>
      <div>
        {trackList.map((item, index) => (
          <div key={index} className="grid grid-cols-[200px_1fr]">
            <div className={`uppercase text-body ${textClass}`}>{item.artist}</div>
            <div className={`uppercase text-body ${textClass}`}>
              {item.tracks.map((track, trackIndex) => (
                <span key={trackIndex}>
                  {track}
                  {trackIndex < item.tracks.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className={textClass}>
        Watch out for more info on these artists and downloadable clips of the
        tracks here in the near future.
      </p>
    </TablePage>
  );
}
