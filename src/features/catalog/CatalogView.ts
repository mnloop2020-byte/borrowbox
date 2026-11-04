import { t } from "../../shared/i18n/i18n.ts";
import { escapeHtml } from "../../shared/lib/html.ts";
import { getElement } from "../../shared/browser/dom.ts";
import type { MountedView } from "../../shared/types.ts";
import { CATEGORIES, categoryLabel } from "../items/categories.ts";
import { renderItemCard } from "../items/ItemCard.ts";
import { listItems } from "../items/listItems.ts";
import { parseCatalogParams } from "./catalogParams.ts";
import type { CatalogFilters } from "./catalogFilter.ts";
import { filterItems } from "./catalogFilter.ts";

/** Translated text, escaped for use inside these HTML templates */
const tx = (key: string, values?: Record<string, unknown>): string =>
  escapeHtml(t(key, values));

const SEARCH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>`;

/** The catalog address for a set of filters; empty filters are left out */
function catalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  const query = params.toString();
  return query ? `#/catalog?${query}` : "#/catalog";
}

/** "All" plus one chip per category. The chosen one is marked for screen readers too. */
function renderFilterChips(filters: CatalogFilters): string {
  const chip = (category: string, label: string): string => {
    const current = category === filters.category;
    // A chip changes the category and keeps the search text
    return `<li><a href="${escapeHtml(catalogHref({ ...filters, category }))}" class="filter-chip"${current ? ' aria-current="true"' : ""}>${escapeHtml(label)}</a></li>`;
  };
  return [
    chip("", t("catalog.all")),
    ...CATEGORIES.map((name) => chip(name, categoryLabel(name))),
  ].join("");
}

function renderResults(filters: CatalogFilters): string {
  const all = listItems();
  const shown = filterItems(all, filters);
  const count = `<p class="catalog-count">${tx("catalog.count", { count: shown.length, total: all.length })}</p>`;

  if (shown.length === 0) {
    return `
      ${count}
      <div class="catalog-empty">
        <h2 class="catalog-empty-title">${tx("catalog.emptyTitle")}</h2>
        <p>${tx("catalog.emptyText")}</p>
        <a href="#/catalog" class="btn btn-ghost">${tx("catalog.clear")}</a>
      </div>
    `;
  }
  return `
    ${count}
    <div class="catalog-grid">
      ${shown.map((item) => renderItemCard(item)).join("")}
    </div>
  `;
}

/**
 * Catalog page: every item, filtered by ?category= and ?q= in the URL.
 * Both values are checked by parseCatalogParams before they are used.
 *
 * @param queryString - the part of the hash after "?", e.g. "category=Camping"
 */
export function mountCatalogView(
  container: HTMLElement,
  queryString: string,
): MountedView {
  const filters = parseCatalogParams(queryString);

  container.innerHTML = `
    <section class="catalog-view" aria-labelledby="page-title">
      <div class="catalog-header">
        <h1 id="page-title" class="catalog-title">${tx("page.catalog.title")}</h1>
        <p class="catalog-intro">${tx("page.catalog.intro")}</p>
        <form id="catalog-search" class="catalog-search" role="search" aria-label="${tx("catalog.searchLabel")}">
          <div class="search-input-group">
            <label for="catalog-search-input" class="visually-hidden">${tx("catalog.searchInputLabel")}</label>
            <span class="search-icon" aria-hidden="true">${SEARCH_ICON}</span>
            <input type="search" id="catalog-search-input" class="hero-search-input" name="q" maxlength="100"
              value="${escapeHtml(filters.q)}" placeholder="${tx("catalog.searchPlaceholder")}" />
            <button type="submit" class="search-submit-btn">${tx("catalog.searchButton")}</button>
          </div>
        </form>
        <ul class="filter-chips" aria-label="${tx("catalog.filtersLabel")}">${renderFilterChips(filters)}</ul>
      </div>
      ${renderResults(filters)}
    </section>
  `;

  const form = getElement<HTMLFormElement>(container, "#catalog-search");
  const input = getElement<HTMLInputElement>(form, "#catalog-search-input");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // A new search keeps the chosen category
    window.location.hash = catalogHref({
      ...filters,
      q: input.value.trim(),
    });
  });

  return { title: t("title.catalog"), cleanup: () => {} };
}
