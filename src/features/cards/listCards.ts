import { todayISO } from "../../shared/lib/dates.ts";
import type { Item } from "./types.ts";
import { deriveItemStatus } from "../requests/requestRules.ts";
import { getRequests } from "../requests/requestStore.ts";

/**
 * The items from the API, each with its status for today, so a card shows
 * the same status as the item page (for example "Unavailable" when the owner
 * paused it, or "Reserved" while someone has it).
 */
export function listCards(items: readonly Item[]): Item[] {
  const requests = getRequests();
  const today = todayISO();
  return items.map((item) => ({
    ...item,
    status: deriveItemStatus(item, requests, today),
  }));
}
