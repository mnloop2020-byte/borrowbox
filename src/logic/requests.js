/**
 * Borrow request rules (item detail spec §3–§4, product spec §5.2–§6.2).
 * Pure functions: no DOM and no storage, so Node can test them.
 */
import { rangesOverlap } from "./dates.js";

/** Only these statuses hold dates; every other status releases them (product spec §6.2). */
const DATE_LOCKING_STATUSES = ["Active", "Pending Approval"];

/**
 * Checks a new request against the rules, in spec §3 order.
 *
 * @param {{ item: object, borrowerId: string, startDate: string, endDate: string,
 *           requests: object[], today: string }} input
 * @returns {{ ok: true } | { ok: false, field: "start" | "end" | "form", code: string }}
 */
export function validateRequest({
  item,
  borrowerId,
  startDate,
  endDate,
  requests,
  today,
}) {
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
 * Builds a new request in the product spec §5.3 shape.
 *
 * @param {{ item: object, borrower: { id: string, name: string }, startDate: string,
 *           endDate: string, now: Date, id: string }} input
 * @returns {object}
 */
export function createRequestRecord({
  item,
  borrower,
  startDate,
  endDate,
  now,
  id,
}) {
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
 * Availability shown on cards and the item page (product spec §5.2).
 *
 * @param {object} item
 * @param {object[]} requests - all requests; filtered to this item here
 * @param {string} today - "YYYY-MM-DD"
 * @returns {"Available" | "Reserved" | "Unavailable"}
 */
export function deriveItemStatus(item, requests, today) {
  const itemRequests = requests.filter((r) => r.itemId === item.id);
  if (item.isManuallyPaused) return "Unavailable";
  if (itemRequests.some((r) => r.status === "Disputed")) return "Unavailable";
  const activeToday = itemRequests.some(
    (r) => r.status === "Active" && r.startDate <= today && today <= r.endDate,
  );
  return activeToday ? "Reserved" : "Available";
}
