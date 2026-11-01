import { tValue } from "../i18n/i18n.js";

/**
 * The six item categories approved in the product spec (v1.4.0, §1.2).
 * This is the only place category names are written; everything else imports them.
 */
export const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Gardening",
  "Cleaning",
  "Camping",
  "Outdoor Equipment",
];

/**
 * Builds the catalog link for one category.
 * @param {string} name - One of CATEGORIES
 * @returns {string} e.g. "#/catalog?category=Power%20Tools"
 */
export function categoryHref(name) {
  return `#/catalog?category=${encodeURIComponent(name)}`;
}

/**
 * The category name to show in the current language. Data and URLs keep the
 * English name (product spec §10.4); only this display text changes.
 * @param {string} name - One of CATEGORIES
 * @returns {string} e.g. "أدوات كهربائية" in Arabic
 */
export function categoryLabel(name) {
  return tValue("category", name);
}
