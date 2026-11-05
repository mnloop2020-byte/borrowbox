import type { ReactElement } from "react";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { t } from "../../shared/i18n/i18n.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";

/** The item page when no item has this id */
export function ItemNotFound(): ReactElement {
  usePageTitle(t("title.itemNotFound"));
  return (
    <PlaceholderCard
      title={t("item.notFoundTitle")}
      text={t("item.notFoundText")}
      action={{ href: "#/catalog", label: t("item.browseCatalog") }}
    />
  );
}
