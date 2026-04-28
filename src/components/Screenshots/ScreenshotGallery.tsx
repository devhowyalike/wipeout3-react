import { useState, useEffect, useRef, useCallback } from "react";
import { titleCardMap } from "./titleCardImports";
import { uiMap } from "./uiImports";
import { useOptions } from "@/hooks/useOptions";
import {
  BaseScreenshotSet,
  Screenshot,
  ScreenshotSet,
  NavigationDirection,
  UIState,
} from "../../types/Screenshot.types";
import { useSwipeGesture, type SwipeDirection } from "./useSwipeGesture";
import rawScreenshotsData from "./data/screenshots.json";

// Type assertion for imported data
const screenshotsData: { screenshots: BaseScreenshotSet[] } =
  rawScreenshotsData;

function getTitleCardImage(id: string) {
  const image = titleCardMap[id as keyof typeof titleCardMap];
  if (!image) {
    console.error(`Title card image not found for id: ${id}`);
  }
  return image;
}

function getCounterImage(index: number) {
  const key = `counter${String(index).padStart(2, "0")}`;
  if (key in uiMap) return uiMap[key as keyof typeof uiMap];
  return index <= 9 ? uiMap.counter01 : uiMap.counter12;
}

function getNavImage(uiState: UIState, swipeDirection: SwipeDirection) {
  if (uiState.prevHovered || uiState.prevKeyActive || swipeDirection === "prev") {
    return uiMap.prev;
  }
  if (uiState.nextHovered || uiState.nextKeyActive || swipeDirection === "next") {
    return uiMap.next;
  }
  if (uiState.menuHovered) return uiMap.menu_on;
  return uiMap.menu_off;
}

function isAnyNavigationActive(uiState: UIState, swipeDirection: SwipeDirection) {
  return (
    uiState.prevHovered ||
    uiState.nextHovered ||
    uiState.prevKeyActive ||
    uiState.nextKeyActive ||
    swipeDirection !== null
  );
}

function generateScreenshots(screen: BaseScreenshotSet): Screenshot[] {
  if (!screen.count) return [];
  return Array.from({ length: screen.count }, (_, i) => ({
    id: i + 1,
    url: `/screenshots/${screen.id}/${String(i + 1).padStart(2, "0")}.jpg`,
  }));
}

