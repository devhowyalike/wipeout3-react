import { Headline } from "@/components/Typography/Headline";

const headlineStyles =
  "font-wipeout3 lowercase tracking-[.01em] leading-[.875] text-w3-fluid-xl";

function ScreenSaverDownload({
  teamName,
  teamId,
}: {
  teamName: string;
  teamId: string;
}) {
  return (
    <div>
      <Headline
        level={1}
        variant="xl"
        className="whitespace-pre-line text-screensaver-heading"
      >
        {`${teamName}\nScreensaver`}
      </Headline>

      <ul className="flex items-center gap-2 [&>li]:inline-block [&_a:hover]:text-white">
        <li className={headlineStyles}>
          {/* tabIndex makes it focusable so group-focus:block shows the tooltip on touch tap */}
          <div className="relative group cursor-not-allowed! outline-none" tabIndex={0}>
            <a
              // href={`/screensavers/${teamId}.sea.hqx`}
              className="pointer-events-none opacity-20"
              aria-disabled="true"
            >
              Mac
            </a>
            <span className="absolute hidden group-hover:block group-focus:block bg-gray-800 text-white text-xs p-1 top-full left-0 mt-1 whitespace-nowrap">
              Archive Unavailable
            </span>
          </div>
        </li>
        <li className={`ml-[-7px] ${headlineStyles}`}>/</li>
        <li className={`ml-[-7px] ${headlineStyles}`}>
          <a href={`/screensavers/${teamId}.zip`} className="subpixel-fix">
            PC
          </a>
        </li>
      </ul>
    </div>
  );
}

/**
 * Team screensaver download block: heading plus Mac (disabled) and PC zip links.
 * Mac link is visually disabled with an "Archive Unavailable" hover hint.
 */
export default ScreenSaverDownload;
