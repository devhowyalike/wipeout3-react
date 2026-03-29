import { Headline } from "@/components/Typography/Headline";
import TablePage from "@/components/TablePage";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

/** Documentation/history docs page. */
export default function DocsPage() {
  const textClass = bodyTextClass(useOptions().xsText);
  return (
    <TablePage
      theme="grayTheme"
      documentTitle="History | Docs"
      headlineTitle="Docs"
      tableTitle="W03.03.02 W BRAND DOCUMENTS"
      footerTitle="Docs"
      footerSubtitle="History Select"
    >
      <p className={textClass}>
        Wipeout has been fundamental in the success of the Sony PlayStation, the
        most successful video game system ever. The game has received an
        abundance of press accolades across all countries since release and even
        though the original is over 3 years old it is still perceived as a
        benchmark title by which all other PlayStation racing titles are judged.
      </p>

      <p className={textClass}>
        The idea originally came from a core of Psygnosis development who wanted
        a game that broke new ground and really caught the mood of the UK at the
        time with it's underground feel and styling. Wipeout emerged as an
        impressive, fast and innovative racing game and Psygnosis' attention
        turned to ways in which the game could capitalize on the marketing
        methods of the music and fashion industries.
      </p>

      <p className={textClass}>
        Wipeout was launched in November 1995 along with the launch of Sony
        PlayStation in Europe. It was quickly hailed as a masterpiece and
        received numerous awards for it's art, music and gameplay.
      </p>

      <p className={textClass}>
        The game went to number one in the all format charts and stayed in the
        top 10 for the first 3 months of PlayStation Europe. Over 1.5 million
        units of the franchise have sold to date throughout Europe and North
        America and as such it is the most successful brand ever produced by
        Psygnosis internal development.
      </p>

      <p className={textClass}>
        A number of marketing hooks were built into the product, including music
        tracks licensed from non-mainstream dance acts and the hiring of cult
        design agency The Designers Republic to work on game packaging, manual
        and in game branding. The intention was to place Wipeout firmly within
        the context of a fashionable, club-going, music-buying market, which was
        niche, but with a high number of influential opinion formers.
      </p>

      <p className={textClass}>
        Launch activities for the game included the installation of PlayStation
        consoles running Wipeout in popular nightclubs, the release of an
        accompanying music CD and the sale of a range of Wipeout club-wear.
      </p>

      <p className={textClass}>
        Following the success of the original Wipeout, Psygnosis knew it was
        working with a high profile brand. However, the follow up game needed to
        ensure that particular attention was made to the new features to move
        the brand forward.
      </p>

      <p className={textClass}>
        Wipeout 2097 (XL in the US), was concepted and put into production. The
        marketing campaign took the original concept further. A number of record
        labels were approached for the soundtrack and Virgin ended up publishing
        the soundtrack CD in Europe with Astralwerks in the US. The final
        tracklisting included such high profile artists as The Prodigy, The
        Chemical Brothers and Underworld. An entire nightclub tour was also
        initiated in conjunction with Red Bull Energy Drink that featured
        prominently throughout the game.
      </p>

      <p className={textClass}>
        The game itself moved the brand forward and introduced new tracks, new
        craft as well as an update of the award winning graphics. To cater for
        the increase in the PlayStation owners an easier learning curve was
        introduced whilst keeping the difficulty at the top end for the
        experienced gamers.
      </p>

      <p className={textClass}>
        The next move for the Wipeout brand was a Nintendo 64 version of the
        game which was developed internally in the Liverpool studios. Work was
        commenced in 1997 with a view to a lunch in late '98. The publishing
        rights for the game went to Midway in the US and Europe and the game was
        released in the US pre-Christmas and the UK-post Christmas scoring a big
        success in the Nintendo charts. For the first time the game featured 4
        player instant action with a variety of new tracks but essentially the
        same game.
      </p>

      <Headline level={2} variant="bodyCopy" bold>
        Wipeout 3
      </Headline>

      <p className={textClass}>
        Once Wipeout 64 was complete thoughts turned to another PlayStation
        version. This time the Psygnosis Leeds studio was asked to develop the
        game. The game was concepted and went into production in November '98. A
        number of key features have been added to the game as requested by
        consumers.
      </p>

      <ul>
        <li className={textClass}>Hi-resolution mode throughout</li>
        <li className={textClass}>Split screen 2 player mode</li>
        <li className={textClass}>Minimum 8 new tracks</li>
        <li className={textClass}>3 new racing teams along with 5 existing teams</li>
        <li className={textClass}>All new reward system</li>
        <li className={textClass}>New weapons and in game icons</li>
        <li className={textClass}>Scalability to allow new and old users access to the game</li>
        <li className={textClass}>Music soundtrack by international artists</li>
      </ul>

      <p className={textClass}>
        The aim of this version is to make it more commercial in keeping with
        the new PlayStation demographic and make it more accessible at the
        bottom end for new players whilst retaining the difficulty at the top
        end for the seasoned veterans.
      </p>
    </TablePage>
  );
}
