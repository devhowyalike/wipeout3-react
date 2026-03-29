import { useState, useEffect } from "react";
import { useOptions } from "@/hooks/useOptions";
import { Modal } from "@/components/Modal";
import { Wallpaper, SelectedWallpaper } from "./Wallpaper.types";
import { wallpapers, resolution } from "./wallpaperData";

/** Wallpaper resolutions grid with preview modal. */
const WallpaperTable = () => {
  const { xsText, modal: modalEnabled } = useOptions();
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<SelectedWallpaper | null>(null);
  const [modalDimensions, setModalDimensions] = useState({
    width: 0,
    height: 0,
  });

  const textSizeClass = xsText
    ? "text-w3-sm leading-[15px]"
    : "text-w3-sm leading-[15px] md:text-xs md:leading-4";

  const gridSizeClass = xsText
    ? "grid-cols-[150px_1fr_1fr]"
    : "grid-cols-[150px_1fr_1fr] md:grid-cols-[170px_1fr_1fr]";

  const modalClass = modalEnabled
    ? "absolute inset-0 w-full h-full object-contain"
    : "";

  const handleWallpaperClick = (wallpaper: Wallpaper, size: string) => {
    setSelectedWallpaper({
      url: wallpaper.sizes[size],
      size,
      name: wallpaper.name,
    });
    updateModalDimensions(size);
  };

  const handleCloseModal = () => {
    // Reset the selected wallpaper when the modal closes
    setSelectedWallpaper(null);
  };

  const updateModalDimensions = (size: string) => {
    const [width, height] = size.split(" x ").map((dim) => parseInt(dim, 10));
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Calculate max dimensions that fit in the viewport
    // Leave some padding for margins
    const maxHeight = windowHeight * 0.9;
    const maxWidth = windowWidth * 0.9;

    const aspectRatio = width / height;

    let finalWidth = width;
    let finalHeight = height;

    // Scale if larger than viewport
    if (height > maxHeight) {
      finalHeight = maxHeight;
      finalWidth = maxHeight * aspectRatio;
    }

    if (finalWidth > maxWidth) {
      finalWidth = maxWidth;
      finalHeight = maxWidth / aspectRatio;
    }

    setModalDimensions({
      width: Math.floor(finalWidth),
      height: Math.floor(finalHeight),
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (selectedWallpaper) {
        updateModalDimensions(selectedWallpaper.size);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedWallpaper]);

  return (
    <div>
      <div
        className={`grid ${gridSizeClass} mb-5 md:mb-2 font-bold ${textSizeClass}`}
      >
        <div>W3PAPER</div>
        <div className="hidden md:block">RES.01</div>
        <div>RES.02</div>
      </div>
      <div className="space-y-3 md:space-y-0">
        {wallpapers.map((wallpaper, index) => (
          <div key={index} className={`grid ${gridSizeClass}`}>
            <div className={`uppercase font-bold ${textSizeClass}`}>
              {wallpaper.name}
            </div>
            <button
              onClick={() => handleWallpaperClick(wallpaper, resolution.res1)}
              className={`text-accent-primary font-bold ${textSizeClass} text-left active:text-white hover:text-accent-primary-hover hidden md:block`}
            >
              {resolution.res1}
            </button>
            <button
              onClick={() => handleWallpaperClick(wallpaper, resolution.res2)}
              className={`text-accent-primary font-bold ${textSizeClass} text-left active:text-white hover:text-accent-primary-hover`}
            >
              {resolution.res2}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className={`uppercase font-bold ${textSizeClass}`}>
          P.C. Operators: Open image then right-click & select
          "Set&nbsp;as&nbsp;wallpaper"
        </div>
      </div>
      {selectedWallpaper && (
        <Modal {...modalDimensions} onClose={handleCloseModal}>
          <div className="h-full flex flex-col">
            {modalEnabled && (
              <h2
                className={`text-center font-bold uppercase ${textSizeClass} mb-4 text-accent-primary`}
              >
                {selectedWallpaper.name} - {selectedWallpaper.size}
              </h2>
            )}
            <div className="flex-1 relative">
              <img
                src={selectedWallpaper.url}
                alt={`${selectedWallpaper.name} wallpaper`}
                className={modalClass}
                decoding="async"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WallpaperTable;
