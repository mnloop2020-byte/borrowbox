import type { Item } from "../../shared/types.ts";
import { ITEM_RECORDS } from "./itemRecords.ts";
import drill from "../../assets/photos/items/cordless-drill.webp";
import mower from "../../assets/photos/items/lawn-mower.webp";
import tent from "../../assets/photos/items/dome-tent.webp";
import washer from "../../assets/photos/items/pressure-washer.webp";
import screwdriver from "../../assets/photos/items/cordless-screwdriver.webp";
import socketSet from "../../assets/photos/items/socket-set.webp";
import toolCase from "../../assets/photos/items/tool-case.webp";
import vacuum from "../../assets/photos/items/stick-vacuum.webp";
import stove from "../../assets/photos/items/camping-stove.webp";
import sleepingBag from "../../assets/photos/items/sleeping-bag.webp";
import table from "../../assets/photos/items/folding-table.webp";
import ladder from "../../assets/photos/items/step-ladder.webp";
import bike from "../../assets/photos/items/mountain-bike.webp";
import scooter from "../../assets/photos/items/electric-scooter.webp";

/** Each item's photo, by item id. Vite gives each file a hashed URL. */
const PHOTOS: Record<string, string> = {
  "item-101": drill,
  "item-102": mower,
  "item-103": tent,
  "item-104": washer,
  "item-105": screwdriver,
  "item-106": socketSet,
  "item-107": toolCase,
  "item-108": vacuum,
  "item-109": stove,
  "item-110": sleepingBag,
  "item-111": table,
  "item-112": ladder,
  "item-113": bike,
  "item-114": scooter,
};

/**
 * All items with their photos: the list the pages use.
 * An item without a photo gets "", and the card then shows no image.
 */
export const SEED_ITEMS: Item[] = ITEM_RECORDS.map((record) => {
  const photo = PHOTOS[record.id] ?? "";
  return { ...record, imageUrl: photo, conditionImages: photo ? [photo] : [] };
});
