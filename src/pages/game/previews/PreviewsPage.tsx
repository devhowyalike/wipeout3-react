import Menu from "@/components/Menu/Menu";
import Page from "@/components/Page";
import { getMenuItemsById } from "@/utils/getMenuItemsById";
import type { RouteId } from "@/routes/Route.Ids";

/** Previews hub with links to movies, screenshots, typography, and welcome. */
export default function PreviewPage() {
  const menuIds: RouteId[] = ["welcome", "movies", "screenshots", "typography"];
  const menuItems = getMenuItemsById(menuIds);

  return (
    <Page
      theme="darkTheme"
      documentTitle="Game | Previews"
      footerTitle="Previews"
      footerSubtitle="Game Select"
    >
      <Menu items={menuItems} />
    </Page>
  );
}
