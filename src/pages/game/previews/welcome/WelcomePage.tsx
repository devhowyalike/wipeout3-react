import Page from "@/components/Page";
import { W3Logotype } from "@/components/Logotype/W3Logotype";
import { Headline } from "@/components/Typography/Headline";
import styles from "./WelcomePage.module.css";

/** Welcome video/intro page. */
export default function WelcomePage() {
  return (
    <Page
      theme="steelTheme"
      documentTitle="Game | Previews | Welcome"
      footerTitle="Welcome"
      footerSubtitle="Previews Select"
    >
      <Headline level={1} variant="xl" className={styles.title}>
        Welcome
        <span className={styles.subtitle}>to the future</span>
      </Headline>
      <div className={`mt-4 ${styles.logotype}`}>
        <W3Logotype />
      </div>
    </Page>
  );
}
