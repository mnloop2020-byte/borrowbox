/**
 * Which items the catalog shows for a category and a search text.
 * Pure function: no DOM, so Node can test it (tests/catalog.test.ts).
 */
import type { Item } from "../../shared/types.ts";

export interface CatalogFilters {
  /** One of CATEGORIES, or "" for all */
  category: string;
  /** Search text, or "" for none */
  q: string;
}

/**
 * Keeps the items in the category whose name contains every word of the
 * search text (case does not matter). Only the name is searched, so a
 * screwdriver whose description mentions "drill" is not a drill result.
 * Example: "cordless drill" finds "Cordless Hammer Drill".
 */
export function filterItems(items: Item[], filters: CatalogFilters): Item[] {
  const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    const name = item.title.toLowerCase();
    return words.every((word) => name.includes(word));
  });
}

/**
 * The categories that have items, each once, in the order they first
 * appear. The catalog builds its filter from the data with this.
 */
export function categoriesFrom(items: Item[]): string[] {
  return [...new Set(items.map((item) => item.category))];
}

/** The catalog sort options. "default" is the order of the item list. */
export const SORT_KEYS = [
  "default",
  "name",
  "deposit-asc",
  "deposit-desc",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];

/**
 * A sorted copy of the items. The array passed in is never changed, so
 * "default" can always give back the original order.
 * Equal values keep their original order (Array.prototype.sort is stable).
 */
export function sortItems(items: Item[], sort: SortKey): Item[] {
  const copy = [...items];
  if (sort === "name") {
    copy.sort((a, b) =>
      a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
    );
  } else if (sort === "deposit-asc") {
    copy.sort((a, b) => a.depositAmount - b.depositAmount);
  } else if (sort === "deposit-desc") {
    copy.sort((a, b) => b.depositAmount - a.depositAmount);
  }
  return copy;
}
