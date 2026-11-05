/**
 * The items from the API and where loading them is (the LoadState).
 * Every page reads the same store, so the items are asked for once.
 * No React and no DOM: the API and the photos are passed in, so Node can
 * test it with a fake API (tests/itemsStore.test.ts). useItems.ts makes the
 * one store the app uses.
 */
import type { ApiResult } from "../../shared/api/client.ts";
import { toItems } from "./itemMapper.ts";
import type { PhotoUrl } from "./itemMapper.ts";
import type { Item } from "./types.ts";

/**
 * One state for every screen. "Empty" is a success with no items, and
 * "no match" is decided by the page after filtering.
 * The error keeps the status code (0: no answer, or not a list of items),
 * not a text, so a language switch can translate the message.
 */
export type ItemsState =
  | { status: "loading" }
  | { status: "error"; httpStatus: number }
  | { status: "success"; items: readonly Item[] };

export interface ItemsStore {
  /** The same object until the state changes (useSyncExternalStore needs this) */
  getState(): ItemsState;
  /** Calls `listener` after every change. The first subscriber starts the loading. */
  subscribe(listener: () => void): () => void;
  /** Asks the API once; later calls do nothing */
  load(): void;
  /** After an error ("Try again"): asks the API again */
  retry(): void;
}

const LOADING: ItemsState = { status: "loading" };

export function createItemsStore(
  fetchItems: () => Promise<ApiResult>,
  photoUrl: PhotoUrl,
): ItemsStore {
  let state: ItemsState = LOADING;
  let started = false;
  let inFlight = false;
  const listeners = new Set<() => void>();

  function update(next: ItemsState): void {
    state = next;
    listeners.forEach((listener) => listener());
  }

  async function request(): Promise<void> {
    inFlight = true;
    const result = await fetchItems();
    inFlight = false;
    if (!result.ok) {
      update({ status: "error", httpStatus: result.status });
      return;
    }
    const items = toItems(result.data, photoUrl);
    update(
      items === null
        ? { status: "error", httpStatus: 0 }
        : { status: "success", items },
    );
  }

  function load(): void {
    if (started) return;
    started = true;
    void request();
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      load();
      return () => listeners.delete(listener);
    },
    load,
    retry() {
      if (inFlight || state.status !== "error") return;
      update(LOADING);
      void request();
    },
  };
}
