import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";

/** The item page when no item has this id */
export async function ItemNotFound(): Promise<ReactElement> {
  const { t } = await getI18n();
  return (
    <PlaceholderCard
      title={t("item.notFoundTitle")}
      text={t("item.notFoundText")}
      action={{ href: "/catalog", label: t("item.browseCatalog") }}
    />
  );
}
