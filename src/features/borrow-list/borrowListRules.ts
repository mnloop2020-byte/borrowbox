/**
 * The borrow list (works like a cart): which items, and for how many days.
 * Pure functions: no DOM and no localStorage, so Node can test them
 * (tests/borrowList.test.ts). Each one returns a new list and never
 * changes the one passed in, so React sees every change.
 */
import { isValidItemId } from "../items/itemId.ts";
import type { BorrowListEntry } from "../../shared/types.ts";

/** The longest a tool can be borrowed for */
export const MAX_DAYS = 14;

/**
 * Adds an item with 1 day at the end. An item already in the list gets
 * one more day instead, so it is never listed twice.
 */
export function addToList(
  list: readonly BorrowListEntry[],
  itemId: string,
): BorrowListEntry[] {
  if (list.some((entry) => entry.itemId === itemId)) {
    return increaseDays(list, itemId);
  }
  return [...list, { itemId, days: 1 }];
}

/** One more day for the item, up to MAX_DAYS */
export function increaseDays(
  list: readonly BorrowListEntry[],
  itemId: string,
): BorrowListEntry[] {
  return list.map((entry) =>
    entry.itemId === itemId
      ? { ...entry, days: Math.min(entry.days + 1, MAX_DAYS) }
      : entry,
  );
}

/** One day less for the item; at 1 day, the item is removed */
export function decreaseDays(
  list: readonly BorrowListEntry[],
  itemId: string,
): BorrowListEntry[] {
  return list
    .map((entry) =>
      entry.itemId === itemId ? { ...entry, days: entry.days - 1 } : entry,
    )
    .filter((entry) => entry.days >= 1);
}

/** Takes the item out of the list */
export function removeFromList(
  list: readonly BorrowListEntry[],
  itemId: string,
): BorrowListEntry[] {
  return list.filter((entry) => entry.itemId !== itemId);
}

/** How many items are in the list (the number on the "My list" link) */
export function listCount(list: readonly BorrowListEntry[]): number {
  return list.length;
}

/** True for { itemId: "item-1", days: 1..MAX_DAYS } */
function isEntry(value: unknown): value is BorrowListEntry {
  if (typeof value !== "object" || value === null) return false;
  const itemId: unknown = Reflect.get(value, "itemId");
  const days: unknown = Reflect.get(value, "days");
  return (
    isValidItemId(itemId) &&
    typeof days === "number" &&
    Number.isInteger(days) &&
    days >= 1 &&
    days <= MAX_DAYS
  );
}

/**
 * Checks a list read from localStorage, which anyone can edit. Keeps only
 * valid entries, each item once (the first one wins).
 *
 * @param knownIds - when given, items not in it are dropped too, so the
 * count on the "My list" link always matches the rows on the page
 */
export function parseBorrowList(
  value: unknown,
  knownIds?: ReadonlySet<string>,
): BorrowListEntry[] {
  if (!Array.isArray(value)) return [];
  const list: BorrowListEntry[] = [];
  for (const candidate of value) {
    if (!isEntry(candidate)) continue;
    if (knownIds && !knownIds.has(candidate.itemId)) continue;
    if (list.some((entry) => entry.itemId === candidate.itemId)) continue;
    list.push({ itemId: candidate.itemId, days: candidate.days });
  }
  return list;
}
