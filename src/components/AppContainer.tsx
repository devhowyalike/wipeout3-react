import { ReactNode } from "react";

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Top-level container element that wraps all page content.
 */
export default function AppContainer({
  children,
  className = "",
}: AppContainerProps) {
  return <div className={className}>{children}</div>;
}
