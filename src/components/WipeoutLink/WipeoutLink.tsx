import {
  ReactNode,
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
} from "react";
import { Link, LinkProps, useNavigate } from "react-router-dom";
import { useUISounds } from "@/hooks/useUISounds";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useOptions } from "@/hooks/useOptions";
import { soundManager } from "@/utils/soundManager";
import { animations, AnimationId } from "./animations";
import { HoverAnimation } from "./HoverAnimation";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type WipeoutLinkBaseProps = {
  children: ReactNode;
  className?: string;
  animation?: AnimationId;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
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
 * Navigation link (or button) with optional hover animation clips and UI sounds.
 *
 * Touch behaviour has two modes:
 * 1. **Wait-for-animation** (default) — tap plays the animation, navigates when it ends. A second tap skips to navigate immediately.
 * 2. **Immediate** (`disableHoverAnimations` option or `prefers-reduced-motion`) — tap navigates instantly; no animation is loaded.
 */
export const WipeoutLink: FC<WipeoutLinkProps> = ({
  as = "link",
  children,
  className,
  animation,
  onClick,
  ...props
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isWaitingForAnimation, setIsWaitingForAnimation] = useState(false);
  const touchOriginatedRef = useRef(false);
  const pendingNavRef = useRef<(() => void) | null>(null);
  // Always-current refs so the deferred callback reads the latest props rather
  // than a closure snapshot captured at tap time.
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;
  const toRef = useRef<string | undefined>(
    as === "link" ? (props.to as string) : undefined
  );
  toRef.current = as === "link" ? (props.to as string) : undefined;
  const animationData = animation ? animations[animation] : undefined;
  const reducedMotion = useReducedMotion();
  const { disableHoverAnimations } = useOptions();
  const navigate = useNavigate();

  const { playHoverSound, playClickSound } = useUISounds();

  const activeStyle = { color: "var(--color-nav-hover)" } as const;

  const handleHover = () => {
    if (touchOriginatedRef.current) return;
    playHoverSound();
    if (disableHoverAnimations) return;
    setShowAnimation(true);
  };

  const handleMouseLeave = () => {
    if (pendingNavRef.current) return;
    setShowAnimation(false);
  };

  const handleTouchStart = () => {
    touchOriginatedRef.current = true;
  };

  const handleAnimationEnded = useCallback(() => {
    setIsWaitingForAnimation(false);
    setShowAnimation(false);
    pendingNavRef.current?.();
    pendingNavRef.current = null;
  }, []);

  // When disableHoverAnimations is toggled on while the animation is mid-play,
  // HoverAnimation returns null and unmounts the <video> without firing onEnded.
  // Flush the pending navigation here so the component doesn't stay stuck.
  useEffect(() => {
    if (disableHoverAnimations && pendingNavRef.current) {
      setIsWaitingForAnimation(false);
      setShowAnimation(false);
      const nav = pendingNavRef.current;
      pendingNavRef.current = null;
      nav();
    }
  }, [disableHoverAnimations]);

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    // Early exit — second tap while animation is mid-play: navigate immediately
    if (isWaitingForAnimation && pendingNavRef.current) {
      e.preventDefault();
      setIsWaitingForAnimation(false);
      setShowAnimation(false);
      const nav = pendingNavRef.current;
      pendingNavRef.current = null;
      nav();
      return;
    }

    // Branch 1 — Wait-for-animation (default touch mode when animations are enabled)
    if (
      touchOriginatedRef.current &&
      !reducedMotion &&
      !disableHoverAnimations &&
      animationData
    ) {
      touchOriginatedRef.current = false;
      e.preventDefault();
      setIsWaitingForAnimation(true);
      pendingNavRef.current = () => {
        playClickSound();
        soundManager.lockForNavigation();
        if (toRef.current) navigate(toRef.current);
        onClickRef.current?.(e);
      };
      playHoverSound();
      setShowAnimation(true);
      return;
    }

    // Branch 2 — Immediate (desktop click, disabled animations, reduced motion, or no animation data)
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
      className="inline-block text-w3-fluid-xl"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <HoverAnimation
        animationData={disableHoverAnimations ? undefined : animationData}
        isVisible={showAnimation}
        onEnded={handleAnimationEnded}
      />
      {as === "link" ? (
        <Link
          {...(props as LinkProps)}
          to={props.to as string}
          className={className}
          style={isWaitingForAnimation ? activeStyle : undefined}
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
          style={isWaitingForAnimation ? activeStyle : undefined}
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
