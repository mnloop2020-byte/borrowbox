import { useSyncExternalStore } from "react";
import type { BorrowListEntry } from "./types.ts";
import { borrowListStore } from "./borrowListStore.ts";

/** The borrow list. A component that calls it draws again after every change. */
export function useBorrowList(): readonly BorrowListEntry[] {
  return useSyncExternalStore(
    borrowListStore.subscribe,
    borrowListStore.getList,
  );
}
