import { useState } from "react";

/** Exposes footer visibility state and a setter so layouts can hide or show the footer. */
export function useFooterHidden() {
  const [isFooterHidden, setFooterHidden] = useState(false);
  return { isFooterHidden, setFooterHidden };
}