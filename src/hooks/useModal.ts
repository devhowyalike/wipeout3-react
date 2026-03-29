import { useState, useCallback, useEffect, createElement } from "react"
import ReactDOM from "react-dom/client"
import { BREAKPOINT_LG } from "@/config/constants"
import { useOptions } from "@/hooks/useOptions"
import { OptionsProvider } from "@/providers/OptionsProvider"
import {
  applyPopupBodyStyles,
  copyStylesToPopup,
  createPopupRoot,
} from "@/utils/popupWindow"

function getIsModalEnabled(modalOption: boolean, isPopUp: boolean | undefined, isLargeScreen: boolean) {
  if (isPopUp !== undefined) {
    return !isPopUp || !isLargeScreen
  }

  // When ENV is false, only use modal for small screens
  return !isLargeScreen || modalOption
}

/**
 * Chooses between in-page modal and a separate browser popup from options, breakpoint, and optional
 * `isPopUp` override. When popup mode applies on large screens, `openPopup` renders content in a new window.
 *
 * @param isPopUp - When `true`, forces popup mode on large screens regardless of the user's modal option.
 * @returns `isModalEnabled` flag and an `openPopup` callback for the popup path.
 */
export function useModal(isPopUp?: boolean) {
  const { modal: modalOption } = useOptions()
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => window.innerWidth >= BREAKPOINT_LG
  )
  const [isModalEnabled, setIsModalEnabled] = useState(() =>
    getIsModalEnabled(modalOption, isPopUp, window.innerWidth >= BREAKPOINT_LG)
  )

  useEffect(() => {
    const syncModalMode = () => {
      const largeScreen = window.innerWidth >= BREAKPOINT_LG
      setIsLargeScreen(largeScreen)
      setIsModalEnabled(getIsModalEnabled(modalOption, isPopUp, largeScreen))
    }

    syncModalMode()
    window.addEventListener("resize", syncModalMode)

    return () => window.removeEventListener("resize", syncModalMode)
  }, [isPopUp, modalOption])

  const openPopup = useCallback((width: number, height: number, content: React.ReactNode, onClose?: () => void) => {
    // Only open popup when modal is disabled and screen is large
    if (!isModalEnabled && isLargeScreen) {
      const browserLeft = window.screenLeft ?? window.screenX;
      const browserTop = window.screenTop ?? window.screenY;
      const left = browserLeft + (window.innerWidth - width) / 2;
      const top = browserTop + (window.outerHeight - height) / 2;
      
      // Safari ignores the width/height in the window.open() features string
      // and sizes popups to its own default. Unlike Chromium and Firefox
      // (which treat those values as the inner viewport), Safari's resizeTo()
      // sets the *outer* frame dimensions, so the visible content area is
      // shorter by the height of the title bar (~28px). We detect Safari and
      // pad the height to compensate.
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const safariChrome = isSafari ? 28 : 0;

      const popup = window.open("about:blank", "_blank", `width=${width},height=${height + safariChrome},left=${left},top=${top},scrollbars=no`)

      if (popup) {
        if (isSafari) {
          popup.resizeTo(width, height + safariChrome);
          popup.moveTo(left, top);
        }

        popup.document.title = 'Wipeout 3';
        applyPopupBodyStyles(popup);
        copyStylesToPopup(popup);

        const rootEl = createPopupRoot(popup);
        const root = ReactDOM.createRoot(rootEl);
        root.render(createElement(OptionsProvider, null, content));

        if (onClose) {
          popup.addEventListener('beforeunload', () => {
            onClose();
          });
        }

        return popup;
      }
    }
    
    return null;
  }, [isModalEnabled, isLargeScreen])

  return { isModalEnabled, openPopup }
}
