import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkoutSchema,
  endDate,
} from "../src/features/borrow-list/checkoutSchema.ts";
import { todayISO } from "../src/shared/lib/dates.ts";

const valid = {
  name: "Alex Mercer",
  phone: "+966 5012 3456",
  pickupDate: todayISO(),
  pickupMethod: "owner",
  agree: true,
};

/** The error code of each field that fails */
const errors = (values: unknown): Record<string, string> => {
  const result = checkoutSchema.safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
  );
};

test("a complete checkout passes", () => {
  assert.deepEqual(errors(valid), {});
});

test("each field has its own error code", () => {
  assert.deepEqual(
    errors({
      name: " a ",
      phone: "12ab",
      pickupDate: "2000-01-01",
      pickupMethod: "drone",
      agree: false,
    }),
    {
      name: "name",
      phone: "phone",
      pickupDate: "pastDate",
      pickupMethod: "method",
      agree: "agree",
    },
  );
  assert.equal(errors({ ...valid, pickupDate: "" }).pickupDate, "date");
});

test("the last day counts the pickup day as day one", () => {
  assert.equal(endDate("2026-11-10", 1), "2026-11-10");
  assert.equal(endDate("2026-11-29", 3), "2026-12-01");
});
