import Menu from "@/components/Menu/Menu";
import Page from "@/components/Page";
import { getMenuItemsById } from "@/utils/getMenuItemsById";
import type { RouteId } from "@/routes/Route.Ids";

/** History section hub page. */
export default function HistoryPage() {
  const menuIds: RouteId[] = ["wipeout", "xl", "docs", "mitdr"];
  const menuItems = getMenuItemsById(menuIds);

  return (
    <Page
      theme="grayTheme"
      documentTitle="History"
      footerTitle="History Select"
    >
      <Menu items={menuItems} />
    </Page>
  );
}
