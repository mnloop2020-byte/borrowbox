/**
 * The item id check, used wherever an id comes from outside: the URL
 * (/items/:id), item data, and the API (server/index.ts).
 * Pure function: no DOM, so Node can test it.
 */

const ITEM_ID_PATTERN = /^item-\d{1,6}$/;

/**
 * @returns true for ids like "item-101"
 */
export function isValidItemId(id: unknown): boolean {
  return typeof id === "string" && ITEM_ID_PATTERN.test(id);
}
