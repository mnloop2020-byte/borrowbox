import type { Item } from "../types.ts";
import drillImg from "../assets/photos/01-power-tools.webp";
import gardenImg from "../assets/photos/02-gardening.webp";
import campImg from "../assets/photos/03-camping.webp";
// No pressure-washer photo yet; the cleaning photo shows a bucket, so the illustration stays
import cleanImg from "../assets/images/pressure-washer.svg";

/**
 * Approved Initial Seed Data for BorrowBox MVP
 * Every entry is a complete Item (see src/types.ts)
 */
export const SEED_ITEMS: Item[] = [
  {
    id: "item-101",
    title: "Bosch Professional Hammer Drill",
    category: "Power Tools",
    description:
      "850W corded hammer drill with keyed chuck, auxiliary handle, and depth gauge.",
    condition: "Excellent",
    conditionNotes:
      "Minor surface scuff on carry case. Motor, chuck, and reverse gear in perfect order.",
    conditionImages: [drillImg],
    depositAmount: 45.0,
    ownerId: "user-1",
    ownerName: "Sarah Jenkins",
    ownerVerified: true,
    ownerRating: 4.9,
    status: "Available",
    isManuallyPaused: false,
    imageUrl: drillImg,
    createdAt: "2026-10-15T09:00:00Z",
  },
  {
    id: "item-102",
    title: "Ergonomic Hand Trowel & Shears Set",
    category: "Gardening",
    description:
      "Durable stainless steel hand trowel paired with high-carbon bypass pruning shears.",
    condition: "Like New",
    conditionNotes:
      "Freshly cleaned, oiled blades, no rust. Ideal for planting and hedge trimming.",
    conditionImages: [gardenImg],
    depositAmount: 20.0,
    ownerId: "user-1",
    ownerName: "Sarah Jenkins",
    ownerVerified: true,
    ownerRating: 4.9,
    status: "Available",
    isManuallyPaused: false,
    imageUrl: gardenImg,
    createdAt: "2026-10-18T11:30:00Z",
  },
  {
    id: "item-103",
    title: "4-Person Weatherproof Dome Tent",
    category: "Camping",
    description:
      "Spacious double-layer dome tent with waterproof flysheet, fiberglass poles, and pegs.",
    condition: "Excellent",
    conditionNotes:
      "Cleaned and dry-packed. Zippers move freely and ground tarp is intact.",
    conditionImages: [campImg],
    depositAmount: 60.0,
    ownerId: "user-2",
    ownerName: "Alex Mercer",
    ownerVerified: true,
    ownerRating: 4.8,
    status: "Available",
    isManuallyPaused: false,
    imageUrl: campImg,
    createdAt: "2026-10-20T14:15:00Z",
  },
  {
    id: "item-104",
    title: "High-Pressure Patio & Deck Washer",
    category: "Cleaning",
    description:
      "140 Bar compact electric pressure washer with variable nozzle and 6m flexible hose.",
    condition: "Good",
    conditionNotes:
      "Normal signs of driveway use. Strong water pressure and motor runs smoothly.",
    conditionImages: [cleanImg],
    depositAmount: 50.0,
    ownerId: "user-2",
    ownerName: "Alex Mercer",
    ownerVerified: true,
    ownerRating: 4.8,
    status: "Available",
    isManuallyPaused: false,
    imageUrl: cleanImg,
    createdAt: "2026-10-22T16:00:00Z",
  },
];
