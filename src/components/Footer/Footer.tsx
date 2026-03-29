import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePage } from "@/hooks/usePage";
import { useOptions } from "@/hooks/useOptions";
import FooterSkeleton from "./FooterSkeleton";
import {
  DEFAULT_FOOTER_MENU_TITLE,
  DEFAULT_FOOTER_MENU_SUBTITLE,
  PSYGNOSIS_URL,
  GITHUB_URL,
} from "@/config/constants";
import { SettingsIcon } from "@/components/Icons/SettingsIcon";

const SoundToggle = lazy(() => import("../SoundToggle"));
const SettingsModal = lazy(() => import("../SettingsModal"));

/** Site footer: secondary nav, back/home action, sound toggle, and settings. */
export default function Footer() {
  const {
    footerTitle,
    footerSubtitle,
    isFooterHidden,
    isLoading = false,
  } = usePage();
  const options = useOptions();
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldLoadSoundToggle, setShouldLoadSoundToggle] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!options.soundToggle) return;

    const timeoutId = window.setTimeout(() => {
      setShouldLoadSoundToggle(true);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [options.soundToggle]);

  if (isFooterHidden) return null;
  if (isLoading) return <FooterSkeleton />;

  const handleBackButton = () => {
    // if on homepage, open website set in options
    if (location.pathname === "/") {
      const url = options.psygnosisUrl ? PSYGNOSIS_URL : GITHUB_URL;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // otherwise go back one page
      navigate(-1);
    }
  };

  return (
    <footer
      className={`pt-2 sticky bottom-0 w-full bg-footer text-footer-nav z-10 opacity-0 transition-opacity duration-300 ${
        !isLoading ? "opacity-100" : ""
      }`}
    >
      <div className={`w3-app-max-width flex w-full items-end justify-between gap-6 pr-6 ${options.wideCenter ? "mx-auto" : ""}`}>
        <nav aria-label="Secondary navigation" role="navigation">
          <ul className="flex gap-x-[calc(0.2rem+1px)] gap-y-2">
            <li>
              <div
                aria-label="Version information"
                className="ml-1 before:content-['●'] before:text-[7px] before:relative before:-top-px before:mr-1 uppercase text-[9px] font-extrabold"
              >
                WIPEOUT VER. 03.00.02.
              </div>
              <Link to="/" className="block ml-6" tabIndex={0}>
                <span
                  aria-label="Wipeout 3 Homepage"
                  className="uppercase text-w3-xs font-extrabold bottom-[-3px] relative"
                >
                  WWW.W3
                </span>
                <span className="h-7 w-[120px] block angled-corner-lg bg-accent-primary hover:bg-accent-primary-hover"></span>
              </Link>
            </li>
            <li className="relative">
              <div
                aria-label="Navigation type"
                className="relative uppercase text-[9px] font-extrabold flex pl-1 whitespace-nowrap"
              >
                <div className="absolute top-[6px] h-full border-l border-footer-nav left-0"></div>
                {footerTitle || DEFAULT_FOOTER_MENU_TITLE}
              </div>
              <button
                className="block cursor-pointer -ml-[2px]"
                tabIndex={0}
                onClick={handleBackButton}
                aria-label={
                  location.pathname === "/"
                    ? options.psygnosisUrl
                      ? "Visit Psygnosis UK website"
                      : "Visit GitHub repository"
                    : "Go back"
                }
              >
                <span className="uppercase text-w3-xs font-extrabold bottom-[-3px] relative">
                  {location.pathname === "/"
                    ? options.psygnosisUrl
                      ? "PSY/UK"
                      : "GIT/HUB"
                    : footerSubtitle || DEFAULT_FOOTER_MENU_SUBTITLE}
                </span>
                <span className="w-9 h-7 block angled-corner-sm bg-accent-secondary hover:bg-accent-secondary-hover absolute bottom-0 left-[-2px]"></span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="flex shrink-0 gap-2 items-center">
          {options.soundToggle && shouldLoadSoundToggle && (
            <Suspense fallback={null}>
              <SoundToggle />
            </Suspense>
          )}
          <button
            onClick={() => setIsSettingsOpen(true)}
            onMouseEnter={() => void import("../SettingsModal")}
            onFocus={() => void import("../SettingsModal")}
            type="button"
            aria-label="Open settings"
            tabIndex={0}
            className="inline-flex h-7 w-9 items-center justify-center angled-corner-sm bg-white/40 text-neutral-900 transition-colors hover:bg-neutral-100/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 cursor-pointer dark:bg-white/40 dark:text-neutral-900 dark:hover:bg-neutral-100/80"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>
      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            options={options}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>
      )}
    </footer>
  );
}
