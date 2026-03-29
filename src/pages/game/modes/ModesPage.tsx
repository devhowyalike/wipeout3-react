import TablePage from "@/components/TablePage";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

/** Game modes overview page. */
export default function ModesPage() {
  const { xsText } = useOptions();
  const textClass = bodyTextClass(xsText);

  return (
    <TablePage
      theme="emeraldTheme"
      documentTitle="Game | Modes"
      footerTitle="Modes"
      headlineTitle="Modes"
      tableTitle="Wipeout Three is a Registered Trademark of Psygnosis LTD"
    >
      <div
        className={`sm:pr-[100px] ${xsText ? "space-y-2" : "space-y-4"}`}
      >
        <Headline level={2} variant="lg">
          Single Race
        </Headline>
        <p className={textClass}>
          Intense racing with weapons and checkpoints against a full field of
          competitors. Clear each checkpoint before your time runs out or it's
          game over before you've even finished the race. The number of laps
          depends on the racing class being played. If your shield energy is
          running low, boost your power in the pit lane.
        </p>
        <Headline level={2} variant="lg">
          Time Trial
        </Headline>
        <p className={textClass}>
          A race against the clock without weapons or enemy craft. A ghost craft
          will fly a duplicate of the previous best race. Ghost races can be
          loaded from memory card via the load time trial option in the racing
          class menu. Best race times can be saved to memory card for future
          games.
        </p>
        <Headline level={2} variant="lg">
          Challenge
        </Headline>
        <p className={textClass}>
          Twenty-four unique assignments await you. Divided into three challenge
          modes, you will be set specific tasks using preset craft on
          predetermined circuits:
        </p>
        <ul className="ml-10 space-y-4">
          <li className={textClass}>
            <strong>Race challenge:</strong> Race to achieve 1st, 2nd, or 3rd
            against a standard array of competitors.
          </li>
          <li className={textClass}>
            <strong>Time challenge:</strong> Race to complete the circuit within
            a predetermined time.
          </li>
          <li className={textClass}>
            <strong>Weapon challenge:</strong> Race and destroy a fixed number
            of opponents.
          </li>
        </ul>
        <p className={textClass}>
          Note: Rumors of a further eight grueling tasks within a fourth
          challenge mode have been strongly denied by F7200 officials.
        </p>
        <Headline level={2} variant="lg">
          Eliminator
        </Headline>
        <p className={textClass}>
          A score-based event where a full complement of opponents vie for
          superiority. You score one point for each completed lap and one point
          for each competitor destroyed. The race continues until either you or
          your opponents achieve the target score. Craft destroyed during the
          race are re-spawned at the starting line.
        </p>
        <p className={textClass}>
          Note: The pit lane is deactivated during Eliminator events.
        </p>
        <Headline level={2} variant="lg">
          Tournament
        </Headline>
        <p className={textClass}>
          The ultimate anti-gravity championships of all time. A full line-up of
          competitors contest the fast and furious tournament mode over a
          variety of circuits. Run on a points-for-places basis, the pilot at
          the top of the leaderboard at the end of the season is crowned the
          champion.
        </p>
        <p className={textClass}>
          In the event of a tie, the pilot with the most medals wins, and in the
          case of this being a tie, the player with the greater value of medals
          wins (gold being worth 3 points, silver 2, and bronze 1). In the
          continued case of a tie, the player with the lowest overall racing
          time for the four tracks wins.
        </p>
      </div>
    </TablePage>
  );
}
