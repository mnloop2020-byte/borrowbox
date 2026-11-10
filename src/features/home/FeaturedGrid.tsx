import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { EmptyState } from "../../shared/ui/EmptyState.tsx";
import { AddToListButton } from "../borrow-list/AddToListButton.tsx";
import { ItemCard } from "../cards/ItemCard.tsx";
import { getItems } from "../cards/itemsApi.ts";
import { FEATURED_ITEM_IDS } from "./homeContent.ts";

/**
 * The cards of the items in FEATURED_ITEM_IDS. It waits for the API, so
 * Featured draws it inside its own Suspense and RetryBoundary.
 */
export async function FeaturedGrid(): Promise<ReactElement> {
  const { t, lang } = await getI18n();
  const items = (await getItems()).filter((item) =>
    FEATURED_ITEM_IDS.includes(item.id),
  );
  if (items.length === 0) {
    return (
      <EmptyState
        title={t("catalog.noItemsTitle")}
        text={t("catalog.noItemsText")}
      />
    );
  }
  return (
    // No data-reveal-group: these cards arrive after the page (Suspense), and
    // the scroll reveal must not change HTML that React has not hydrated yet
    <div className="featured-grid">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          action={<AddToListButton item={item} lang={lang} />}
        />
      ))}
    </div>
  );
}
