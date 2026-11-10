/**
 * Gets the items from the API (server/index.ts). Server only: pages and
 * layouts call these functions, and only this file knows the paths.
 *
 * cache(): within one request, every caller shares one API call, so the
 * layout (the Navbar count) and the page never ask twice.
 */
import "server-only";
import { cache } from "react";
import { getJson } from "../../shared/api/client.ts";
import { photoUrl } from "./cardPhotos.ts";
import { toItem, toItems } from "./itemMapper.ts";
import { listCards } from "./listCards.ts";
import type { Item } from "./types.ts";

const ITEMS_PATH = "/items";

/**
 * Every item, with today's status. Throws when the API fails or sends
 * something that is not a list of items: the nearest error boundary then
 * shows the error with "Try again".
 */
export const getItems = cache(async (): Promise<Item[]> => {
  const result = await getJson(ITEMS_PATH);
  const items = result.ok ? toItems(result.data, photoUrl) : null;
  if (items === null) throw new Error("The items could not be loaded");
  return listCards(items);
});

/**
 * One item by its id (already checked with isValidItemId), or null when
 * the API has no item with this id. Throws on any other failure.
 */
export const getItem = cache(async (itemId: string): Promise<Item | null> => {
  const result = await getJson(`${ITEMS_PATH}/${encodeURIComponent(itemId)}`);
  if (!result.ok && result.status === 404) return null;
  const item = result.ok ? toItem(result.data, photoUrl) : null;
  if (item === null) throw new Error("The item could not be loaded");
  return listCards([item])[0];
});

/**
 * The ids of every item, or null when the API fails. Never throws: the
 * Navbar uses it to count only the borrow-list rows the list page can show.
 */
export async function getItemIds(): Promise<string[] | null> {
  try {
    return (await getItems()).map((item) => item.id);
  } catch {
    return null;
  }
}
