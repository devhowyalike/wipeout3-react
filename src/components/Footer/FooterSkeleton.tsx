import { useOptions } from "@/hooks/useOptions";

const FooterSkeleton = () => {
  const options = useOptions();

  return (
    <footer className="pt-2 sticky bottom-0 w-full bg-footer text-footer-nav z-10 animate-pulse">
      <div className={`w3-app-max-width flex w-full items-end justify-between gap-6 pr-6 ${options.wideCenter ? "mx-auto" : ""}`}>
        <nav aria-label="Secondary navigation loading" role="navigation">
          <ul className="flex gap-x-[0.2rem] gap-y-2">
            <li>
              <div className="ml-1 h-4 w-32 bg-gray-200 opacity-50 "></div>
              <div className="ml-6 mt-1">
                <div className="h-3 w-16 bg-gray-200 opacity-50 bottom-[-2px] relative"></div>
                <div className="w-29 h-7 mt-1 bg-gray-200 opacity-50 angled-corner-lg"></div>
              </div>
            </li>
            <li>
              <div className="h-4 w-20 bg-gray-200 opacity-50"></div>
              <div className="mt-1">
                <div className="h-3 w-16 bg-gray-200 opacity-50 bottom-[-2px] relative"></div>
                <div className="w-9 h-7 mt-1 bg-gray-200 opacity-50 angled-corner-sm"></div>
              </div>
            </li>
          </ul>
        </nav>
        <div className="flex shrink-0 gap-2">
          {options.soundToggle && (
            <div className="h-7 w-9 bg-gray-200 opacity-50 angled-corner-sm"></div>
          )}
          <div className="h-7 w-9 bg-gray-200 opacity-50 angled-corner-sm"></div>
        </div>
      </div>
    </footer>
  );
};

/** Placeholder footer layout while page data is loading. */
export default FooterSkeleton;
