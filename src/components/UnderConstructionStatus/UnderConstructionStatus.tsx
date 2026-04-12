import type { ReactNode } from "react";
import AngryManIcon from "@/components/Icons/AngryManIcon";
import "./UnderConstructionStatus.css";

const DEFAULT_TITLE = "TEAM PAGE: REACT EDITION";
const DEFAULT_BODY_AFTER = "RETURN FOR FULL ARCHIVE DROP.";
const DEFAULT_BODY =
  "SECTION MARKUP IN PROGRESS. ASSETS STAGED. COPY UNDER REVIEW. ACCOMPANYING GRAPHIC(S) / CHARACTER IN PRODUCTION. SPEED/MOTION STRIPES BEING TESTED. PACKAGING LAYOUT ASSESSED.";

export type UnderConstructionStatusProps = {
  title?: string;
  date?: string;
  statusLine?: string;
  /** Body copy; */
  children?: ReactNode;
  /** Second body paragraph rendered below children. */
  bodyAfter?: ReactNode | null;
};

function DotGrid() {
  return (
    <div
      className="grid grid-cols-[repeat(6,3px)] grid-rows-[repeat(6,3px)] gap-0.5"
      aria-hidden
    >
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} className="w-[3px] h-[3px] bg-[#14110a]" />
      ))}
    </div>
  );
}

function FaxRail() {
  return (
    <aside
      className="flex-none w-[min(100%,11.5rem)] flex flex-col items-end normal-case text-stone-900 max-sm:w-full max-sm:items-stretch"
      aria-hidden
    >
      {/* Desktop-only: */}
      <p className="mb-3 hidden w-full max-w-44 text-[0.6875rem] leading-tight text-right tracking-wide text-stone-800 uppercase sm:block">
        {"<- D3v310pm3n:Docun3n=s — Wip3out (Psygnosis, 1999)"}
      </p>

      <div className="flex w-full flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-x-2 sm:justify-end">
        {/* Row 1 */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 sm:flex sm:flex-col sm:items-end sm:gap-y-1.5">
          {/* Identity */}
          <div className="flex min-w-0 flex-row flex-wrap items-center gap-x-2 gap-y-0.5 justify-self-start sm:flex-col sm:items-end sm:gap-y-1">
            <div className="flex flex-row items-center gap-1.5 shrink-0 sm:items-start">
              <DotGrid />
              <div className="shrink-0 w-8.5 h-8.5 border-2 border-[#14110a] rounded-full flex items-center justify-center">
                <span className="font-sans text-[0.5rem] font-extrabold tracking-tighter leading-none lowercase">
                  tDR
                </span>
              </div>
            </div>
            <p className="m-0 text-[0.5rem] leading-[1.1] tracking-wider text-stone-800 sm:leading-[1.2] sm:text-right sm:max-w-26">
              it&apos;s a republic
            </p>
          </div>

          {/* Mobile-only */}
          <div className="sm:hidden flex flex-col items-end gap-0.5 justify-self-end text-right">
            <span className="text-xs font-normal leading-none tracking-tight">
              VER. 03.01.99.000
            </span>
            <div className="flex flex-row flex-wrap items-baseline justify-end gap-x-1 font-sans text-[0.58rem] font-semibold leading-none tracking-widest uppercase text-stone-900">
              <span>TDR:TM</span>
              <span
                className="font-normal text-stone-800 opacity-70"
                aria-hidden
              >
                ·
              </span>
              <span>PRODUCTS</span>
            </div>
          </div>

          {/* Desktop-only */}
          <div className="hidden sm:flex flex-col items-end gap-1 mt-0.5">
            <span className="text-base font-normal leading-none tracking-tight">
              VER. 03.01.99.000
            </span>
            <div className="flex flex-col items-end gap-px leading-[1.1]">
              <span className="font-sans text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
                TDR:TM
              </span>
              <span className="font-sans text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
                PRODUCTS
              </span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex w-full flex-row items-end justify-between gap-x-2 sm:contents">
          <p className="m-0 min-w-0 flex-1 text-[0.55rem] leading-tight tracking-[0.08em] text-stone-800 uppercase sm:flex-none sm:text-[0.65rem] sm:[writing-mode:vertical-rl] sm:[text-orientation:mixed] sm:leading-normal sm:tracking-[0.18em] sm:whitespace-nowrap sm:self-center sm:pl-0.5">
            Fax from : 01142759127
          </p>
          {/* Mobile-only */}
          <p className="sm:hidden m-0 max-w-[min(100%,11.5rem)] text-[0.625rem] leading-tight text-right tracking-wide text-stone-800 uppercase">
            {"<- D3v310pm3n:Docun3n=s — Wip3out (Psygnosis, 1999)"}
          </p>
        </div>
      </div>
    </aside>
  );
}

/**
 * Retro "under construction" article layout with optional title, date, status, and body slots.
 * Renders the fax-rail aside and Angry Man footer graphic for in-progress team or section pages.
 */
export default function UnderConstructionStatus({
  title = DEFAULT_TITLE,
  date = String(new Date().getFullYear()),
  statusLine = "UNDER CONSTRUCTION",
  children = DEFAULT_BODY,
  bodyAfter,
}: UnderConstructionStatusProps) {
  const afterContent = bodyAfter === undefined ? DEFAULT_BODY_AFTER : bodyAfter;

  return (
    <div className="mt-11">
      <article
        className="uc-paper relative isolate max-w-[min(100%,52rem)] pt-4 px-4.5 pb-5 bg-[#f8ef9d] text-stone-900 font-vt323 text-left tracking-wide"
        aria-label={`${title} production status`}
      >
        <div className="relative z-1 flex flex-row items-start gap-x-6 gap-y-3 max-sm:flex-col sm:gap-y-5">
          <div className="flex-1 min-w-0">
            <hr className="mb-2.5 h-0 border-0 border-t border-black" aria-hidden />
            <h2 className="mb-[0.2rem] text-[1.375rem] leading-[1.15] font-normal uppercase tracking-wider text-stone-900">
              {title}
            </h2>
            <p className="mb-2 text-[1.0625rem] leading-tight text-stone-800 uppercase">
              {date}
            </p>
            <p className="mb-2.5 text-[1.0625rem] leading-tight font-bold uppercase tracking-wider text-stone-900">
              STATUS: {statusLine}
            </p>
            <p className="m-0 text-base leading-snug uppercase text-stone-800 text-pretty">
              {children}
            </p>
            {afterContent != null && (
              <p className="mt-2.5 text-base leading-snug uppercase text-stone-800 font-bold">
                {afterContent}
              </p>
            )}
          </div>
          {afterContent != null && (
            <hr
              className="m-0 hidden h-0 w-full shrink-0 border-0 border-t border-black max-sm:block"
              aria-hidden
            />
          )}
          <FaxRail />
        </div>
      </article>
      <div className="mt-5 flex justify-start">
        <AngryManIcon size="md" blink className="text-white" aria-label="Angryman" />
      </div>
    </div>
  );
}
