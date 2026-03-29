import NotArchivedPage from "@/components/NotArchivedPage";
import Page from "@/components/Page";

/** Chat room page. */
export default function ChatPage() {
  return (
    <Page
      theme="whiteTheme"
      documentTitle="Pitlane | Chat:Room"
      footerTitle="Chat:Room"
      footerSubtitle="Pitlane Select"
    >
      <NotArchivedPage pageTitle="Chat:room" />
    </Page>
  );
}
