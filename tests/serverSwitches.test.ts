import { test } from "node:test";
import assert from "node:assert/strict";
import { readTestSwitches } from "../server/testSwitches.ts";

// The switches let the app be tested in every state:
// /api/items?delay=3000 (loading), ?fail=500 (error), ?empty=1 (empty).

const read = (query: string) => readTestSwitches(new URLSearchParams(query));

test("no switches: answer at once, with data, no failure", () => {
  assert.deepEqual(read(""), { delayMs: 0, empty: false, failStatus: null });
});

test("delay is read in milliseconds and capped at 8000", () => {
  assert.equal(read("delay=3000").delayMs, 3000);
  assert.equal(read("delay=99999").delayMs, 8000);
  for (const bad of ["-5", "abc", "1.5", ""]) {
    assert.equal(read(`delay=${bad}`).delayMs, 0, bad);
  }
});

test("fail accepts only error codes from 400 to 599", () => {
  assert.equal(read("fail=500").failStatus, 500);
  assert.equal(read("fail=404").failStatus, 404);
  for (const bad of ["200", "399", "600", "x"]) {
    assert.equal(read(`fail=${bad}`).failStatus, null, bad);
  }
});

test("empty=1 asks for an empty list", () => {
  assert.equal(read("empty=1").empty, true);
  assert.equal(read("empty=0").empty, false);
});

test("switches combine: slow, then broken", () => {
  assert.deepEqual(read("delay=2000&fail=503"), {
    delayMs: 2000,
    empty: false,
    failStatus: 503,
  });
});
