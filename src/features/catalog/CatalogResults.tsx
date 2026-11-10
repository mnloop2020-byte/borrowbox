import Link from "next/link";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { EmptyState } from "../../shared/ui/EmptyState.tsx";
import { AddToListButton } from "../borrow-list/AddToListButton.tsx";
import { ItemCard } from "../cards/ItemCard.tsx";
import { getItems } from "../cards/itemsApi.ts";
import { categoriesFrom, filterItems, sortItems } from "./catalogFilter.ts";
import type { CatalogParams } from "./catalogParams.ts";
import { FilterChips } from "./FilterChips.tsx";
import { SortSelect } from "./SortSelect.tsx";

/** Cards in the first row on a wide screen: their photos load at once */
const FIRST_ROW = 4;

interface CatalogResultsProps {
  filters: CatalogParams;
}

/**
 * The catalog under the search box: the category chips (from the data),
 * the count, the sort and the cards. It waits for the API, so CatalogView
 * draws it inside Suspense. No items at all and "no match" are two
 * different messages.
 */
export async function CatalogResults({
  filters,
}: CatalogResultsProps): Promise<ReactElement> {
  const { t, lang } = await getI18n();
  const items = await getItems();
  if (items.length === 0) {
    return (
      <EmptyState
        title={t("catalog.noItemsTitle")}
        text={t("catalog.noItemsText")}
      />
    );
  }

  // Filter first, then sort the result (sortItems works on a copy)
  const shown = sortItems(filterItems(items, filters), filters.sort);

  return (
    <>
      <FilterChips filters={filters} categories={categoriesFrom(items)} />
      <div className="catalog-toolbar">
        <p className="catalog-count">
          {t("catalog.count", { count: shown.length, total: items.length })}
        </p>
        <SortSelect filters={filters} lang={lang} />
      </div>
      {shown.length === 0 ? (
        <EmptyState
          title={t("catalog.emptyTitle")}
          text={t("catalog.emptyText")}
          action={
            <Link href="/catalog" className="btn btn-ghost">
              {t("catalog.clear")}
            </Link>
          }
        />
      ) : (
        <div className="catalog-grid">
          {shown.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              eager={index < FIRST_ROW}
              action={<AddToListButton item={item} lang={lang} />}
            />
          ))}
        </div>
      )}
    </>
  );
}
