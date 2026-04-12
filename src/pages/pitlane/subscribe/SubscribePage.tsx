import { useState, FormEvent } from "react";
import Page from "@/components/Page";
import { Headline } from "@/components/Typography/Headline";

/** Mailing list subscribe page. */
export default function SubscribePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuccess(true);
    console.info("Subscription is offline, no data collected.");
  };

  return (
    <Page
      theme="sandTheme"
      documentTitle="Pitlane | Subscribe"
      footerTitle="Subscribe"
      footerSubtitle="Pitlane Select"
    >
      <div role="status" aria-live="polite">
        {showSuccess && (
          <Headline level={1} variant="xl" className="mb-6">
            <span className="text-white">Thankyou.</span>{" "}
            <span className="block">Welcome.</span>
          </Headline>
        )}
      </div>
      {!showSuccess && (
        <>
          <Headline level={1} variant="xl" className="mb-6 subpixel-fix">
            Enter your <span className="block">e-mail address</span>
          </Headline>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              name="email"
              size={47}
              className="text-base rounded-full appearance-none max-w-full scale-75 origin-left bg-white"
            />
            <button
              type="submit"
              className="block text-white font-wipeout3 text-w3-fluid-xl"
            >
              Send
            </button>
          </form>
        </>
      )}
    </Page>
  );
}
