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
  const [settingsModalKey, setSettingsModalKey] = useState(0);

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

  const handleOpenSettings = () => {
    setSettingsModalKey((prev) => prev + 1);
    setIsSettingsOpen(true);
  };

  return (
    <footer
      className={`pt-2 sticky bottom-0 w-full bg-footer text-footer-nav z-10 opacity-0 transition-opacity duration-300 ${
        !isLoading ? "opacity-100" : ""
      }`}
    >
      <div
        className={`w3-app-max-width flex w-full items-end justify-between gap-6 pr-6 ${options.wideCenter ? "mx-auto" : ""}`}
      >
        <nav
          aria-label="Secondary navigation"
          role="navigation"
          className="min-w-0"
        >
          <ul className="flex gap-x-[calc(0.2rem+1px)] gap-y-2">
            <li>
              <div
                aria-label="Version information"
                className="ml-1 uppercase text-[9px] font-extrabold"
              >
                <span aria-hidden="true" className="text-[7px] relative -top-px mr-1">●</span>
                WIPEOUT VER. 03.00.02.
              </div>
              <Link to="/" className="block ml-6">
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
                className="relative uppercase text-[9px] font-extrabold flex pl-1 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                <div className="absolute top-[6px] h-full border-l border-footer-nav left-0"></div>
                {footerTitle || DEFAULT_FOOTER_MENU_TITLE}
              </div>
              <button
                className="group relative -ml-[2px] block cursor-pointer pb-7"
                onClick={handleBackButton}
                aria-label={
                  location.pathname === "/"
                    ? options.psygnosisUrl
                      ? "Visit Psygnosis UK website"
                      : "Visit GitHub repository"
                    : "Go back"
                }
              >
                <span className="relative bottom-[-3px] uppercase text-w3-xs font-extrabold">
                  {location.pathname === "/"
                    ? options.psygnosisUrl
                      ? "PSY/UK"
                      : "GIT/HUB"
                    : footerSubtitle || DEFAULT_FOOTER_MENU_SUBTITLE}
                </span>
                <span className="absolute bottom-0 left-0 block h-7 w-9 angled-corner-sm bg-accent-secondary group-hover:bg-accent-secondary-hover"></span>
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
            onClick={handleOpenSettings}
            onMouseEnter={() => void import("../SettingsModal")}
            onFocus={() => void import("../SettingsModal")}
            type="button"
            aria-label="Open settings"
            className="group inline-flex h-7 w-9 cursor-pointer"
          >
            <span className="h-full w-full inline-flex items-center justify-center angled-corner-sm bg-white/40 group-hover:bg-neutral-100/80 text-neutral-900 transition-colors">
              <SettingsIcon />
            </span>
          </button>
        </div>
      </div>
      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            key={settingsModalKey}
            options={options}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>
      )}
    </footer>
  );
}
