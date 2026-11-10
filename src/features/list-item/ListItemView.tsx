import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";

/** "List an item" page (placeholder until the form is built) */
export async function ListItemView(): Promise<ReactElement> {
  const { t } = await getI18n();
  return (
    <PlaceholderCard
      title={t("page.listItem.title")}
      text={t("page.listItem.intro")}
    />
  );
}
