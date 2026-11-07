/**
 * Gets the items from the API (GET /api/items in server/index.ts).
 * Only this file knows the address; the store calls fetchItems().
 */
import { getJson } from "../../shared/api/client.ts";
import type { ApiResult } from "../../shared/api/client.ts";

/**
 * Where the items come from, after BASE_URL. To see each state of the app,
 * change it for a moment to:
 *   "/items?delay=3000"   loading (answers after 3 seconds)
 *   "/items?fail=500"     error, with the "Try again" button
 *   "/items?empty=1"      no items at all
 */
const ITEMS_PATH = "/items";

export function fetchItems(): Promise<ApiResult> {
  return getJson(ITEMS_PATH);
}

/** Gets one item by its checked route id from GET /api/items/:id. */
export function fetchItem(itemId: string): Promise<ApiResult> {
  return getJson(`/items/${encodeURIComponent(itemId)}`);
}
