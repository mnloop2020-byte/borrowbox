/**
 * Test helpers shared by the test files (not a test file itself).
 */
import type { BorrowRequest } from "../src/features/requests/types.ts";
import type { Item } from "../src/features/cards/types.ts";

/** In-memory stand-in for localStorage; `data` lets a test look inside */
export function fakeStorage(
  initial: Record<string, string> = {},
): Storage & { data: Record<string, string> } {
  const data: Record<string, string> = { ...initial };
  return {
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = String(value);
    },
    removeItem: (key: string) => {
      delete data[key];
    },
    clear: () => {
      for (const key of Object.keys(data)) delete data[key];
    },
    key: (index: number) => Object.keys(data)[index] ?? null,
    get length() {
      return Object.keys(data).length;
    },
    data,
  };
}

const blocked = (): never => {
  throw new Error("blocked");
};

/** Storage that throws on every call, like Safari private mode used to */
export const throwingStorage: Storage = {
  getItem: blocked,
  setItem: blocked,
  removeItem: blocked,
  clear: blocked,
  key: blocked,
  get length(): number {
    return blocked();
  },
};

/**
 * A complete, valid item. A test passes only the fields it cares about.
 */
export function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: "item-101",
    title: "Drill",
    category: "Power Tools",
    description: "",
    condition: "Excellent",
    conditionNotes: "",
    conditionImages: [],
    depositAmount: 45,
    ownerId: "user-1",
    ownerName: "Sarah",
    ownerVerified: true,
    ownerRating: 4.9,
    status: "Available",
    isManuallyPaused: false,
    imageUrl: "/a.png",
    createdAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

/**
 * A complete, valid borrow request. A test passes only the fields it cares about.
 */
export function makeRequest(
  overrides: Partial<BorrowRequest> = {},
): BorrowRequest {
  return {
    id: "req-1",
    itemId: "item-101",
    itemTitle: "Drill",
    borrowerId: "user-3",
    borrowerName: "Omar",
    ownerId: "user-1",
    startDate: "2026-11-12",
    endDate: "2026-11-14",
    depositAmount: 45,
    status: "Pending Approval",
    depositStatus: "Not Held",
    createdAt: "2026-11-01T00:00:00.000Z",
    approvedAt: null,
    rejectedAt: null,
    expiredAt: null,
    handedOverAt: null,
    cancelledAt: null,
    returnedAt: null,
    inspectedAt: null,
    preHandoverNotes: "",
    preHandoverImages: [],
    postReturnNotes: "",
    cancellationReason: null,
    issueDescription: null,
    issueImages: [],
    ...overrides,
  };
}
