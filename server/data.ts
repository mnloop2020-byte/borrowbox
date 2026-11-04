import type { Item } from "../src/shared/types.ts";

/** The fields the API sends for each item (no photos yet) */
export type ItemSummary = Pick<
  Item,
  "id" | "title" | "category" | "depositAmount" | "status"
>;

/** The server's data. Kept in memory: it resets when the server restarts. */
export const ITEMS: ItemSummary[] = [
  {
    id: "item-101",
    title: "Bosch Professional Hammer Drill",
    category: "Power Tools",
    depositAmount: 45,
    status: "Available",
  },
  {
    id: "item-102",
    title: "Ergonomic Hand Trowel & Shears Set",
    category: "Gardening",
    depositAmount: 20,
    status: "Available",
  },
  {
    id: "item-103",
    title: "4-Person Weatherproof Dome Tent",
    category: "Camping",
    depositAmount: 60,
    status: "Available",
  },
  {
    id: "item-104",
    title: "High-Pressure Patio & Deck Washer",
    category: "Cleaning",
    depositAmount: 50,
    status: "Available",
  },
];
