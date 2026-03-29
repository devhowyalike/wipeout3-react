import { MenuItem, MenuProps } from "@/types/Menu.types";
import { WipeoutLink } from "../WipeoutLink/WipeoutLink";
import { prefetchRoute } from "@/utils/prefetchRoute";
import { remapL } from "@/utils/remapFontChars";
import { useOptions } from "@/hooks/useOptions";
import { useState, cloneElement, isValidElement, useEffect, useRef } from "react";

/**
 * Primary navigation: {@link WipeoutLink} items, optional route prefetch, modal content with history.
 * Pushes a synthetic history entry when a modal opens so the back button closes it first.
 */
export default function Menu({ items, prefetch = true, touchHover = true }: MenuProps) {
  // Aliased to avoid shadowing the remapL utility function import
  const { remapL: remapLEnabled } = useOptions();
  const [currentModalContent, setCurrentModalContent] =
    useState<React.ReactNode | null>(null);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  // Tracks whether we pushed a synthetic history entry when a modal opened,
  // so we know whether to pop it on close and whether a popstate event
  // belongs to us rather than genuine page navigation.
  const modalHistoryPushed = useRef(false);

  // Closes the modal and pops the synthetic history entry we pushed when it
  // opened, keeping the browser history stack clean.
  const closeModal = () => {
    setCurrentModalContent(null);
    if (modalHistoryPushed.current) {
      modalHistoryPushed.current = false;
      window.history.back();
    }
  };

  // When a modal is open, intercept the browser back button (popstate) and
  // close the modal instead of navigating away from the current page.
  useEffect(() => {
    if (!currentModalContent) return;

    const handlePopState = () => {
      if (modalHistoryPushed.current) {
        modalHistoryPushed.current = false;
        setCurrentModalContent(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentModalContent]);

  const renderMenuItem = (item: MenuItem) => {
    const commonStyles =
      "text-nav hover:text-nav-hover active:text-nav-hover focus-visible:text-nav-hover transition-colors subpixel-fix font-wipeout3 text-w3-fluid-xl lowercase tracking-[.01em] leading-[.875]";

    // Handle modal/pop-up links
    if (item.modalConfig) {
      return (
        <WipeoutLink
          as="button"
          className={commonStyles}
          animation={item.animation}
          touchHover={touchHover}
          onPreviewStart={() => setActivePreviewId(item.id)}
          isActivePreview={activePreviewId === item.id}
          onClick={() => {
            setActivePreviewId(null);
            setCurrentModalContent(null);
            setTimeout(() => {
              if (
                item.modalConfig?.content &&
                isValidElement(item.modalConfig.content)
              ) {
                const modalElement = item.modalConfig
                  .content as React.ReactElement<{ onClose?: () => void }>;
                const originalOnClose = modalElement.props.onClose;
                const enhancedModal = cloneElement(modalElement, {
                  onClose: () => {
                    originalOnClose?.();
                    closeModal();
                  },
                });
                // Push a synthetic history entry (same URL) so the browser
                // back button has somewhere to land before leaving this page.
                window.history.pushState({ modal: true }, "");
                modalHistoryPushed.current = true;
                setCurrentModalContent(enhancedModal);
              }
            }, 0);
          }}
        >
          {remapL(item.label, remapLEnabled)}
        </WipeoutLink>
      );
    }

    // Handle undefined paths
    if (!item.path) {
      return (
        <span className={commonStyles} tabIndex={0}>
          {remapL(item.label, remapLEnabled)}
        </span>
      );
    }

    // Handle mailto and regular navigation links
    return (
      <WipeoutLink
        to={item.path}
        className={commonStyles}
        animation={item.animation}
        touchHover={touchHover}
        onPreviewStart={() => setActivePreviewId(item.id)}
        isActivePreview={activePreviewId === item.id}
      >
        {remapL(item.label, remapLEnabled)}
      </WipeoutLink>
    );
  };

  return (
    <>
      <nav role="navigation">
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              // Prefetch the lazy chunk on hover/touch for any item that has
              // loadable content: page routes (item.path) AND modal routes
              // (item.modalConfig) which have path:"" but still carry a lazy
              // import. MailtoDef items pass the guard via their truthy
              // "mailto:..." path but are harmlessly ignored by prefetchRoute
              // (not in prefetchMap). Do NOT simplify to just `prefetch &&`
              // without a content check — that would attach handlers to items
              // with nothing to prefetch.
              {...(prefetch &&
                (item.path || item.modalConfig) && {
                  onMouseEnter: () => prefetchRoute(item.id),
                  onTouchStart: () => prefetchRoute(item.id),
                })}
            >
              {renderMenuItem(item)}
            </li>
          ))}
        </ul>
      </nav>
      {currentModalContent}
    </>
  );
}
