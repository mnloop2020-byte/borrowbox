/**
 * Data shapes for the borrow list (the cart).
 * Types only: this file has no runtime code.
 */

/** One row in the borrow list: an item and how many days */
export interface BorrowListEntry {
  itemId: string;
  /** A whole number from 1 to MAX_DAYS (borrowListRules.ts) */
  days: number;
}
