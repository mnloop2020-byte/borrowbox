import { useStore } from "zustand";
import type { BorrowListEntry } from "./types.ts";
import { borrowListStore } from "./borrowListStore.ts";

/** The borrow list. A component that calls it draws again after every change. */
export function useBorrowList(): readonly BorrowListEntry[] {
  return useStore(borrowListStore.store, (state) => state.list);
}
