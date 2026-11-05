/**
 * Reads the catalog filters from the URL, keeping only allowed values.
 * Pure function: no DOM, so Node can test it.
 */
import { CATEGORIES } from "../items/categories.ts";

const MAX_QUERY_LENGTH = 100;

/**
 * @param queryString - e.g. "category=Gardening&q=drill"
 * @returns the category (only one from CATEGORIES, otherwise "") and the
 * search text (trimmed, at most 100 characters)
 */
export function parseCatalogParams(queryString: string): {
  category: string;
  q: string;
} {
  const params = new URLSearchParams(queryString);
  const category = params.get("category") ?? "";
  return {
    category: CATEGORIES.includes(category) ? category : "",
    q: (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH),
  };
}
