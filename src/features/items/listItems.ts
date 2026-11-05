import { todayISO } from "../../shared/lib/dates.ts";
import type { Item } from "../../shared/types.ts";
import { deriveItemStatus } from "../requests/requestRules.ts";
import { getRequests } from "../requests/requestStore.ts";
import { SEED_ITEMS } from "./itemsData.ts";

/**
 * All items, each with its status for today, so a card shows the same
 * status as the item page (for example "Unavailable" when the owner paused
 * it, or "Reserved" while someone has it).
 */
export function listItems(): Item[] {
  const requests = getRequests();
  const today = todayISO();
  return SEED_ITEMS.map((item) => ({
    ...item,
    status: deriveItemStatus(item, requests, today),
  }));
}
