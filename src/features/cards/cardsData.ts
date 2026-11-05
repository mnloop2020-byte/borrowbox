import type { Item } from "./types.ts";
import { ITEM_RECORDS } from "./itemRecords.ts";
import drill from "../../assets/photos/cards/cordless-drill.webp";
import mower from "../../assets/photos/cards/lawn-mower.webp";
import tent from "../../assets/photos/cards/dome-tent.webp";
import washer from "../../assets/photos/cards/pressure-washer.webp";
import screwdriver from "../../assets/photos/cards/cordless-screwdriver.webp";
import socketSet from "../../assets/photos/cards/socket-set.webp";
import toolCase from "../../assets/photos/cards/tool-case.webp";
import vacuum from "../../assets/photos/cards/stick-vacuum.webp";
import stove from "../../assets/photos/cards/camping-stove.webp";
import sleepingBag from "../../assets/photos/cards/sleeping-bag.webp";
import table from "../../assets/photos/cards/folding-table.webp";
import ladder from "../../assets/photos/cards/step-ladder.webp";
import bike from "../../assets/photos/cards/mountain-bike.webp";
import scooter from "../../assets/photos/cards/electric-scooter.webp";

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
export const SEED_CARDS: Item[] = ITEM_RECORDS.map((record) => {
  const photo = PHOTOS[record.id] ?? "";
  return { ...record, imageUrl: photo, conditionImages: photo ? [photo] : [] };
});
