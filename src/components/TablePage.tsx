import { ReactNode } from "react";
import Page from "./Page";
import { Headline } from "./Typography/Headline";
import { BorderedTable } from "./BorderedTable";
import { ThemeName } from "@/types/Theme.types";
import { DEFAULT_FOOTER_MENU_SUBTITLE } from "@/config/constants";

interface TablePageProps {
  theme: ThemeName;
  documentTitle: string;
  headlineTitle: string;
  tableTitle: string;
  footerTitle: string;
  footerSubtitle?: string;
  children: ReactNode;
}

/**
 * Standard page layout with headline and a {@link BorderedTable} for tabular or list content.
 * Forwards theme, document title, and footer copy to {@link Page}.
 */
const TablePage = ({
  theme,
  documentTitle,
  footerTitle,
  footerSubtitle = DEFAULT_FOOTER_MENU_SUBTITLE,
  headlineTitle,
  tableTitle,
  children,
}: TablePageProps) => {
  return (
    <Page
      theme={theme}
      documentTitle={documentTitle}
      footerTitle={footerTitle}
      footerSubtitle={footerSubtitle}
    >
      <Headline level={1} variant="xl" className="mb-14">
        {headlineTitle}
      </Headline>
      <BorderedTable title={tableTitle}>{children}</BorderedTable>
    </Page>
  );
};

export default TablePage;
