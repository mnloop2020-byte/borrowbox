import Form from "next/form";
import { Suspense } from "react";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { LoadingState } from "../../shared/ui/LoadingState.tsx";
import { RetryBoundary } from "../../shared/ui/RetryBoundary.tsx";
import { SearchIcon } from "../../shared/ui/SearchIcon.tsx";
import { CatalogResults } from "./CatalogResults.tsx";
import type { CatalogParams } from "./catalogParams.ts";

interface CatalogViewProps {
  /** The checked filters from the URL (parseCatalogParams) */
  filters: CatalogParams;
}

/**
 * Catalog page: the title and search box show at once; the results wait
 * for the API in their own Suspense and RetryBoundary.
 */
export async function CatalogView({
  filters,
}: CatalogViewProps): Promise<ReactElement> {
  const { t, lang } = await getI18n();
  return (
    <section className="catalog-view" aria-labelledby="page-title">
      <div className="catalog-header">
        <h1 id="page-title" className="catalog-title">
          {t("page.catalog.title")}
        </h1>
        <p className="catalog-intro">{t("page.catalog.intro")}</p>
        {/* A GET form: a new search keeps the chosen category and sort
            (hidden inputs) and opens /catalog?q=... without a page load */}
        <Form
          action="/catalog"
          id="catalog-search"
          className="catalog-search"
          role="search"
          aria-label={t("catalog.searchLabel")}
        >
          {filters.category ? (
            <input type="hidden" name="category" value={filters.category} />
          ) : null}
          {filters.sort !== "default" ? (
            <input type="hidden" name="sort" value={filters.sort} />
          ) : null}
          <div className="search-input-group">
            <label htmlFor="catalog-search-input" className="visually-hidden">
              {t("catalog.searchInputLabel")}
            </label>
            <span className="search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            {/* key: a new search in the URL starts the box again */}
            <input
              key={filters.q}
              type="search"
              id="catalog-search-input"
              className="hero-search-input"
              name="q"
              maxLength={100}
              defaultValue={filters.q}
              placeholder={t("catalog.searchPlaceholder")}
            />
            <button type="submit" className="search-submit-btn">
              {t("catalog.searchButton")}
            </button>
          </div>
        </Form>
      </div>

      <RetryBoundary lang={lang} title={t("items.errorTitle")}>
        <Suspense fallback={<LoadingState label={t("items.loading")} />}>
          <CatalogResults filters={filters} />
        </Suspense>
      </RetryBoundary>
    </section>
  );
}
