import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "./useEscapeKey";
import {
  type AppOptions,
  type OptionKey,
  OPTION_LABELS,
  MODE_DESCRIPTIONS,
  DEFAULT_OPTIONS,
  PURE_MODE_OPTION_OVERRIDES,
  REACT_MODE_OPTION_OVERRIDES,
  detectMode,
  saveOptions,
} from "@/config/options";
import { safeLocalStorage } from "./settings/safeLocalStorage";
import { useSettingsScroll } from "./settings/useSettingsScroll";
import { OptionsAccordion } from "./settings/OptionsAccordion";
import { ModesAccordion } from "./settings/ModesAccordion";
import { DiscardConfirmOverlay } from "./settings/DiscardConfirmOverlay";

interface SettingsModalProps {
  options: AppOptions;
  onClose: () => void;
}

const OPTION_KEYS = Object.keys(OPTION_LABELS) as OptionKey[];
const ALL_OPTION_VALUES = [...OPTION_KEYS];
const ALL_MODE_VALUES = Object.keys(MODE_DESCRIPTIONS);
const SCROLL_AREA_FALLBACK_HEIGHT = "70dvh";

/**
 * Full-screen options editor in a portal: toggles, Pure/React mode accordions,
 * apply/reload, and discard confirmation when closing with unsaved changes.
 */
