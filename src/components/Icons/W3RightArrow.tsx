type Size = "sm" | "md" | "lg";

interface W3RightArrowProps {
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "text-4xl",
  md: "text-6xl",
  lg: "text-[150px]",
};

const W3RightArrow = ({ size = "lg" }: W3RightArrowProps) => {
  return (
    <span
      className={`font-wipeout3 theme-text ${sizeClasses[size]} leading-none`}
    >
      &#xe002;
    </span>
  );
};

/**
 * Theme-colored right arrow using the Wipeout3 icon font glyph (`\\uE002`) at a chosen scale.
 */
export default W3RightArrow;
