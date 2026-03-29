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
import rawScreenshotsData from "./data/screenshots.json";

// Type assertion for imported data
const screenshotsData: { screenshots: BaseScreenshotSet[] } =
  rawScreenshotsData;

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

  // Refs for touch handling
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Swipe hint + live drag direction feedback
  // (pointer: coarse) is true on touch-primary devices (phones/tablets), false on mouse/trackpad
  // provides a visual hint  that swipe gestures are supported
  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );
  const hasSwipedRef = useRef(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"prev" | "next" | null>(
    null,
  );

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

  // Touch Event Handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
    hasSwipedRef.current = true;
    setShowSwipeHint(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
    if (touchStartXRef.current !== null) {
      const delta = e.touches[0].clientX - touchStartXRef.current;
      if (Math.abs(delta) > 8) {
        setSwipeDirection(delta > 0 ? "prev" : "next");
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) {
      setSwipeDirection(null);
      return;
    }

    const swipeDistance = touchEndXRef.current - touchStartXRef.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) >= minSwipeDistance) {
      if (swipeDistance > 0) {
        handleNavigation("prev");
      } else {
        handleNavigation("next");
      }
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setSwipeDirection(null);
  };

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

  const currentScreenId = currentScreen?.id;

  // Show swipe hint whenever user opens a screenshot set (touch devices only, not during active swiping)
  useEffect(() => {
    if (
      currentScreenId == null ||
      !isTouchDevice.current ||
      hasSwipedRef.current ||
      !swipeHints
    )
      return;
    setShowSwipeHint(true);
    const timer = setTimeout(() => setShowSwipeHint(false), 2500);
    return () => clearTimeout(timer);
  }, [currentScreenId, swipeHints]);

  // Determine if any navigation action is active
  const isAnyNavigationActive = () => {
    return (
      uiState.prevHovered ||
      uiState.nextHovered ||
      uiState.prevKeyActive ||
      uiState.nextKeyActive ||
      swipeDirection !== null
    );
  };

  // Get title card image
  const getTitleCardImage = (id: string) => {
    const image = titleCardMap[id as keyof typeof titleCardMap];
    if (!image) {
      console.error(`Title card image not found for id: ${id}`);
    }
    return image;
  };

  // Get counter image
  const getCounterImage = (index: number) => {
    const paddedIndex = String(index).padStart(2, "0");
    const key = `counter${paddedIndex}`;

    // Use type assertion to check if the key exists in uiMap
    if (key in uiMap) {
      return uiMap[key as keyof typeof uiMap];
    }

    // Return a default counter if the specific one doesn't exist
    return index <= 9 ? uiMap.counter01 : uiMap.counter12;
  };

  // Get UI nav image based on state
  const getNavImage = () => {
    if (
      uiState.prevHovered ||
      uiState.prevKeyActive ||
      swipeDirection === "prev"
    ) {
      return uiMap.prev;
    } else if (
      uiState.nextHovered ||
      uiState.nextKeyActive ||
      swipeDirection === "next"
    ) {
      return uiMap.next;
    } else if (uiState.menuHovered) {
      return uiMap.menu_on;
    } else {
      return uiMap.menu_off;
    }
  };

  // Main menu view
  if (!currentScreen) {
    return (
      <div className="bg-screenshot space-y-[3px]">
        {screenshotsData.screenshots.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleSelectScreen(item, index)}
            className="cursor-pointer"
          >
            <img
              src={getTitleCardImage(item.titleCard)}
              alt={item.name}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    );
  }

  // Screenshot viewer
  return (
    <div ref={galleryRef}>
      <div onClick={handleBackToMenu} className="cursor-pointer">
        <img
          src={getTitleCardImage(currentScreen.titleCard)}
          alt={`${currentScreen.name} title card`}
        />
      </div>

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
            src={isAnyNavigationActive() ? uiMap.arrow_up : uiMap.arrow_down}
            alt={isAnyNavigationActive() ? "Up arrow" : "Down arrow"}
          />
        </div>
        <div>
          <div className="flex flex-col">
            <div className="flex">
              <button
                className="cursor-pointer"
                onClick={handlePrevClick}
                onMouseEnter={() => handlePrevHover(true)}
                onMouseLeave={() => handlePrevHover(false)}
              >
                <img
                  src={
                    uiState.prevHovered ||
                    uiState.prevKeyActive ||
                    swipeDirection === "prev"
                      ? uiMap.ltab_on
                      : uiMap.ltab_off
                  }
                  alt="Previous"
                />
              </button>
              <button
                className="cursor-pointer"
                onClick={handleNextClick}
                onMouseEnter={() => handleNextHover(true)}
                onMouseLeave={() => handleNextHover(false)}
              >
                <img
                  src={
                    uiState.nextHovered ||
                    uiState.nextKeyActive ||
                    swipeDirection === "next"
                      ? uiMap.rtab_on
                      : uiMap.rtab_off
                  }
                  alt="Next"
                />
              </button>
            </div>
            <button
              onClick={handleBackToMenu}
              onMouseEnter={() => handleMenuHover(true)}
              onMouseLeave={() => handleMenuHover(false)}
            >
              <img
                src={getNavImage()}
                alt={
                  uiState.prevHovered || uiState.prevKeyActive
                    ? "Previous"
                    : uiState.nextHovered || uiState.nextKeyActive
                      ? "Next"
                      : "Menu"
                }
              />
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
