import {
  ReactNode,
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
} from "react";
import { Link, LinkProps } from "react-router-dom";
import { useUISounds } from "@/hooks/useUISounds";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { soundManager } from "@/utils/soundManager";
import { animations, AnimationId } from "./animations";
import { HoverAnimation } from "./HoverAnimation";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type WipeoutLinkBaseProps = {
  children: ReactNode;
  className?: string;
  animation?: AnimationId;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /**
   * EXPERIMENTAL — Fundamentally changes the touch UX to a two-tap system.
   *
   * When `true`, the first tap on a touch device shows the hover animation and
   * highlights the link; a second tap on the same item navigates. This is an
   * opinionated departure from the standard tap-to-navigate convention and may
   * surprise users who expect a single tap to follow a link.
   *
   * When `false`, taps navigate immediately and hover animations are not
   * triggered on touch. Defaults to `true`.
   */
  touchHover?: boolean;
  /** Called when this item enters touch-preview mode (first tap). */
  onPreviewStart?: () => void;
  /**
   * Controlled by the parent to coordinate which item is previewing.
   * Set to `false` to force-dismiss this item's preview (e.g. when
   * another item starts previewing).
   */
  isActivePreview?: boolean;
};

type WipeoutLinkAsLink = WipeoutLinkBaseProps & {
  as?: "link";
  to: string;
} & Omit<LinkProps, "to">;

type WipeoutLinkAsButton = WipeoutLinkBaseProps & {
  as: "button";
  to?: never;
} & Omit<ButtonProps, never>;

type WipeoutLinkProps = WipeoutLinkAsLink | WipeoutLinkAsButton;

/**
 * Navigation link (or button) with optional hover animation clips, UI sounds, and a two-tap touch preview mode.
 */
export const WipeoutLink: FC<WipeoutLinkProps> = ({
  as = "link",
  children,
  className,
  animation,
  onClick,
  touchHover = true,
  onPreviewStart,
  isActivePreview,
  ...props
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const linkRef = useRef<HTMLDivElement>(null);
  const touchOriginatedRef = useRef(false);
  const animationData = animation ? animations[animation] : undefined;
  const reducedMotion = useReducedMotion();

  const { playHoverSound, playClickSound } = useUISounds();

  const dismissPreview = useCallback(() => {
    setIsPreviewing(false);
    setShowAnimation(false);
  }, []);

  // Applied on the first tap (touch preview mode) to visually highlight the link,
  // signalling to the user that a second tap is needed to navigate.
  const previewStyle = { color: "var(--color-nav-hover)" } as const;

  // Dismiss when the parent signals another item took over the preview slot
  useEffect(() => {
    if (isActivePreview === false && isPreviewing) {
      dismissPreview();
    }
  }, [isActivePreview, isPreviewing, dismissPreview]);

  // Outside-click and scroll dismissal while previewing
  useEffect(() => {
    if (!isPreviewing) return;

    const handleOutsideClick = (e: globalThis.MouseEvent) => {
      if (linkRef.current && !linkRef.current.contains(e.target as Node)) {
        dismissPreview();
      }
    };

    const handleScroll = () => dismissPreview();

    // Defer registration so we don't catch the tap that started the preview
    const frameId = requestAnimationFrame(() => {
      document.addEventListener("click", handleOutsideClick);
      window.addEventListener("scroll", handleScroll, { passive: true });
    });

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPreviewing, dismissPreview]);

  const handleHover = () => {
    if (isPreviewing) return;
    if (touchOriginatedRef.current && !touchHover) return;
    playHoverSound();
    setShowAnimation(true);
  };

  const handleMouseLeave = () => {
    if (isPreviewing) return;
    setShowAnimation(false);
  };

  const handleTouchStart = () => {
    touchOriginatedRef.current = true;
  };

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    if (touchOriginatedRef.current && touchHover && !reducedMotion) {
      touchOriginatedRef.current = false;

      if (!isPreviewing) {
        e.preventDefault();
        setIsPreviewing(true);
        setShowAnimation(true);
        playHoverSound();
        onPreviewStart?.();
        return;
      }

      // Second tap: navigate / fire action
      dismissPreview();
      playClickSound();
      soundManager.lockForNavigation();
      onClick?.(e);
      return;
    }

    // Desktop click, or touch without animation, or reduced-motion active.
    // Stop any in-progress hover animation immediately rather than letting it
    // run to completion while a modal or new page is already open/loading.
    setShowAnimation(false);
    playClickSound();
    if (touchOriginatedRef.current) {
      touchOriginatedRef.current = false;
      soundManager.lockForNavigation();
    }
    onClick?.(e);
  };

  return (
    <div
      ref={linkRef}
      className="inline-block text-w3-fluid-xl"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <HoverAnimation animationData={animationData} isVisible={showAnimation} />
      {as === "link" ? (
        <Link
          {...(props as LinkProps)}
          to={props.to as string}
          className={className}
          style={isPreviewing ? previewStyle : undefined}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          tabIndex={0}
        >
          {children}
        </Link>
      ) : (
        <button
          {...(props as ButtonProps)}
          className={className}
          style={isPreviewing ? previewStyle : undefined}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          tabIndex={0}
        >
          {children}
        </button>
      )}
    </div>
  );
};
