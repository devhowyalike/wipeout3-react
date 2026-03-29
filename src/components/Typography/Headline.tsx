import { ReactNode, ButtonHTMLAttributes, ElementType } from "react";
import { remapLNode } from "@/utils/remapFontChars";
import { useOptions } from "@/hooks/useOptions";

type HeadlineVariant = "md" | "lg" | "xl" | "xxl" | "bodyCopy";

type HeadlineProps = {
  children: ReactNode;
  variant?: HeadlineVariant;
  className?: string;
  level?: 1 | 2 | 3;
  bold?: boolean;
  as?: "button";
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof {
    children: ReactNode;
    className: string;
  }
>;

function getVariantStyles(variant: HeadlineVariant, xsText: boolean): string {
  if (variant === "bodyCopy") {
    return `uppercase ${xsText ? "text-w3-sm leading-[15px]" : "text-sm"} text-body`;
  }
  const map = {
    md: "text-w3-fluid-md",
    lg: "text-w3-fluid-lg",
    xl: "text-w3-fluid-xl",
    xxl: "text-w3-fluid-xxl",
  } as const;
  return map[variant];
}

/**
 * Themed heading or button-as-heading with optional `remapL` for Wipeout-style “L” glyph substitution.
 * Maps `level` to `h1`–`h3` (or `as="button"`) and applies fluid variant classes from options.
 */
export const Headline = ({
  children,
  className = "",
  variant = "xl",
  level = 1,
  bold = false,
  as,
  ...props
}: HeadlineProps) => {
  const { xsText, remapL: remapLEnabled } = useOptions();
  const Component = (as || `h${level}`) as ElementType;
  const headingColorClass =
    level === 3
      ? "text-heading-3"
      : level === 2
      ? "text-heading-2"
      : "text-heading-1";

  const baseStyles =
    variant === "bodyCopy"
      ? ""
      : "font-wipeout3 lowercase tracking-[.01em] leading-[.875]";

  const boldClass = bold ? "font-bold" : "";

  const combinedProps = as === "button" ? props : {};

  return (
    <Component
      className={`${baseStyles} ${getVariantStyles(variant, xsText)} ${boldClass} ${headingColorClass} ${className}`}
      {...combinedProps}
    >
      {variant === "bodyCopy" ? children : remapLNode(children, remapLEnabled)}
    </Component>
  );
};
