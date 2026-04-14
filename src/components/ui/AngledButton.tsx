import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface AngledButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  variant: "primary" | "secondary";
  size?: "sm" | "lg";
  children: ReactNode;
}

const VARIANT_CLASSES = {
  secondary: "bg-white/20 group-hover:bg-white/30 text-nav",
  primary: "bg-accent-primary group-hover:bg-accent-primary-hover text-white",
} as const;

const SIZE_CLASSES = {
  sm: {
    button: "h-7",
    span: "angled-corner-sm px-6 text-xs font-extrabold tracking-wide",
  },
  lg: {
    button: "h-12",
    span: "angled-corner-btn-lg px-10 text-lg font-wipeout3",
  },
} as const;

/** Angled-corner action button with primary/secondary variants and sm/lg sizes. */
export function AngledButton({
  variant,
  size = "sm",
  type = "button",
  children,
  className,
  ...buttonProps
}: AngledButtonProps) {
  const sizeClasses = SIZE_CLASSES[size];
  return (
    <button
      type={type}
      className={[
        "group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none pointer-fine:focus-visible:ring-2 pointer-fine:focus-visible:ring-white/70 pointer-fine:focus-visible:ring-offset-2 pointer-fine:focus-visible:ring-offset-page",
        sizeClasses.button,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...buttonProps}
    >
      <span
        className={`h-full inline-flex items-center uppercase tracking-wide transition-colors ${sizeClasses.span} ${VARIANT_CLASSES[variant]}`}
      >
        {children}
      </span>
    </button>
  );
}
