import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { SearchIcon } from "../../shared/ui/SearchIcon.tsx";
import { ItemsStatus } from "../cards/ItemsStatus.tsx";
import { listCards } from "../cards/listCards.ts";
import { useItems } from "../cards/useItems.ts";
import { CatalogResults } from "./CatalogResults.tsx";
import { catalogHref, parseCatalogParams } from "./catalogParams.ts";

interface CatalogViewProps {
  /** The part of the hash after "?", e.g. "category=Camping" */
  queryString: string;
}

/**
 * Catalog page: every item from the API, filtered by ?category= and ?q= and
 * sorted by ?sort= in the URL. The values are checked by parseCatalogParams
 * first. The title and search box show at once; under them, the loading or
 * error state shows until the items arrive.
 */
export function CatalogView({ queryString }: CatalogViewProps): ReactElement {
  usePageTitle(t("title.catalog"));
  const filters = parseCatalogParams(queryString);
  // What is typed in the search box. It starts as the search in the URL;
  // the router gives each URL a new CatalogView (key), so it starts again.
  const [search, setSearch] = useState(filters.q);

  const items = useItems();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A new search keeps the chosen category and sort. A "#/..." address only
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
      </div>

      {items.status === "success" ? (
        <CatalogResults items={listCards(items.items)} filters={filters} />
      ) : (
        <ItemsStatus state={items} />
      )}
    </section>
  );
}
