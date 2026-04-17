import Menu from "@/components/Menu/Menu";
import Page from "@/components/Page";
import { getMenuItemsById } from "@/utils/getMenuItemsById";
import type { RouteId } from "@/routes/Route.Ids";

/** Game section hub with sub-navigation. */
export default function GamePage() {
  const menuIds: RouteId[] = [
    "previews",
    "modes",
    "gameplay",
    "tracks",
    "weapons",
    "developers",
  ];
  const menuItems = getMenuItemsById(menuIds);

  return (
    <Page
      theme="cloudTheme"
      documentTitle="Game Select"
      footerTitle="Game Select"
    >
      <h1 className="sr-only">Game — Select a section</h1>
      <Menu items={menuItems} />
    </Page>
  );
}
