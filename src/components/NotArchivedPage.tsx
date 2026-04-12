import AngryManIcon from "./Icons/AngryManIcon";
import { Headline } from "./Typography/Headline";

/**
 * Placeholder page when a section exists in navigation but was not archived.
 * Shows the page title, a short message, and the Angry Man graphic.
 */
export default function NotArchivedPage({ pageTitle }: { pageTitle: string }) {
  return (
    <>
      <Headline level={1} variant="xl" className="mb-14">
        {pageTitle}
      </Headline>
      <Headline level={2} variant="lg" className="mb-7">
        This section was not archived.
      </Headline>
      <AngryManIcon size="md" blink aria-label="Angryman" />
    </>
  );
}
