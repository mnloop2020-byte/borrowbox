/**
 * The one Zustand store for the borrow list. Zustand's persist middleware
 * saves it under the existing localStorage key and restores validated data.
 *
 * The server cannot read localStorage, so the app's store starts empty
 * (skipHydration) and BorrowListHydration reads the saved list once the
 * page is in the browser. Server and browser then draw the same first
 * screen, and React shows no hydration error.
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
  /** Reads the saved list from storage (the app calls it once, in the browser) */
  rehydrate(): void;
  hasHydrated(): boolean;
  /** Calls `listener` when the saved list has been read */
  onHydrated(listener: () => void): () => void;
}

interface BorrowListStoreOptions {
  /** Tests pass a fake Storage; the app uses localStorage */
  storage?: Storage;
  /** When given, saved items not in it are dropped */
  knownIds?: ReadonlySet<string>;
  /** True for the app: read the saved list only when rehydrate() is called */
  skipHydration?: boolean;
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
 * Makes an isolated persisted Zustand store. The old format was a raw JSON
 * array, which migrate() converts without dropping valid saved entries.
 */
export function createBorrowListStore({
  storage,
  knownIds,
  skipHydration = false,
}: BorrowListStoreOptions = {}): BorrowListStore {
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
        skipHydration,
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
    rehydrate: () => void store.persist.rehydrate(),
    hasHydrated: () => store.persist.hasHydrated(),
    onHydrated: (listener) => store.persist.onFinishHydration(listener),
  };
}

/** The single borrowing list store used by the application. */
export const borrowListStore = createBorrowListStore({ skipHydration: true });
