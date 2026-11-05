import { useSyncExternalStore } from "react";
import { photoUrl } from "./cardPhotos.ts";
import { fetchItems } from "./itemsApi.ts";
import { createItemsStore } from "./itemsStore.ts";
import type { ItemsState } from "./itemsStore.ts";

/** The one items store the app uses: the real API and the real photos */
export const itemsStore = createItemsStore(fetchItems, photoUrl);

/**
 * The items and where loading them is: loading, error or success.
 * A component that calls it draws again when the state changes. The first
 * one to call it starts the request; every other page shares it.
 */
export function useItems(): ItemsState {
  return useSyncExternalStore(itemsStore.subscribe, itemsStore.getState);
}
