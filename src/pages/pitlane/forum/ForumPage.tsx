import NotArchivedPage from "@/components/NotArchivedPage";
import Page from "@/components/Page";

/** Forum page. */
export default function ForumPage() {
  return (
    <Page
      theme="whiteTheme"
      documentTitle="Pitlane | Forum"
      footerTitle="Forum"
      footerSubtitle="Pitlane Select"
    >
      <NotArchivedPage pageTitle="Forum" />
    </Page>
  );
}