const ScreenshotGallery = () => {
  const { swipeHints } = useOptions();
  const [currentScreen, setCurrentScreen] = useState<ScreenshotSet | null>(
    null,
  );
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const galleryRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const viewerHeadingRef = useRef<HTMLSpanElement>(null);
  const shouldFocusViewerRef = useRef(false);
  // Set when navigating back so the useEffect can focus the first menu button.
  const shouldFocusMenuRef = useRef(false);

  // UI state
  const [uiState, setUIState] = useState<UIState>({
    prevHovered: false,
    nextHovered: false,
    menuHovered: false,
    prevKeyActive: false,
    nextKeyActive: false,
  });

  // Handle selecting a screenshot set from the menu
  const handleSelectScreen = useCallback(
    (screen: BaseScreenshotSet, index: number) => {
      const screenWithScreenshots: ScreenshotSet = {
        ...screen,
        screenshots: generateScreenshots(screen),
      };
      setCurrentScreen(screenWithScreenshots);
      setCurrentSectionIndex(index);
      setCurrentScreenIndex(0);
    },
    [],
  );

  // Handle going back to the main menu
  const handleBackToMenu = useCallback(() => {
    // Park focus on the nearest dialog before the currently-focused button
    // unmounts. Without this, the browser moves focus to <body>, which is
    // inert behind the top-layer backdrop, and macOS escalates it to the
    // browser chrome.
    const dialog = galleryRef.current?.closest("dialog");
    if (dialog instanceof HTMLElement) dialog.focus();
    shouldFocusMenuRef.current = true;
    setCurrentScreen(null);
  }, []);

  // Move to next section
  const moveToNextSection = useCallback(() => {
    const nextSectionIndex =
      (currentSectionIndex + 1) % screenshotsData.screenshots.length;
    handleSelectScreen(
      screenshotsData.screenshots[nextSectionIndex],
      nextSectionIndex,
    );
  }, [currentSectionIndex, handleSelectScreen]);

  // Navigate through screenshots
  const handleNavigation = useCallback(
    (direction: NavigationDirection) => {
      if (!currentScreen) return;

      if (direction === "next") {
        if (currentScreenIndex < currentScreen.screenshots.length - 1) {
          // Move to next image in the current section
          setCurrentScreenIndex(currentScreenIndex + 1);
        } else {
          // End of section reached, move to next section
          moveToNextSection();
        }
      } else {
        if (currentScreenIndex > 0) {
          // Move to previous image in the current section
          setCurrentScreenIndex(currentScreenIndex - 1);
        } else {
          // Beginning of section reached, move to previous section's last image
          const prevSectionIndex =
            currentSectionIndex > 0
              ? currentSectionIndex - 1
              : screenshotsData.screenshots.length - 1;
          const prevSection = screenshotsData.screenshots[prevSectionIndex];
          const prevSectionWithScreenshots: ScreenshotSet = {
            ...prevSection,
            screenshots: generateScreenshots(prevSection),
          };

          setCurrentScreen(prevSectionWithScreenshots);
          setCurrentSectionIndex(prevSectionIndex);
          setCurrentScreenIndex(
            prevSectionWithScreenshots.screenshots.length - 1,
          );
        }
      }
    },
    [currentScreen, currentScreenIndex, currentSectionIndex, moveToNextSection],
  );

  // Handlers for UI interactions
  const handlePrevHover = (isHovered: boolean) => {
    setUIState((prev) => ({ ...prev, prevHovered: isHovered }));
  };

  const handleNextHover = (isHovered: boolean) => {
    setUIState((prev) => ({ ...prev, nextHovered: isHovered }));
  };

  const handleMenuHover = (isHovered: boolean) => {
    setUIState((prev) => ({ ...prev, menuHovered: isHovered }));
  };

  const handlePrevClick = () => {
    handleNavigation("prev");
  };

  const handleNextClick = () => {
    handleNavigation("next");
  };

  const { swipeDirection, showSwipeHint, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSwipeGesture({
      onSwipe: handleNavigation,
      hintTrigger: currentScreen?.id ?? null,
      enableHints: swipeHints,
    });

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentScreen) return;

      switch (e.key) {
        case "ArrowRight":
          setUIState((prev) => ({ ...prev, nextKeyActive: true }));
          handleNavigation("next");
          break;
        case "ArrowLeft":
          setUIState((prev) => ({ ...prev, prevKeyActive: true }));
          handleNavigation("prev");
          break;
        case "ArrowUp":
          handleBackToMenu();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setUIState((prev) => ({ ...prev, nextKeyActive: false }));
      } else if (e.key === "ArrowLeft") {
        setUIState((prev) => ({ ...prev, prevKeyActive: false }));
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    currentScreen,
    currentScreenIndex,
    currentSectionIndex,
    handleNavigation,
    handleBackToMenu,
  ]);

  // After returning to the menu, move focus to the first menu button so it
  // stays inside the dialog rather than landing on the dialog container.
  useEffect(() => {
    if (currentScreen !== null || !shouldFocusMenuRef.current) return;
    shouldFocusMenuRef.current = false;

    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 50);

    return () => window.clearTimeout(focusTimer);
  }, [currentScreen]);

  // When entering the viewer from the menu, focus a short status heading so
  // screen reader users hear the current set and item count before the nav
  // controls. Do not do this during next/previous navigation, which should
  // leave focus on the activated control.
  useEffect(() => {
    if (currentScreen === null || !shouldFocusViewerRef.current) return;
    shouldFocusViewerRef.current = false;

    const focusTimer = window.setTimeout(() => {
      viewerHeadingRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(focusTimer);
  }, [currentScreen]);


  // Main menu view
  if (!currentScreen) {
    return (
      <div ref={menuRef} className="bg-screenshot space-y-[3px]">
        {screenshotsData.screenshots.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              shouldFocusViewerRef.current = true;
              handleSelectScreen(item, index);
            }}
            aria-label={`View ${item.name} screenshots`}
            className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
          >
            <img
              src={getTitleCardImage(item.titleCard)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    );
  }

  // Screenshot viewer
  return (
    <div ref={galleryRef}>
      <span ref={viewerHeadingRef} tabIndex={-1} className="sr-only">
        {currentScreen.name} screenshots
      </span>
      <button
        onClick={handleBackToMenu}
        aria-label={`Back to screenshot menu (currently viewing ${currentScreen.name})`}
        className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
      >
        <img
          src={getTitleCardImage(currentScreen.titleCard)}
          alt=""
        />
      </button>

      {/* Screenshot display */}
      <div
        className="relative bg-gray-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentScreen.screenshots.length > 0 ? (
          <img
            src={currentScreen.screenshots[currentScreenIndex].url}
            alt={`${currentScreen.name} screenshot ${currentScreenIndex + 1}`}
            className="w-full touch-manipulation"
            decoding="async"
          />
        ) : (
          <div className="text-white">No screenshots available</div>
        )}

        {swipeHints && (
          <>
            <button
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
              onClick={handlePrevClick}
              aria-label="Previous screenshot"
            />
            <button
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
              onClick={handleNextClick}
              aria-label="Next screenshot"
            />
          </>
        )}

        {showSwipeHint && (
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none animate-swipe-hint">
            <span
              className="text-white text-4xl leading-none animate-swipe-nudge-right text-shadow-dark"
            >
              ‹
            </span>
            <span
              className="text-white text-4xl leading-none animate-swipe-nudge-left text-shadow-dark"
            >
              ›
            </span>
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex flex-nowrap justify-center bg-screenshot">
        <div>
          <img src={uiMap.img} alt="IMG" />
        </div>
        <div>
          <img
            src={getCounterImage(currentScreenIndex + 1)}
            alt={`Counter ${currentScreenIndex + 1}`}
          />
        </div>
        <div>
          <img src={uiMap.of} alt="OF" />
        </div>
        <div>
          <img
            src={getCounterImage(currentScreen.screenshots.length)}
            alt={`Total ${currentScreen.screenshots.length}`}
          />
        </div>
        <div>
          <img
            src={isAnyNavigationActive(uiState, swipeDirection) ? uiMap.arrow_up : uiMap.arrow_down}
            alt={isAnyNavigationActive(uiState, swipeDirection) ? "Up arrow" : "Down arrow"}
          />
        </div>
        <div>
          <div className="flex flex-col">
            <div className="flex">
              <button
                aria-label="Previous screenshot"
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
                onClick={handlePrevClick}
                onMouseEnter={() => handlePrevHover(true)}
                onMouseLeave={() => handlePrevHover(false)}
                onFocus={() => handlePrevHover(true)}
                onBlur={() => handlePrevHover(false)}
              >
                <img
                  src={
                    uiState.prevHovered ||
                    uiState.prevKeyActive ||
                    swipeDirection === "prev"
                      ? uiMap.ltab_on
                      : uiMap.ltab_off
                  }
                  alt=""
                />
              </button>
              <button
                aria-label="Next screenshot"
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
                onClick={handleNextClick}
                onMouseEnter={() => handleNextHover(true)}
                onMouseLeave={() => handleNextHover(false)}
                onFocus={() => handleNextHover(true)}
                onBlur={() => handleNextHover(false)}
              >
                <img
                  src={
                    uiState.nextHovered ||
                    uiState.nextKeyActive ||
                    swipeDirection === "next"
                      ? uiMap.rtab_on
                      : uiMap.rtab_off
                  }
                  alt=""
                />
              </button>
            </div>
            <button
              aria-label="Back to menu"
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
              onClick={handleBackToMenu}
              onMouseEnter={() => handleMenuHover(true)}
              onMouseLeave={() => handleMenuHover(false)}
              onFocus={() => handleMenuHover(true)}
              onBlur={() => handleMenuHover(false)}
            >
              <img src={getNavImage(uiState, swipeDirection)} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Screenshot hub: title-card menu, then a viewer with keyboard, buttons, and touch swipe.
 * Loads image URLs from JSON metadata and optional title-card / UI sprite maps.
 */
export default ScreenshotGallery;
