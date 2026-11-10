import { test } from "node:test";
import assert from "node:assert/strict";
import { readTestSwitches } from "../server/testSwitches.ts";

// The switches let the app be tested in every state by changing only
// API_BASE_URL: /api/delay/3000 (loading), /api/fail/500 (error),
// /api/empty (empty).

test("no switches: answer at once, with data, no failure", () => {
  assert.deepEqual(readTestSwitches("/api/items"), {
    delayMs: 0,
    empty: false,
    failStatus: null,
    pathname: "/api/items",
  });
});

test("the switches are removed from the path, on every endpoint", () => {
  assert.equal(
    readTestSwitches("/api/delay/3000/items/item-103").pathname,
    "/api/items/item-103",
  );
  assert.equal(
    readTestSwitches("/api/fail/500/requests").pathname,
    "/api/requests",
  );
  assert.equal(readTestSwitches("/api/empty/items").pathname, "/api/items");
});

test("delay is read in milliseconds and capped at 8000", () => {
  assert.equal(readTestSwitches("/api/delay/3000/items").delayMs, 3000);
  assert.equal(readTestSwitches("/api/delay/99999/items").delayMs, 8000);
  for (const bad of ["-5", "abc", "1.5"]) {
    const result = readTestSwitches(`/api/delay/${bad}/items`);
    assert.equal(result.delayMs, 0, bad);
    // Not a switch, so the path stays and the API answers 404
    assert.equal(result.pathname, `/api/delay/${bad}/items`, bad);
  }
});

test("fail accepts only error codes from 400 to 599", () => {
  assert.equal(readTestSwitches("/api/fail/500/items").failStatus, 500);
  assert.equal(readTestSwitches("/api/fail/404/items").failStatus, 404);
  for (const bad of ["200", "399", "600", "x"]) {
    assert.equal(
      readTestSwitches(`/api/fail/${bad}/items`).failStatus,
      null,
      bad,
    );
  }
});

test("empty asks for an empty list", () => {
  assert.equal(readTestSwitches("/api/empty/items").empty, true);
  assert.equal(readTestSwitches("/api/items").empty, false);
});

test("switches combine: slow, then broken", () => {
  assert.deepEqual(readTestSwitches("/api/delay/2000/fail/503/items"), {
    delayMs: 2000,
    empty: false,
    failStatus: 503,
    pathname: "/api/items",
  });
});
