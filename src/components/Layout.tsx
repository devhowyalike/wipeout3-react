import { Outlet, useLocation } from "react-router-dom";
import { OptionsProvider } from "@/providers/OptionsProvider";
import { PageProvider } from "@/providers/PageProvider";
import CRTEffects from "@/providers/CRTEffects";
import { usePage } from "@/hooks/usePage";
import { useOptions } from "@/hooks/useOptions";
import AppContainer from "./AppContainer";
import Footer from "./Footer/Footer";
import { EscapeNavigation } from "./EscapeNavigation";
import { useLayoutEffect, useRef } from "react";
import { useNavigationEventGuard } from "@/hooks/useNavigationEventGuard";
import { useRouteChangeFocus } from "@/hooks/useRouteChangeFocus";

/**
 * Root layout component that mounts providers (Options, Page, Escape), the footer, and the router outlet.
 */
export default function Layout() {
  return (
    <OptionsProvider>
      <PageProvider>
        <EscapeNavigation>
          <LayoutContent />
        </EscapeNavigation>
      </PageProvider>
    </OptionsProvider>
  );
}

// Access context after PageProvider is mounted
function LayoutContent() {
  const { isFooterHidden, setLoading, isThemeApplied } = usePage();
  const { wideCenter } = useOptions();
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    setLoading(!isThemeApplied);
  }, [isThemeApplied, setLoading]);

  useNavigationEventGuard(mainRef, pathname);
  useRouteChangeFocus(mainRef, pathname);

  return (
    <CRTEffects>
      <AppContainer className="h-full flex flex-col">
        {/* tabIndex={-1} receives programmatic focus on route changes and as a
            fallback when a modal's original trigger unmounts. */}
        <main ref={mainRef} tabIndex={-1} className="flex-1 overflow-auto min-h-0">
          <div className={`w-full h-full px-6 py-6 ${wideCenter ? "w3-app-max-width mx-auto" : ""}`}>
            <Outlet />
          </div>
        </main>
        {!isFooterHidden && <Footer />}
      </AppContainer>
    </CRTEffects>
  );
}
