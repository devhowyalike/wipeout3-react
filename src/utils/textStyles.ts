/**
 * Body text Tailwind classes: compact legacy sizing when `xsText` is true, standard
 * `text-sm` otherwise.
 *
 * @param xsText - Whether the legacy small-text mode is active.
 */
export function bodyTextClass(xsText: boolean): string {
  return xsText
    ? "text-w3-sm leading-[14px] font-bold"
    : "text-sm leading-5";
}
