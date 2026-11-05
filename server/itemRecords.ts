import type { Item } from "../src/features/cards/types.ts";

/**
 * Every item, without photos: the server's data. The app never imports this
 * file; it gets the items with GET /api/items (tests/architecture.test.ts
 * checks that). Photos stay in the app (features/cards/cardPhotos.ts).
 *
 * Typed with the app's Item, so a typo such as category "Gardenning" is a
 * TypeScript error here too.
 */
export type ItemRecord = Omit<Item, "imageUrl" | "conditionImages">;

const SARAH = {
  ownerId: "user-1",
  ownerName: "Sarah Jenkins",
  ownerVerified: true,
  ownerRating: 4.9,
};
const ALEX = {
  ownerId: "user-2",
  ownerName: "Alex Mercer",
  ownerVerified: true,
  ownerRating: 4.8,
};
// A new member: not verified yet and no rating, so the card shows neither
const ELENA = {
  ownerId: "user-3",
  ownerName: "Elena Rostova",
  ownerVerified: false,
  ownerRating: 0,
};

export const ITEM_RECORDS: ItemRecord[] = [
  {
    id: "item-101",
    title: "Cordless Hammer Drill",
    category: "Power Tools",
    description:
      "18V cordless hammer drill with a keyless chuck, two speeds and a hammer mode for masonry.",
    condition: "Excellent",
    conditionNotes:
      "Battery holds a full charge. Chuck, clutch and reverse all work perfectly.",
    depositAmount: 45,
    ...SARAH,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-15T09:00:00Z",
  },
  {
    id: "item-102",
    title: "Cordless Lawn Mower",
    category: "Gardening",
    description:
      "40V battery lawn mower with a 46cm cut, six height settings and a 50L grass box.",
    condition: "Like New",
    conditionNotes:
      "Used for one summer. Blade sharpened and deck cleaned after every use.",
    depositAmount: 80,
    ...SARAH,
    status: "Available",
    isManuallyPaused: false,
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
    depositAmount: 60,
    ...ALEX,
    status: "Available",
    isManuallyPaused: false,
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
    depositAmount: 50,
    ...ALEX,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-22T16:00:00Z",
  },
  {
    id: "item-105",
    title: "Compact Cordless Screwdriver",
    category: "Power Tools",
    description:
      "Light 12V drill driver for furniture, shelves and small repairs. Comes with a bit set.",
    condition: "Good",
    conditionNotes: "Light scratches on the grip. Both batteries charge fully.",
    depositAmount: 25,
    ...ELENA,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-23T10:00:00Z",
  },
  {
    id: "item-106",
    title: "40-Piece Socket Wrench Set",
    category: "Hand Tools",
    description:
      "Chrome vanadium sockets from 4mm to 22mm, a quick-release ratchet, extensions and bits in a hard case.",
    condition: "Excellent",
    conditionNotes:
      "Every socket is in its slot. The ratchet clicks cleanly both ways.",
    depositAmount: 30,
    ...SARAH,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-24T08:45:00Z",
  },
  {
    id: "item-107",
    title: "Heavy-Duty Tool Case",
    category: "Hand Tools",
    description:
      "Lockable hard case with metal latches and a removable tray. Good for moving tools to a job.",
    condition: "Good",
    conditionNotes: "Scuffs on the corners. Latches and handle are solid.",
    depositAmount: 15,
    ...ALEX,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-25T13:20:00Z",
  },
  {
    id: "item-108",
    title: "Cordless Stick Vacuum",
    category: "Cleaning",
    description:
      "Light stick vacuum with a 40-minute battery and a motorised floor head for carpets and hard floors.",
    condition: "Like New",
    conditionNotes: "Filter washed and bin emptied. Battery health is good.",
    depositAmount: 40,
    ...SARAH,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-26T17:10:00Z",
  },
  {
    id: "item-109",
    title: "Portable Camping Stove",
    category: "Camping",
    description:
      "Single-burner gas stove with a wind guard and an adjustable flame. Uses standard gas canisters.",
    condition: "Excellent",
    conditionNotes: "Cleaned after every trip. The igniter lights first time.",
    depositAmount: 20,
    ...ALEX,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-27T09:30:00Z",
  },
  {
    id: "item-110",
    title: "Down Sleeping Bag",
    category: "Camping",
    description:
      "Mummy-shaped down sleeping bag rated to -5°C, with a hood and a compression sack.",
    condition: "Excellent",
    conditionNotes: "Washed and fully lofted. The zip runs smoothly.",
    depositAmount: 35,
    ...ELENA,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-28T12:00:00Z",
  },
  {
    id: "item-111",
    title: "Folding Camp Table",
    category: "Camping",
    description:
      "Wood-look top on a steel frame that folds flat. Seats four and sets up in a minute.",
    condition: "Good",
    conditionNotes: "Small mark on one edge. The legs lock firmly.",
    depositAmount: 20,
    ...SARAH,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-29T15:40:00Z",
  },
  {
    id: "item-112",
    title: "Aluminium Step Ladder",
    category: "Outdoor Equipment",
    description:
      "Four-step folding ladder that also locks straight for walls. Non-slip feet, 150kg load.",
    condition: "Excellent",
    conditionNotes:
      "All hinges lock and the feet are like new. Safety checked this month.",
    depositAmount: 40,
    ...ALEX,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-30T10:15:00Z",
  },
  {
    id: "item-113",
    title: "Full-Suspension Mountain Bike",
    category: "Outdoor Equipment",
    description:
      "29-inch trail bike with front and rear suspension, hydraulic disc brakes and a 12-speed drivetrain.",
    condition: "Excellent",
    conditionNotes:
      "Serviced last month. Tyres have plenty of tread; helmet not included.",
    depositAmount: 150,
    ...SARAH,
    status: "Available",
    isManuallyPaused: false,
    createdAt: "2026-10-31T09:00:00Z",
  },
  {
    id: "item-114",
    title: "Folding Electric Scooter",
    category: "Outdoor Equipment",
    description:
      "Electric scooter with a 30km range, front and rear brakes and a frame that folds for carrying.",
    condition: "Good",
    conditionNotes:
      "Paused while the owner is away. Battery and brakes checked before each loan.",
    depositAmount: 120,
    ...ALEX,
    status: "Available",
    // Shows the "Unavailable" chip
    isManuallyPaused: true,
    createdAt: "2026-11-01T14:30:00Z",
  },
];
