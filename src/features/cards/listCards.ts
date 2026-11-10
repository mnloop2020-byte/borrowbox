import { todayISO } from "../../shared/lib/dates.ts";
import type { Item } from "./types.ts";
import { deriveItemStatus } from "../requests/requestRules.ts";

/**
 * The items from the API, each with its status for today (for example
 * "Unavailable" when the owner paused it), so a card shows the same status
 * as the item page. The app only creates "Pending Approval" requests, which
 * do not change a status, so no requests are needed here.
 */
export function listCards(items: readonly Item[]): Item[] {
  const today = todayISO();
  return items.map((item) => ({
    ...item,
    status: deriveItemStatus(item, [], today),
  }));
}
