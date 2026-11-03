/**
 * Borrow request rules.
 * Pure functions: no DOM and no storage, so Node can test them.
 */
import type { BorrowRequest, Item, ItemStatus, User } from "../types.ts";
import { rangesOverlap } from "./dates.ts";

/** The result of checking a new request: ok, or which field failed and why */
export type ValidationResult =
  { ok: true } | { ok: false; field: "start" | "end" | "form"; code: string };

/** Only these statuses hold dates; every other status releases them. */
const DATE_LOCKING_STATUSES = ["Active", "Pending Approval"];

/**
 * Checks a new request against the rules and returns the first one that fails.
 */
export function validateRequest({
  item,
  borrowerId,
  startDate,
  endDate,
  requests,
  today,
}: {
  item: Item;
  borrowerId: string;
  startDate: string;
  endDate: string;
  requests: BorrowRequest[];
  today: string;
}): ValidationResult {
  if (!startDate) return { ok: false, field: "start", code: "missing-dates" };
  if (!endDate) return { ok: false, field: "end", code: "missing-dates" };
  if (startDate < today) {
    return { ok: false, field: "start", code: "start-in-past" };
  }
  if (endDate < startDate) {
    return { ok: false, field: "end", code: "end-before-start" };
  }

  const itemRequests = requests.filter((r) => r.itemId === item.id);

  const hasPending = itemRequests.some(
    (r) => r.borrowerId === borrowerId && r.status === "Pending Approval",
  );
  if (hasPending)
    return { ok: false, field: "form", code: "duplicate-pending" };

  const overlaps = itemRequests.some(
    (r) =>
      DATE_LOCKING_STATUSES.includes(r.status) &&
      rangesOverlap(startDate, endDate, r.startDate, r.endDate),
  );
  if (overlaps) return { ok: false, field: "form", code: "overlap" };

  return { ok: true };
}

/**
 * Builds a new request with every BorrowRequest field set.
 */
export function createRequestRecord({
  item,
  borrower,
  startDate,
  endDate,
  now,
  id,
}: {
  item: Item;
  borrower: Pick<User, "id" | "name">;
  startDate: string;
  endDate: string;
  now: Date;
  id: string;
}): BorrowRequest {
  return {
    id,
    itemId: item.id,
    itemTitle: item.title,
    borrowerId: borrower.id,
    borrowerName: borrower.name,
    ownerId: item.ownerId,
    startDate,
    endDate,
    depositAmount: item.depositAmount,
    status: "Pending Approval",
    depositStatus: "Not Held",
    createdAt: now.toISOString(),
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
  };
}

/**
 * Availability shown on cards and the item page.
 *
 * @param requests - all requests; filtered to this item here
 * @param today - "YYYY-MM-DD"
 */
export function deriveItemStatus(
  item: Item,
  requests: BorrowRequest[],
  today: string,
): ItemStatus {
  const itemRequests = requests.filter((r) => r.itemId === item.id);
  if (item.isManuallyPaused) return "Unavailable";
  if (itemRequests.some((r) => r.status === "Disputed")) return "Unavailable";
  const activeToday = itemRequests.some(
    (r) => r.status === "Active" && r.startDate <= today && today <= r.endDate,
  );
  return activeToday ? "Reserved" : "Available";
}
