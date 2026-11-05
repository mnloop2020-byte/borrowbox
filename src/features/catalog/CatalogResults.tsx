import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { EmptyState } from "../../shared/ui/EmptyState.tsx";
import { AddToListButton } from "../borrow-list/AddToListButton.tsx";
import { ItemCard } from "../cards/ItemCard.tsx";
import type { Item } from "../cards/types.ts";
import { categoriesFrom, filterItems, sortItems } from "./catalogFilter.ts";
import type { CatalogParams } from "./catalogParams.ts";
import { FilterChips } from "./FilterChips.tsx";
import { SortSelect } from "./SortSelect.tsx";

interface CatalogResultsProps {
  /** Every item from the API, with today's status */
  items: Item[];
  filters: CatalogParams;
}

/**
 * The catalog under the search box, once the items have arrived: the
 * category chips (from the data), the count, the sort and the cards.
 * No items at all and "no match" are two different messages.
 */
export function CatalogResults({
  items,
  filters,
}: CatalogResultsProps): ReactElement {
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
        <SortSelect filters={filters} />
      </div>
      {shown.length === 0 ? (
        <EmptyState
          title={t("catalog.emptyTitle")}
          text={t("catalog.emptyText")}
          action={
            <a href="#/catalog" className="btn btn-ghost">
              {t("catalog.clear")}
            </a>
          }
        />
      ) : (
        <div className="catalog-grid">
          {shown.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              action={<AddToListButton item={item} />}
            />
          ))}
        </div>
      )}
    </>
  );
}
