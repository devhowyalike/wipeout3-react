import React from "react";
import { useOptions } from "@/hooks/useOptions";

interface BorderedTableProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Framed content block with labeled top border and vertical side rules.
 * Title sits inline on the top rule; children render in the padded body.
 */
export const BorderedTable: React.FC<BorderedTableProps> = ({
  title,
  children,
  className = "",
}) => {
  const { xsText } = useOptions();

  return (
    <div>
      <div
        className={`
          relative
          pl-4
          pr-4
          max-w-[550px]
          ${className}
        `}
      >
        {/* Left vertical border */}
        <div className="absolute top-0 left-0 w-px h-full border border-table"></div>

        {/* Right vertical border */}
        <div className="absolute top-0 right-0 w-px h-3 border border-table"></div>

        {/* Top border with inline text */}
        <div className="absolute top-0 left-0 right-0 flex items-center h-px border border-table">
          <div className="h-full w-4"></div>
          <span
            className={`${xsText ? "text-w3-xs font-bold" : "text-w3-xs sm:text-xs"} uppercase tracking-wider text-border-label bg-page px-2 ml-[-9px]`}
          >
            {title}
          </span>
          <div className="h-full flex-1"></div>
        </div>

        {/* Content */}
        <div className="pt-3 space-y-4">{children}</div>
      </div>
    </div>
  );
};
