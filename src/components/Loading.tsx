import { useEffect, useState } from "react";

/**
 * Displays a full-screen loading indicator with the Wipeout 3 logotype and a blinking cursor,
 * shown after an optional delay to avoid flash.
 */
export default function Loading({ delay = 300 }) {
  // add a delay to avoid a flash of loading before the app is ready
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showLoading) return null;

  return (
    <div className="min-h-screen bg-neutral-800 absolute top-0 left-0 z-10 w-full h-full">
      <div className="pl-6 pt-6">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="38"
            className="fill-white"
          >
            <path
              fillRule="evenodd"
              d="M194.457 37.66v-6.738h-22.266V6.898h27.344V37.66h-5.078Zm0-25.488h-17.383v13.379h17.383V12.172Zm-35.18 13.379-17.382-13.477v18.848h-4.883V6.898h6.836l20.507 16.114v7.91h-5.078v-5.371ZM124.269 9.34h4.882v21.582h-4.882V9.34Zm-.074-7.642h4.883v4.297h-4.883V1.698ZM89.016 30.922v-7.813l22.461-17.675V.16h4.882v30.762H89.016Zm22.265-18.75L93.898 25.551h17.383V12.172Zm-57.445 18.75v-7.813l14.16-10.937h-14.16V6.898H81.18v24.024H53.836Zm22.266-18.75L58.719 25.551h17.383V12.172Zm-57.446 18.75V6.898H45.1v24.024H18.656Zm22.266-18.75H23.539v13.379h17.383V12.172ZM.469 30.922V.16h4.883v26.465h5.371v4.297H.469Z"
            />
          </svg>
          <span className="text-w3-fluid-xl text-white mb-4 ml-2 animate-w3-blink">
            _
          </span>
        </div>
      </div>
    </div>
  );
}
