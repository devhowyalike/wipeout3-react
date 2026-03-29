import Menu from "@/components/Menu/Menu";
import Page from "@/components/Page";
import { getMenuItemsById } from "@/utils/getMenuItemsById";
import { DEFAULT_FOOTER_MENU_SUBTITLE } from "@/config/constants";
import type { RouteId } from "@/routes/Route.Ids";

/** Home page with the main menu grid. */
export default function HomePage() {
  const menuIds: RouteId[] = [
    "news",
    "tour",
    "game",
    "teams",
    "soundtrack",
    "history",
    "pitlane",
  ];

  const menuItems = getMenuItemsById(menuIds);

  return (
    <Page
      theme="sandTheme"
      documentTitle="Menu Select"
      footerTitle={DEFAULT_FOOTER_MENU_SUBTITLE}
    >
      <Menu items={menuItems} />
    </Page>
  );
}
