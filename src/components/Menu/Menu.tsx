import { MenuItem, MenuProps } from "@/types/Menu.types";
import { WipeoutLink } from "../WipeoutLink/WipeoutLink";
import { prefetchRoute } from "@/utils/prefetchRoute";
import { remapL } from "@/utils/remapFontChars";
import { useOptions } from "@/hooks/useOptions";
import { useModalHistory } from "@/hooks/useModalHistory";
import {
  useState,
  cloneElement,
  isValidElement,
  useCallback,
  Suspense,
} from "react";

type ModalElementProps = { onClose?: () => void; children?: React.ReactNode };

function injectModalOnClose(
  element: React.ReactElement<ModalElementProps>,
  onClose: () => void,
) {
  if (
    element.type === Suspense &&
    isValidElement<ModalElementProps>(element.props.children)
  ) {
    return cloneElement(element, {
      children: cloneElement(element.props.children, { onClose }),
    });
  }

  return cloneElement(element, { onClose });
}

/**
 * Primary navigation: {@link WipeoutLink} items, optional route prefetch, modal content with history.
 */
export default function Menu({ items, prefetch = true }: MenuProps) {
  const { remapL: remapLEnabled } = useOptions();
  const [currentModalContent, setCurrentModalContent] =
    useState<React.ReactNode | null>(null);

  const closeModal = useCallback(() => {
    setCurrentModalContent(null);
  }, []);

  const { prepareOpen, requestClose } = useModalHistory({
    isOpen: currentModalContent !== null,
    onClose: closeModal,
  });

  const renderMenuItem = (item: MenuItem) => {
    const commonStyles =
      "text-nav hover:text-nav-hover active:text-nav-hover focus-visible:text-nav-hover transition-colors subpixel-fix font-wipeout3 text-w3-fluid-xl lowercase tracking-[.01em] leading-[.875]";

    if (item.modalConfig) {
      return (
        <WipeoutLink
          as="button"
          className={commonStyles}
          animation={item.animation}
          onClick={(event) => {
            const trigger =
              event.currentTarget instanceof HTMLElement
                ? event.currentTarget
                : null;
            setCurrentModalContent(null);
            setTimeout(() => {
              if (
                item.modalConfig?.content &&
                isValidElement(item.modalConfig.content)
              ) {
                const modalElement = item.modalConfig
                  .content as React.ReactElement<{ onClose?: () => void }>;
                const enhancedOnClose = () => {
                  modalElement.props.onClose?.();
                  requestClose();
                };
                const enhancedModal = injectModalOnClose(
                  modalElement,
                  enhancedOnClose,
                );

                if (trigger) {
                  prepareOpen(trigger);
                }
                setCurrentModalContent(enhancedModal);
              }
            }, 0);
          }}
        >
          {remapL(item.label, remapLEnabled)}
        </WipeoutLink>
      );
    }

    if (!item.path) {
      return (
        <span className={commonStyles} tabIndex={0}>
          {remapL(item.label, remapLEnabled)}
        </span>
      );
    }

    return (
      <WipeoutLink
        to={item.path}
        className={commonStyles}
        animation={item.animation}
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
