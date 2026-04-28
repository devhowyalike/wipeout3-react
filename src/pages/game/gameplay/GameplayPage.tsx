import TablePage from "@/components/TablePage";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";
import type { ReactNode } from "react";

function GameSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <Headline level={3} variant="bodyCopy" bold>
        {title}
      </Headline>
      {children}
    </>
  );
}

/** Gameplay information page. */
export default function GameplayPage() {
  const { xsText } = useOptions();
  const textClass = bodyTextClass(xsText);

  return (
    <TablePage
      theme="pineTheme"
      documentTitle="The Game | Gameplay"
      headlineTitle="Game:Play"
      tableTitle="W03.00.02 F7200 RACING LEAGUE REGULATIONS DOCUMENT"
      footerTitle="Gameplay"
      footerSubtitle="Game Select"
    >
      <div
        className={`sm:pr-[100px] ${xsText ? "space-y-2" : "space-y-4"}`}
      >
        <Headline level={2} variant="lg">
          Racing Classes
        </Headline>
        <GameSection title="Vector Class">
          <p className={textClass}>
            For novices or those that like to take things steady.
          </p>
        </GameSection>
        <GameSection title="Venom Class">
          <p className={textClass}>
            For intermediate players or those that fancy their chances.
          </p>
        </GameSection>
        <GameSection title="Rapier Class">
          <p className={textClass}>
            For more advanced pilots or those who want to break new ground.
          </p>
        </GameSection>
        <GameSection title="Footnote">
          <p className={textClass}>
            Rumor has it that the F7200 organizers are to reintroduce a previously
            prohibited racing class. Only experts need apply.
          </p>
        </GameSection>
        <Headline level={2} variant="lg">
          Playing the Game
        </Headline>
        <GameSection title="Weapon Grids">
          <p className={textClass}>
            Coloured weapon grids litter the circuit. Fly over a grid to equip
            your craft with a weapon. See the weapons section for more
            information. Weapon grids are deactivated in a time trial.
          </p>
        </GameSection>
        <GameSection title="Speed Pads">
          <p className={textClass}>
            Speed pads, in the shape of blue chevrons, are strategically placed on
            tracks and boost the velocity of craft passing overhead. Multiple
            speed pads will add an incremental speed boost: for instance, two
            speed pads in succession will add twice as much boost.
          </p>
          <p className={textClass}>
            Speed pads along straight sections can improve overtaking. Speed pads
            in and around track corners may result in more collisions and,
            consequently, diminished speed.
          </p>
        </GameSection>
        <GameSection title="Checkpoints">
          <p className={textClass}>
            Checkpoints are blue beams of light that stretch horizontally across
            the circuit at regular intervals. As soon as you begin a race, a
            countdown showing your allotted time will be activated. If the counter
            reaches zero before you pass the next checkpoint - that's game over!
          </p>
          <p className={textClass}>
            As you progress and improve, you should reach each checkpoint with
            time to spare.
          </p>
        </GameSection>
        <GameSection title="Hyper-Thrust">
          <p className={textClass}>
            Hyper-thrust boosts craft speed by tapping into the shield energy
            reservoir. Extensive use of hyper-thrust will drain the craft's energy
            reserves and leave it vulnerable to elimination from opponents.
          </p>
          <p className={textClass}>
            Hyper-thrust will be disabled if shield energy falls below 25%.
          </p>
        </GameSection>
        <GameSection title="Air-Brakes">
          <p className={textClass}>
            Each craft is fitted with left and right air brakes, to facilitate
            turning sharply and reducing speed. Very handy when entering severe
            corners.
          </p>
        </GameSection>
        <GameSection title="Altitude Changes">
          <p className={textClass}>
            Beware of changes in altitude - climbing a hill can obscure the
            circuit ahead and the resulting descent can lead to a hard-to-control
            speed rush. Combined with bends, hills can prove to be quite
            challenging circuit features. Additionally, short frequent altitude
            changes can result in unwanted bottoming out of the AG craft if the
            wrong speed is maintained over the obstacle.
          </p>
          <p className={textClass}>
            The most severe altitude changes come from jumps. Correctly judging
            your launch angle, minimum speed, mid-air steering, and touchdown
            techniques could make all the difference when it comes to making a
            smooth jump or crashing into the scenery.
          </p>
        </GameSection>
        <GameSection title="Pit Lane">
          <p className={textClass}>
            Recharge shield energy by flying into a pit lane. These are clearly
            marked blue striped sections of track.
          </p>
          <p className={textClass}>
            The shield strength recovered is based on time spent in the pit lane -
            less time within the lane will result in less strength recovered.
          </p>
        </GameSection>
        <GameSection title="Winning Medals">
          <p className={textClass}>
            A first-place finish naturally takes the coveted gold medal.
            Runners-up have to settle for silver, and if you come third, it's the
            F7200 Race League bronze medal for you! Medals are awarded for the
            track regardless of class.
          </p>
          <p className={textClass}>
            Consecutive gold medals will unlock hidden circuits and launch new
            teams.
          </p>
          <p className={textClass}>
            Unconfirmed reports allege the F7200 Race League will herald the
            re-introduction of a previously banned championship class.
          </p>
        </GameSection>
      </div>
    </TablePage>
  );
}
