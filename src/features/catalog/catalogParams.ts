/**
 * Reads the catalog filters from the URL, keeping only allowed values.
 * Pure function: no DOM, so Node can test it.
 */
import { isCategory } from "../cards/categories.ts";
import { SORT_KEYS } from "./catalogFilter.ts";
import type { CatalogFilters, SortKey } from "./catalogFilter.ts";

const MAX_QUERY_LENGTH = 100;

/** Everything the catalog URL can hold */
export interface CatalogParams extends CatalogFilters {
  sort: SortKey;
}

/** True for one of SORT_KEYS. A type guard, so no `as` is needed. */
function isSortKey(value: string): value is SortKey {
  return SORT_KEYS.some((key) => key === value);
}

/**
 * The catalog address for a set of filters, the opposite of
 * parseCatalogParams(). Default values are left out, so "All" with no
 * search and the default sort is just "#/catalog".
 */
export function catalogHref(filters: CatalogParams): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  if (filters.sort !== "default") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `#/catalog?${query}` : "#/catalog";
}

/**
 * @param queryString - e.g. "category=Gardening&q=drill&sort=name"
 * @returns the category (only one from CATEGORIES, checked by isCategory,
 * otherwise ""), the search text (trimmed, at most 100 characters) and the
 * sort (only one from SORT_KEYS, otherwise "default")
 */
export function parseCatalogParams(queryString: string): CatalogParams {
  const params = new URLSearchParams(queryString);
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    category: isCategory(category) ? category : "",
    q: (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH),
    sort: isSortKey(sort) ? sort : "default",
  };
}
