/**
 * The item photos. The API sends no images, so the app keeps them and adds
 * them to each item in toItem() (itemMapper.ts).
 */
import type { StaticImageData } from "next/image";
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

/** Each item's photo, by item id. Next.js gives each file a hashed URL. */
const PHOTOS: Record<string, StaticImageData> = {
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
 * The photo for an item, or "" when there is none (the card then shows no
 * image). Passed to toItems() when the items arrive from the API.
 */
export function photoUrl(id: string): string {
  return PHOTOS[id]?.src ?? "";
}
