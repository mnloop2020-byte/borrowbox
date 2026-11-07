/**
 * The one Zustand store for the borrow list. Zustand's persist middleware
 * saves it under the existing localStorage key and restores validated data.
 */
import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { BorrowListEntry } from "./types.ts";
import {
  addToList,
  decreaseDays,
  increaseDays,
  parseBorrowList,
  removeFromList,
} from "./borrowListRules.ts";

const LIST_KEY = "borrowbox_borrow_list";
const STORAGE_VERSION = 1;

interface BorrowListState {
  list: readonly BorrowListEntry[];
  add(itemId: string): void;
  increase(itemId: string): void;
  decrease(itemId: string): void;
  remove(itemId: string): void;
  clear(): void;
}

export interface BorrowListStore {
  /** Zustand store API, used by the React hook to subscribe to the one state. */
  store: StoreApi<BorrowListState>;
  getList(): readonly BorrowListEntry[];
  subscribe(listener: () => void): () => void;
  add(itemId: string): void;
  increase(itemId: string): void;
  decrease(itemId: string): void;
  remove(itemId: string): void;
  clear(): void;
}

function savedList(
  value: unknown,
  knownIds?: ReadonlySet<string>,
): BorrowListEntry[] {
  if (Array.isArray(value)) return parseBorrowList(value, knownIds);
  if (typeof value !== "object" || value === null) return [];
  return parseBorrowList(Reflect.get(value, "list"), knownIds);
}

/**
 * Makes an isolated persisted Zustand store. Tests may pass their own
 * Storage; the app uses localStorage. The old format was a raw JSON array,
 * which migrate() converts without dropping valid saved entries.
 */
export function createBorrowListStore(
  storage?: Storage,
  knownIds?: ReadonlySet<string>,
): BorrowListStore {
  const safeStorage: StateStorage = {
    getItem: (name) => {
      try {
        const raw = (storage ?? globalThis.localStorage).getItem(name);
        if (raw === null) return null;
        // The previous custom store wrote a raw array. Wrap it in Zustand's
        // envelope at version 0 so its migrate() callback can validate it.
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed)
          ? JSON.stringify({ state: parsed, version: 0 })
          : raw;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        (storage ?? globalThis.localStorage).setItem(name, value);
      } catch {
        // The list continues to work in memory when browser storage is blocked.
      }
    },
    removeItem: (name) => {
      try {
        (storage ?? globalThis.localStorage).removeItem(name);
      } catch {
        // A blocked storage must not prevent using the in-memory list.
      }
    },
  };
  const persistStorage = createJSONStorage(() => safeStorage);

  if (!persistStorage) {
    throw new Error("Borrow list persistence storage is unavailable");
  }

  const store = createStore<BorrowListState>()(
    persist(
      (set) => ({
        list: [],
        add: (itemId) =>
          set((state) => ({ list: addToList(state.list, itemId) })),
        increase: (itemId) =>
          set((state) => ({ list: increaseDays(state.list, itemId) })),
        decrease: (itemId) =>
          set((state) => ({ list: decreaseDays(state.list, itemId) })),
        remove: (itemId) =>
          set((state) => ({ list: removeFromList(state.list, itemId) })),
        clear: () => set({ list: [] }),
      }),
      {
        name: LIST_KEY,
        version: STORAGE_VERSION,
        storage: persistStorage,
        migrate: (persistedState) => ({
          list: savedList(persistedState, knownIds),
        }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          list: savedList(persistedState, knownIds),
        }),
        partialize: (state) => ({ list: state.list }),
      },
    ),
  );

  return {
    store,
    getList: () => store.getState().list,
    subscribe: (listener) => store.subscribe(listener),
    add: (itemId) => store.getState().add(itemId),
    increase: (itemId) => store.getState().increase(itemId),
    decrease: (itemId) => store.getState().decrease(itemId),
    remove: (itemId) => store.getState().remove(itemId),
    clear: () => store.getState().clear(),
  };
}

/** The single borrowing list store used by the application. */
export const borrowListStore = createBorrowListStore();
