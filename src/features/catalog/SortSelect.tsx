"use client";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { createI18n } from "../../shared/i18n/i18n.ts";
import type { Lang } from "../../shared/types.ts";
import { SORT_KEYS } from "./catalogFilter.ts";
import { catalogHref } from "./catalogParams.ts";
import type { CatalogParams } from "./catalogParams.ts";

interface SortSelectProps {
  filters: CatalogParams;
  lang: Lang;
}

/**
 * The sort menu. A change opens the new address at once (no button), and
 * the server draws the results for it; search and category are kept.
 */
export function SortSelect({ filters, lang }: SortSelectProps): ReactElement {
  const router = useRouter();
  const { t } = createI18n(lang);
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
          if (sort) router.push(catalogHref({ ...filters, sort }));
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
