/**
 * Allowlist checks for values that come from the URL (product spec §8.3).
 * Pure functions: no DOM, so Node can test them.
 */
import { CATEGORIES } from "../content/categories.ts";

const ITEM_ID_PATTERN = /^item-\d{1,6}$/;
const MAX_QUERY_LENGTH = 100;

/**
 * @returns true for ids like "item-101"
 */
export function isValidItemId(id: unknown): boolean {
  return typeof id === "string" && ITEM_ID_PATTERN.test(id);
}

/**
 * Reads catalog filters from a query string, keeping only allowed values.
 * @param queryString - e.g. "category=Gardening&q=drill"
 * @returns {{ category: string, q: string }}
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
