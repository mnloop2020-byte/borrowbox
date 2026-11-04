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
 * Keeps the items in the category whose title, description or category
 * contains every word of the search text (case does not matter).
 * Example: "cordless drill" finds "Cordless Hammer Drill".
 */
export function filterItems(items: Item[], filters: CatalogFilters): Item[] {
  const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    const text =
      `${item.title} ${item.description} ${item.category}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}
