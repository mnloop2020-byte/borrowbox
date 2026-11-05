import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";

/** "List an item" page (placeholder until the form is built) */
export function ListItemView(): ReactElement {
  usePageTitle(t("title.listItem"));
  return (
    <PlaceholderCard
      title={t("page.listItem.title")}
      text={t("page.listItem.intro")}
    />
  );
}
