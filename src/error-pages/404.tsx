import AngryManIcon from "@/components/Icons/AngryManIcon";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";
import { useOptions } from "@/hooks/useOptions";
import { bodyTextClass } from "@/utils/textStyles";

const Page404 = () => {
  const { xsText } = useOptions();
  const textClass = bodyTextClass(xsText);
  const goBack = () => window.history.back();
  const goHome = () => (window.location.href = "/");

  return (
    <Page
      theme="mitdrTheme"
      documentTitle="404 Error"
      footerTitle="Err:or"
      className="h-full w-full"
    >
      <div className="flex justify-center items-center  min-h-full">
        <div className="flex items-center flex-col justify-center max-w-lg w-full text-center">
          <AngryManIcon size="md" blink />
          <Headline level={1} variant="xxl" className="mb-8">
            404
          </Headline>
          <Headline
            level={2}
            variant="lg"
            className="hover:text-black bg-accent-primary hover:bg-accent-secondary w-full py-2 block hover:cursor-not-allowed"
          >
            Page Not Found
          </Headline>
          <p className={`mt-4 text-gray-700 ${textClass}`}>
            Sorry, we couldn't find the track you're&nbsp;looking&nbsp;for.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={goBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold uppercase"
            >
              <span className="font-wipeout3" aria-hidden="true">
                &#xe005;
              </span>{" "}
              Go Back
            </button>
            <button
              onClick={goHome}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 font-bold uppercase"
            >
              <span className="font-wipeout3" aria-hidden="true">
                &#xe006;
              </span>{" "}
              Home
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

/** Not-found page shown when no route matches (404). */
export default Page404;
