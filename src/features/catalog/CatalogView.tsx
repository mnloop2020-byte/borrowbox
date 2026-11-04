import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { SearchIcon } from "../../shared/ui/SearchIcon.tsx";
import { CATEGORIES, categoryLabel } from "../items/categories.ts";
import { ItemCard } from "../items/ItemCard.tsx";
import { listItems } from "../items/listItems.ts";
import { parseCatalogParams } from "./catalogParams.ts";
import type { CatalogFilters } from "./catalogFilter.ts";
import { filterItems } from "./catalogFilter.ts";

/** The catalog address for a set of filters; empty filters are left out */
function catalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  const query = params.toString();
  return query ? `#/catalog?${query}` : "#/catalog";
}

interface FilterChipsProps {
  filters: CatalogFilters;
}

/** "All" plus one chip per category. The chosen one is marked for screen readers too. */
function FilterChips({ filters }: FilterChipsProps): ReactElement {
  const chips = [
    { category: "", label: t("catalog.all") },
    ...CATEGORIES.map((name) => ({
      category: name,
      label: categoryLabel(name),
    })),
  ];
  return (
    <ul className="filter-chips" aria-label={t("catalog.filtersLabel")}>
      {chips.map(({ category, label }) => (
        <li key={category || "all"}>
          {/* A chip changes the category and keeps the search text */}
          <a
            href={catalogHref({ ...filters, category })}
            className="filter-chip"
            aria-current={category === filters.category ? "true" : undefined}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

interface CatalogViewProps {
  /** The part of the hash after "?", e.g. "category=Camping" */
  queryString: string;
}

/**
 * Catalog page: every item, filtered by ?category= and ?q= in the URL.
 * Both values are checked by parseCatalogParams before they are used.
 */
export function CatalogView({ queryString }: CatalogViewProps): ReactElement {
  usePageTitle(t("title.catalog"));
  const filters = parseCatalogParams(queryString);
  // What is typed in the search box. It starts as the search in the URL;
  // the router gives each URL a new CatalogView (key), so it starts again.
  const [search, setSearch] = useState(filters.q);

  const all = listItems();
  const shown = filterItems(all, filters);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A new search keeps the chosen category. A "#/..." address only
    // changes the hash, so the page does not reload; the router draws it.
    window.location.assign(catalogHref({ ...filters, q: search.trim() }));
  }

  return (
    <section className="catalog-view" aria-labelledby="page-title">
      <div className="catalog-header">
        <h1 id="page-title" className="catalog-title">
          {t("page.catalog.title")}
        </h1>
        <p className="catalog-intro">{t("page.catalog.intro")}</p>
        <form
          id="catalog-search"
          className="catalog-search"
          role="search"
          aria-label={t("catalog.searchLabel")}
          onSubmit={handleSubmit}
        >
          <div className="search-input-group">
            <label htmlFor="catalog-search-input" className="visually-hidden">
              {t("catalog.searchInputLabel")}
            </label>
            <span className="search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              type="search"
              id="catalog-search-input"
              className="hero-search-input"
              name="q"
              maxLength={100}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
            />
            <button type="submit" className="search-submit-btn">
              {t("catalog.searchButton")}
            </button>
          </div>
        </form>
        <FilterChips filters={filters} />
      </div>

      <p className="catalog-count">
        {t("catalog.count", { count: shown.length, total: all.length })}
      </p>
      {shown.length === 0 ? (
        <div className="catalog-empty">
          <h2 className="catalog-empty-title">{t("catalog.emptyTitle")}</h2>
          <p>{t("catalog.emptyText")}</p>
          <a href="#/catalog" className="btn btn-ghost">
            {t("catalog.clear")}
          </a>
        </div>
      ) : (
        <div className="catalog-grid">
          {shown.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
