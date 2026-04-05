import { useRef, lazy, Suspense } from "react";
import Menu from "@/components/Menu/Menu";
import { MenuItem } from "@/types/Menu.types";
import Page from "@/components/Page";
import { Modal } from "@/components/Modal";
import Banner from "@/components/Banner/Banner";
import { BannerHandle } from "@/types/Banner.types";
import { bannerData } from "@/components/Banner/bannerData";
import { modalWidth, modalHeight } from "@/components/Banner/bannerConfig";
import { useOptions } from "@/hooks/useOptions";
import { getVideoWidth } from "@/components/Banner/bannerConfig";
import type { Animation } from "@/components/WipeoutLink/animations";
import { positionSetOne as pos } from "@/components/WipeoutLink/animations/positions";

// Only import Ruffle preloader if feature flag is enabled
const RufflePreloader = lazy(
  () => import("@/components/Ruffle/RufflePreloader"),
);

/** Team banners gallery page. */
export default function BannersPage() {
  const { bannersFlash } = useOptions();
  const bannerRefs = useRef<Record<string, BannerHandle | null>>({});

  // Create menu items directly from banner data
  const menuItems: MenuItem[] = bannerData.map((banner, i) => ({
    id: banner.id,
    label: banner.name,
    // Use hash to prevent page navigation
    path: "#",
    // Hover animations
    animation: {
      folder: "shared",
      sources: `hover${(i % 7) + 1}`,
      style: pos[`row${(i % 7) + 1}`],
    } satisfies Animation,
    modalConfig: {
      content: (
        <Modal
          width={modalWidth}
          height={modalHeight}
          // Don't exceed largest video width or the banner modal cap
          modalWidth={`min(80vw, ${getVideoWidth("lg")}px, var(--w3-banner-max-width))`}
          onClose={() => {
            bannerRefs.current[banner.id]?.cleanup();
          }}
        >
          <Banner
            ref={(el) => {
              bannerRefs.current[banner.id] = el;
            }}
            bannerId={banner.id}
            autoplay={true}
          />
        </Modal>
      ),
    },
  }));

  return (
    <Page
      theme="sandTheme"
      documentTitle="Pitlane | Banners"
      footerTitle="Banners"
      footerSubtitle="Pitlane Select"
    >
      <Menu items={menuItems} />
      {bannersFlash && (
        <Suspense fallback={null}>
          <RufflePreloader />
        </Suspense>
      )}
    </Page>
  );
}
