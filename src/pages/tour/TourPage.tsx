import TablePage from "@/components/TablePage";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

const futureDates = [
  "10th August - Solar Eclipse Festival - Cornwall UK",
  "13th August - Edinburgh Castle with Orbital",
  "14th August - Bologna, Italy",
  "22nd August - Pacha Club in Ibiza with Sasha",
  "3rd September - eWorks in Berlin with Paul van Dyk",
  "9th September - Paris (line up TBC)",
];

/** Tour page. */
export default function TourPage() {
  const textClass = bodyTextClass(useOptions().xsText);
  return (
    <TablePage
      theme="forestTheme"
      documentTitle="Tour"
      headlineTitle="Wip3out Tour"
      tableTitle="W03.03.02 AUDIO SPECIFICATION"
      footerTitle="Tour"
    >
      <Headline level={2} variant="lg">
        Sasha: U.S Tour: Global Underground
      </Headline>
      <p className={textClass}>
        We kicked off the Wip3out tour in the US by co-sponsoring the launch of
        Sasha's Global Underground CD. This tour took in dates in Boston, New
        York, Florida, Toronto, Los Angeles finishing up on the 4th of July in
        San Francisco. Wipeout visuals were featured at every venue and we also
        had giveaways of frisbees, t-shirts, etc. The Sasha fans were ecstatic
        and all the venues sold out. We are currently planning more Wipeout
        dates for the US.
      </p>
      <Headline level={2} variant="lg">
        Wip3out European Tour
      </Headline>
      <p className={textClass}>
        The first of the European dates was the 24th July held in London. Sasha
        and Craig Richards were the DJ's for the night and worked the crowd into
        a frenzy until the plug was pulled on them at 3.30 a.m. Over 1,000
        people turned up on the night including journalists, staff, celebs, the
        S.C.E.E boss and a few liggers but all agreed that it was a great night
        despite the headaches next day.
      </p>
      <Headline level={2} variant="lg">
        Future Dates
      </Headline>
      <div className={textClass}>
        <p className={`${textClass} mb-4`}>Further dates are planned across Europe as follows:</p>
        {futureDates.map((date) => (
          <p key={date} className={textClass}>{date}</p>
        ))}
        <p className={`${textClass} mt-4`}>Also to be confirmed - Greece</p>
      </div>
    </TablePage>
  );
}
