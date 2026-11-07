import assert from "node:assert/strict";
import { test } from "node:test";
import type { BorrowRequest } from "../src/features/requests/types.ts";
import { createBorrowRequestSchema } from "../src/features/requests/borrowRequestSchema.ts";
import { makeItem, makeRequest } from "./fakes.ts";

const item = makeItem({ id: "item-101", ownerId: "user-1" });
const validDates = { startDate: "2026-11-20", endDate: "2026-11-22" };

function request(overrides: Partial<BorrowRequest> = {}): BorrowRequest {
  return makeRequest({
    itemId: item.id,
    borrowerId: "user-3",
    startDate: "2026-11-20",
    endDate: "2026-11-22",
    status: "Pending Approval",
    ...overrides,
  });
}

function makeSchema(
  context: {
    borrowerId?: string;
    requests?: BorrowRequest[];
    today?: string;
  } = {},
) {
  return createBorrowRequestSchema(() => ({
    item,
    borrowerId: context.borrowerId ?? "user-2",
    requests: context.requests ?? [],
    today: context.today ?? "2026-11-10",
  }));
}

test("Zod schema accepts valid dates", () => {
  assert.equal(makeSchema().safeParse(validDates).success, true);
});

test("Zod schema maps missing start date to its field", () => {
  const result = makeSchema().safeParse({ startDate: "", endDate: "" });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.issues[0]?.path, ["startDate"]);
    assert.equal(result.error.issues[0]?.message, "missing-dates");
  }
});

test("Zod schema maps a past start date to its field", () => {
  const result = makeSchema().safeParse({
    startDate: "2026-11-09",
    endDate: "2026-11-11",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.issues[0]?.path, ["startDate"]);
    assert.equal(result.error.issues[0]?.message, "start-in-past");
  }
});

test("Zod schema maps an end date before start to its field", () => {
  const result = makeSchema().safeParse({
    startDate: "2026-11-22",
    endDate: "2026-11-20",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.issues[0]?.path, ["endDate"]);
    assert.equal(result.error.issues[0]?.message, "end-before-start");
  }
});

test("Zod schema maps duplicate pending requests to the form error", () => {
  const result = makeSchema({
    requests: [request({ borrowerId: "user-2" })],
  }).safeParse(validDates);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.issues[0]?.path, ["root", "request"]);
    assert.equal(result.error.issues[0]?.message, "duplicate-pending");
  }
});

test("Zod schema maps overlapping active or pending requests to the form", () => {
  for (const status of ["Active", "Pending Approval"]) {
    const result = makeSchema({
      requests: [request({ status, borrowerId: "another-user" })],
    }).safeParse(validDates);
    assert.equal(result.success, false, status);
    if (!result.success) {
      assert.equal(result.error.issues[0]?.message, "overlap", status);
    }
  }
});

test("Zod schema keeps non-overlapping and released dates available", () => {
  const requests = [
    request({ startDate: "2026-11-01", endDate: "2026-11-02" }),
    request({ status: "Rejected" }),
    request({ itemId: "item-102" }),
  ];
  assert.equal(makeSchema({ requests }).safeParse(validDates).success, true);
});

test("schema reads changing validation context when each validation runs", () => {
  let today = "2026-11-10";
  let requests: BorrowRequest[] = [];
  const schema = createBorrowRequestSchema(() => ({
    item,
    borrowerId: "user-2",
    requests,
    today,
  }));

  assert.equal(schema.safeParse(validDates).success, true);
  requests = [request({ borrowerId: "user-2" })];
  assert.equal(schema.safeParse(validDates).success, false);
  requests = [];
  today = "2026-11-21";
  assert.equal(schema.safeParse(validDates).success, false);
});
