import { useSyncExternalStore } from "react";
import { useStore } from "zustand";
import type { BorrowListEntry } from "./types.ts";
import { borrowListStore } from "./borrowListStore.ts";

/** The borrow list. A component that calls it draws again after every change. */
export function useBorrowList(): readonly BorrowListEntry[] {
  return useStore(borrowListStore.store, (state) => state.list);
}

/**
 * False on the server and until the saved list is read in the browser.
 * Until then the list is empty only because it is not read yet, so a page
 * should not say "your list is empty".
 */
export function useBorrowListReady(): boolean {
  return useSyncExternalStore(
    borrowListStore.onHydrated,
    borrowListStore.hasHydrated,
    () => false,
  );
}
