import type { Item } from "../src/features/cards/types.ts";
import { ITEM_RECORDS } from "../src/features/cards/itemRecords.ts";

/** The fields the API sends for each item (no photos) */
export type ItemSummary = Pick<
  Item,
  "id" | "title" | "category" | "depositAmount" | "status"
>;

/**
 * The server's items: the same list the app uses (itemRecords.ts), so a new
 * item never needs to be added in two places.
 */
export const ITEMS: ItemSummary[] = ITEM_RECORDS.map(
  ({ id, title, category, depositAmount, status }) => ({
    id,
    title,
    category,
    depositAmount,
    status,
  }),
);
