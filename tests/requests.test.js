import { test } from "node:test";
import assert from "node:assert/strict";

import { rangesOverlap, todayISO } from "../src/logic/dates.js";
import {
  createRequestRecord,
  deriveItemStatus,
  validateRequest,
} from "../src/logic/requests.js";

const item = {
  id: "item-101",
  title: "Drill",
  ownerId: "user-1",
  depositAmount: 45,
  isManuallyPaused: false,
};
const today = "2026-11-10";

function request(overrides) {
  return {
    id: "req-1",
    itemId: "item-101",
    borrowerId: "user-3",
    startDate: "2026-11-12",
    endDate: "2026-11-14",
    status: "Pending Approval",
    ...overrides,
  };
}

function validate(overrides) {
  return validateRequest({
    item,
    borrowerId: "user-2",
    startDate: "2026-11-20",
    endDate: "2026-11-22",
    requests: [],
    today,
    ...overrides,
  });
}

// ---------- dates ----------

test("todayISO uses the local calendar day, not UTC", () => {
  // 01:00 local time on 10 Nov must be 10 Nov even where UTC is still 9 Nov
  assert.equal(todayISO(new Date(2026, 10, 10, 1, 0)), "2026-11-10");
  assert.equal(todayISO(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
});

test("rangesOverlap counts a shared single day as overlapping", () => {
  assert.equal(
    rangesOverlap("2026-11-01", "2026-11-04", "2026-11-04", "2026-11-06"),
    true,
  );
});

test("rangesOverlap is false for separate ranges", () => {
  assert.equal(
    rangesOverlap("2026-11-01", "2026-11-04", "2026-11-10", "2026-11-12"),
    false,
  );
});

// ---------- validateRequest (spec §3 order) ----------

test("valid request passes", () => {
  assert.deepEqual(validate({}), { ok: true });
});

test("missing start date fails on the start field", () => {
  assert.deepEqual(validate({ startDate: "" }), {
    ok: false,
    field: "start",
    code: "missing-dates",
  });
});

test("missing end date fails on the end field", () => {
  assert.deepEqual(validate({ endDate: "" }), {
    ok: false,
    field: "end",
    code: "missing-dates",
  });
});

test("start date before today fails", () => {
  assert.deepEqual(validate({ startDate: "2026-11-09" }), {
    ok: false,
    field: "start",
    code: "start-in-past",
  });
});

test("start date of today is allowed", () => {
  assert.deepEqual(validate({ startDate: today, endDate: today }), {
    ok: true,
  });
});

test("end date before start date fails", () => {
  assert.deepEqual(
    validate({ startDate: "2026-11-22", endDate: "2026-11-20" }),
    {
      ok: false,
      field: "end",
      code: "end-before-start",
    },
  );
});

test("a second pending request by the same borrower fails", () => {
  const requests = [
    request({
      borrowerId: "user-2",
      startDate: "2026-12-01",
      endDate: "2026-12-02",
    }),
  ];
  assert.deepEqual(validate({ requests }), {
    ok: false,
    field: "form",
    code: "duplicate-pending",
  });
});

test("overlap with a pending request by someone else fails", () => {
  const requests = [
    request({ startDate: "2026-11-22", endDate: "2026-11-25" }),
  ];
  assert.deepEqual(validate({ requests }), {
    ok: false,
    field: "form",
    code: "overlap",
  });
});

test("overlap with an active request fails", () => {
  const requests = [
    request({
      status: "Active",
      startDate: "2026-11-19",
      endDate: "2026-11-20",
    }),
  ];
  assert.equal(validate({ requests }).code, "overlap");
});

test("ended requests do not block their dates", () => {
  for (const status of [
    "Rejected",
    "Expired",
    "Cancelled",
    "Completed",
    "Returned",
  ]) {
    const requests = [
      request({ status, startDate: "2026-11-20", endDate: "2026-11-22" }),
    ];
    assert.deepEqual(validate({ requests }), { ok: true }, status);
  }
});

test("requests for other items do not block dates", () => {
  const requests = [
    request({
      itemId: "item-102",
      startDate: "2026-11-20",
      endDate: "2026-11-22",
    }),
  ];
  assert.deepEqual(validate({ requests }), { ok: true });
});

// ---------- createRequestRecord ----------

test("createRequestRecord builds a pending request with the spec shape", () => {
  const record = createRequestRecord({
    item: { ...item, title: "Bosch Drill" },
    borrower: { id: "user-2", name: "Alex Mercer" },
    startDate: "2026-11-20",
    endDate: "2026-11-22",
    now: new Date("2026-11-10T09:30:00Z"),
    id: "req-test",
  });
  assert.equal(record.id, "req-test");
  assert.equal(record.itemId, "item-101");
  assert.equal(record.itemTitle, "Bosch Drill");
  assert.equal(record.borrowerId, "user-2");
  assert.equal(record.borrowerName, "Alex Mercer");
  assert.equal(record.ownerId, "user-1");
  assert.equal(record.depositAmount, 45);
  assert.equal(record.status, "Pending Approval");
  assert.equal(record.depositStatus, "Not Held");
  assert.equal(record.createdAt, "2026-11-10T09:30:00.000Z");
  for (const key of [
    "approvedAt",
    "rejectedAt",
    "expiredAt",
    "handedOverAt",
    "cancelledAt",
    "returnedAt",
    "inspectedAt",
  ]) {
    assert.equal(record[key], null, key);
  }
});

// ---------- deriveItemStatus (product spec §5.2) ----------

test("a paused item is Unavailable", () => {
  assert.equal(
    deriveItemStatus({ ...item, isManuallyPaused: true }, [], today),
    "Unavailable",
  );
});

test("an item with a disputed request is Unavailable", () => {
  const requests = [
    request({
      status: "Disputed",
      startDate: "2026-10-01",
      endDate: "2026-10-02",
    }),
  ];
  assert.equal(deriveItemStatus(item, requests, today), "Unavailable");
});

test("an active request covering today makes the item Reserved", () => {
  const requests = [
    request({
      status: "Active",
      startDate: "2026-11-09",
      endDate: "2026-11-11",
    }),
  ];
  assert.equal(deriveItemStatus(item, requests, today), "Reserved");
});

test("a pending request covering today leaves the item Available", () => {
  const requests = [
    request({ startDate: "2026-11-09", endDate: "2026-11-11" }),
  ];
  assert.equal(deriveItemStatus(item, requests, today), "Available");
});
