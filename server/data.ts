import type { ItemRecord } from "./itemRecords.ts";
import { ITEM_RECORDS } from "./itemRecords.ts";

/** The items the API sends: every field except the photos */
export const ITEMS: readonly ItemRecord[] = ITEM_RECORDS;
