import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { SORT_KEYS } from "./catalogFilter.ts";
import { catalogHref } from "./catalogParams.ts";
import type { CatalogParams } from "./catalogParams.ts";

interface SortSelectProps {
  filters: CatalogParams;
}

/**
 * The sort menu. A change opens the new address at once (no button), and
 * the router draws the page for it; search and category are kept.
 */
export function SortSelect({ filters }: SortSelectProps): ReactElement {
  return (
    <div className="catalog-sort">
      <label htmlFor="catalog-sort-select" className="catalog-sort-label">
        {t("catalog.sortLabel")}
      </label>
      <select
        id="catalog-sort-select"
        className="catalog-sort-select"
        value={filters.sort}
        onChange={(event) => {
          const sort = SORT_KEYS.find((key) => key === event.target.value);
          if (sort) window.location.assign(catalogHref({ ...filters, sort }));
        }}
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`catalog.sort.${key}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
