/**
 * Reads the catalog filters from the URL, keeping only allowed values.
 * Pure function: no DOM, so Node can test it.
 */
import { CATEGORIES } from "../items/categories.ts";
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
 * @param queryString - e.g. "category=Gardening&q=drill&sort=name"
 * @returns the category (only one from CATEGORIES, otherwise ""), the
 * search text (trimmed, at most 100 characters) and the sort (only one
 * from SORT_KEYS, otherwise "default")
 */
export function parseCatalogParams(queryString: string): CatalogParams {
  const params = new URLSearchParams(queryString);
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    category: CATEGORIES.includes(category) ? category : "",
    q: (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH),
    sort: isSortKey(sort) ? sort : "default",
  };
}
