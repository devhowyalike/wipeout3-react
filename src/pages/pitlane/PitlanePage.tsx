import Menu from "@/components/Menu/Menu";
import Page from "@/components/Page";
import { getMenuItemsById } from "@/utils/getMenuItemsById";
import type { RouteId } from "@/routes/Route.Ids";

/** Pit Lane community hub page. */
export default function PitlanePage() {
  const menuIds: RouteId[] = [
    "forum",
    "chat",
    "screensavers",
    "wallpaper",
    "banners",
    "subscribe",
    "contact",
    "credits",
  ];
  const menuItems = getMenuItemsById(menuIds);

  return (
    <Page theme="sandTheme" documentTitle="Pitlane" footerTitle="Pitlane">
      <h1 className="sr-only">Pit Lane — Select a section</h1>
      <Menu items={menuItems} />
    </Page>
  );
}
