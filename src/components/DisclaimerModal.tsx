import { useState } from "react";
import { createPortal } from "react-dom";
import { safeLocalStorage } from "@/components/settings/safeLocalStorage";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const STORAGE_KEY = "wipeout3-disclaimer-seen";

let dismissedThisSession = false;

export function DisclaimerModal() {
  const [visible, setVisible] = useState(
    () =>
      !dismissedThisSession && safeLocalStorage("get", STORAGE_KEY) !== "true",
  );

  useBodyScrollLock(visible);

  if (!visible) return null;

  const handleClose = () => {
    dismissedThisSession = true;
    safeLocalStorage("set", STORAGE_KEY, "true");
    setVisible(false);
  };

  return createPortal(
    <div
      data-theme="sandTheme"
      className="fixed inset-0 z-50 bg-page/95 overflow-auto flex items-center justify-center px-6 py-8"
    >
      <div className="max-w-2xl w-full text-center space-y-6 my-auto">
        <p className="font-wipeout3 text-white text-w3-fluid-xl uppercase tracking-wide whitespace-nowrap subpixel-fix">
          Wip3out R3act
        </p>

        <h1 className="font-wipeout3 text-white text-w3-fluid-lg uppercase tracking-wide subpixel-fix">
          Preservation Project
        </h1>

        <p className="font-vt323 text-body text-base leading-6 uppercase text-pretty sm:max-w-md md:max-w-sm mx-auto">
          An unofficial fan-made preservation of the original Wipeout 3 Flash
          promotional site, rebuilt in JavaScript using React and modern web
          technologies.
        </p>

        <p className="font-vt323 text-body text-base leading-6 uppercase sm:max-w-md md:max-w-sm mx-auto">
          Not affiliated with Sony Interactive Entertainment, The Designers
          Republic, Kleber, or Psygnosis. All trademarks belong to their
          respective owners.
        </p>

        <button
          onClick={handleClose}
          className="font-wipeout3 text-lg uppercase px-8 py-2 bg-accent-primary text-page hover:bg-accent-primary-hover transition-colors cursor-pointer"
        >
          I Understand<span className="animate-w3-blink">_</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
