/**
 * The borrow list, saved in localStorage under "borrowbox_borrow_list", so
 * it is still there after a refresh. useBorrowList() reads it from React.
 * No DOM, so Node can test it with a fake storage (tests/borrowList.test.ts).
 */
import { getJSON, setJSON } from "../../shared/browser/storage.ts";
import type { BorrowListEntry } from "../../shared/types.ts";
import { ITEM_RECORDS } from "../cards/itemRecords.ts";
import {
  addToList,
  decreaseDays,
  increaseDays,
  parseBorrowList,
  removeFromList,
} from "./borrowListRules.ts";

const LIST_KEY = "borrowbox_borrow_list";

export interface BorrowListStore {
  /** The same array until the list changes (useSyncExternalStore needs this) */
  getList(): readonly BorrowListEntry[];
  /** Calls `listener` after every change; returns a function that stops it */
  subscribe(listener: () => void): () => void;
  add(itemId: string): void;
  increase(itemId: string): void;
  decrease(itemId: string): void;
  remove(itemId: string): void;
  clear(): void;
}

/** The ids of the real items; anything else in the saved list is dropped */
export const KNOWN_ITEM_IDS: ReadonlySet<string> = new Set(
  ITEM_RECORDS.map((record) => record.id),
);

/**
 * @param storage - leave it out in the app (localStorage); tests pass a fake
 * @param knownIds - the items that exist; leave it out to accept any valid id
 */
export function createBorrowListStore(
  storage?: Storage,
  knownIds?: ReadonlySet<string>,
): BorrowListStore {
  // Read once, on first use. After that the list lives here, and every
  // change is saved. Reading storage on every getList() would return a new
  // array each time, and React would draw again and again.
  let list: readonly BorrowListEntry[] | null = null;
  const listeners = new Set<() => void>();

  function getList(): readonly BorrowListEntry[] {
    if (list === null)
      list = parseBorrowList(getJSON(LIST_KEY, [], storage), knownIds);
    return list;
  }

  /** Saves the new list (if storage works) and tells every listener */
  function update(next: readonly BorrowListEntry[]): void {
    list = next;
    setJSON(LIST_KEY, next, storage);
    listeners.forEach((listener) => listener());
  }

  return {
    getList,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    add: (itemId) => update(addToList(getList(), itemId)),
    increase: (itemId) => update(increaseDays(getList(), itemId)),
    decrease: (itemId) => update(decreaseDays(getList(), itemId)),
    remove: (itemId) => update(removeFromList(getList(), itemId)),
    clear: () => update([]),
  };
}

/** The one borrow list the app uses */
export const borrowListStore = createBorrowListStore(undefined, KNOWN_ITEM_IDS);
