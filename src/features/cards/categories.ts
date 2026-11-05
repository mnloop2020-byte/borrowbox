import { tValue } from "../../shared/i18n/i18n.ts";

/**
 * The six item categories.
 * This is the only place category names are written; everything else imports them.
 * `as const` keeps each name as its own exact type instead of just `string`.
 */
export const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Gardening",
  "Cleaning",
  "Camping",
  "Outdoor Equipment",
] as const;

/**
 * One category name: "Power Tools" | "Hand Tools" | ... (a union type built
 * from the list above). A typo such as "Gardenning" is a TypeScript error,
 * and a new category is added in one place: the list.
 */
export type Category = (typeof CATEGORIES)[number];

/**
 * True for one of CATEGORIES. Use it on text from outside the app (the URL,
 * localStorage, the API) before treating it as a Category. A type guard,
 * so no `as` is needed.
 */
export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((name) => name === value);
}

/**
 * Builds the catalog link for one category.
 * @param name - One of CATEGORIES
 * @returns e.g. "#/catalog?category=Power%20Tools"
 */
export function categoryHref(name: Category): string {
  return `#/catalog?category=${encodeURIComponent(name)}`;
}

/**
 * The category name to show in the current language. Data and URLs keep the
 * English name; only this display text changes.
 * @param name - One of CATEGORIES
 * @returns e.g. the Arabic name for "Power Tools" when the page is in Arabic
 */
export function categoryLabel(name: Category): string {
  return tValue("category", name);
}
