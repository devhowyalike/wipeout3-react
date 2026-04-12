import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface AngledButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  variant: "primary" | "secondary";
  children: ReactNode;
}

const VARIANT_CLASSES = {
  secondary: "bg-white/20 group-hover:bg-white/30 text-nav",
  primary: "bg-accent-primary group-hover:bg-accent-primary-hover text-white",
} as const;

/** Compact angled-corner action button with primary (accent) and secondary (muted) variants. */
export function AngledButton({
  variant,
  type = "button",
  children,
  className,
  ...buttonProps
}: AngledButtonProps) {
  return (
    <button
      type={type}
      className={[
        "group h-7 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...buttonProps}
    >
      <span
        className={`h-full inline-flex items-center angled-corner-sm px-6 uppercase text-xs font-extrabold tracking-wide transition-colors ${VARIANT_CLASSES[variant]}`}
      >
        {children}
      </span>
    </button>
  );
}