export default function SettingsModal({
  options,
  onClose,
}: SettingsModalProps) {
  const [draft, setDraft] = useState<AppOptions>({ ...options });
  // Mode descriptions (Pure / React Mode) are expanded by default
  // to surface them on first visit. Overridden by the user's preference.
  const [openItems, setOpenItems] = useState<string[]>(() =>
    safeLocalStorage("get", "wipeout3-show-descriptions") === "true"
      ? ALL_OPTION_VALUES
      : [],
  );
  const [openModeItems, setOpenModeItems] = useState<string[]>(() =>
    safeLocalStorage("get", "wipeout3-show-descriptions") === "false"
      ? []
      : ALL_MODE_VALUES,
  );
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const hasChanges = (Object.keys(draft) as (keyof AppOptions)[]).some(
    (k) => draft[k] !== options[k],
  );

  const allExpanded =
    openItems.length === ALL_OPTION_VALUES.length &&
    openModeItems.length === ALL_MODE_VALUES.length;

  const {
    headerRef,
    scrollContainerRef,
    scrollContentRef,
    footerRef,
    scrollbarMetrics,
    modalMaxHeight,
    scrollAreaMaxHeight,
  } = useSettingsScroll(openItems, openModeItems);

  const handleRequestClose = useCallback(() => {
    if (confirmingDiscard) {
      setConfirmingDiscard(false);
      return;
    }
    if (hasChanges) {
      setConfirmingDiscard(true);
      return;
    }
    onClose();
  }, [confirmingDiscard, hasChanges, onClose]);

  useEscapeKey(handleRequestClose);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleToggle = (key: OptionKey) => {
    setDraft((prev) => {
      const next: AppOptions = {
        ...prev,
        pureMode: false,
        reactMode: false,
        [key]: !prev[key],
      };
      const detected = detectMode(next);
      if (detected === "pure") return { ...next, pureMode: true };
      if (detected === "react") return { ...next, reactMode: true };
      return next;
    });
  };

  const handlePureModeToggle = () => {
    setDraft((prev) => {
      if (prev.pureMode) {
        const reset = { ...DEFAULT_OPTIONS, pureMode: false, reactMode: false };
        const detected = detectMode(reset);
        if (detected === "react") return { ...reset, reactMode: true };
        return reset;
      }
      return {
        ...prev,
        ...PURE_MODE_OPTION_OVERRIDES,
        pureMode: true,
        reactMode: false,
      };
    });
  };

  const handleReactModeToggle = () => {
    setDraft((prev) => {
      if (prev.reactMode) {
        const reset = { ...DEFAULT_OPTIONS, pureMode: false, reactMode: false };
        const detected = detectMode(reset);
        if (detected === "pure") return { ...reset, pureMode: true };
        return reset;
      }
      return {
        ...prev,
        ...REACT_MODE_OPTION_OVERRIDES,
        reactMode: true,
        pureMode: false,
      };
    });
  };

  const handleApply = () => {
    saveOptions(draft);
    window.location.reload();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleRequestClose();
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setOpenItems([]);
      setOpenModeItems([]);
      safeLocalStorage("set", "wipeout3-show-descriptions", "false");
    } else {
      setOpenItems(ALL_OPTION_VALUES);
      setOpenModeItems(ALL_MODE_VALUES);
      safeLocalStorage("set", "wipeout3-show-descriptions", "true");
    }
  };

  const modalFrameClass =
    "w3-app-max-width mx-auto relative flex h-full w-full items-center justify-center px-6 py-4";

  return createPortal(
    <div
      className="fixed inset-0 z-40 bg-page"
      onClick={handleOverlayClick}
      data-overlay="true"
      data-theme="sandTheme"
    >
      <div
        className={modalFrameClass}
        onClick={handleOverlayClick}
      >
        <button
          tabIndex={0}
          onClick={handleRequestClose}
          className="absolute top-4 right-6 z-60 cursor-pointer text-nav hover:text-nav-hover font-wipeout3 text-5xl"
          aria-label="Close settings"
        >
          ×
        </button>

        <div
          className="relative w-full max-w-md mx-4 flex flex-col"
          style={{ maxHeight: modalMaxHeight ? `${modalMaxHeight}px` : "90vh" }}
        >
          <div ref={headerRef} className="mb-6 shrink-0">
            <div className="max-w-[340px]">
              <span className="uppercase text-nav font-wipeout3 text-w3-fluid-xl tracking-wide">
                Options
              </span>
            </div>
          </div>

          <div className="relative min-h-0 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="settings-scrollbar pr-6 overflow-x-hidden overflow-y-auto overscroll-contain"
              style={{
                maxHeight: scrollAreaMaxHeight
                  ? `${scrollAreaMaxHeight}px`
                  : SCROLL_AREA_FALLBACK_HEIGHT,
                minHeight: scrollAreaMaxHeight
                  ? `${scrollAreaMaxHeight}px`
                  : SCROLL_AREA_FALLBACK_HEIGHT,
              }}
            >
              <div ref={scrollContentRef}>
                <OptionsAccordion
                  draft={draft}
                  openItems={openItems}
                  onOpenItemsChange={setOpenItems}
                  onToggle={handleToggle}
                  optionKeys={OPTION_KEYS}
                />
                <ModesAccordion
                  draft={draft}
                  openModeItems={openModeItems}
                  onOpenModeItemsChange={setOpenModeItems}
                  onPureModeToggle={handlePureModeToggle}
                  onReactModeToggle={handleReactModeToggle}
                />
              </div>
            </div>

            {scrollbarMetrics.visible && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-2 bg-white/30"
              >
                <div
                  className="absolute inset-x-0 bg-white"
                  style={{
                    height: `${scrollbarMetrics.thumbHeight}px`,
                    transform: `translateY(${scrollbarMetrics.thumbOffset}px)`,
                  }}
                />
              </div>
            )}
          </div>

          <div ref={footerRef} className="mt-4 shrink-0 flex items-end pb-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRequestClose}
                className="angled-corner-sm bg-white/20 hover:bg-white/30 px-6 h-7 uppercase text-xs font-extrabold tracking-wide text-nav cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!hasChanges}
                className="angled-corner-sm px-6 h-7 uppercase text-xs font-extrabold tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-accent-primary hover:bg-accent-primary-hover text-white cursor-pointer"
              >
                Apply
              </button>
            </div>
            <div className="flex-1 flex items-center justify-start">
              <span className="text-white/20 font-bold pl-2">|</span>
            </div>
            <button
              type="button"
              onClick={handleToggleAll}
              className="w-[148px] text-right uppercase text-xs font-extrabold tracking-wide text-white/40 hover:text-white/70 cursor-pointer transition-colors"
            >
              {allExpanded ? "Eject Desc" : "Actv8 Desc"}
            </button>
          </div>

          {confirmingDiscard && (
            <DiscardConfirmOverlay
              onDiscard={onClose}
              onEdit={() => setConfirmingDiscard(false)}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
