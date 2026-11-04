import { test } from "node:test";
import assert from "node:assert/strict";

import { getJSON, setJSON } from "../src/shared/browser/storage.ts";
import {
  addRequest,
  getRequests,
} from "../src/features/requests/requestStore.ts";
import {
  fakeStorage,
  makeRequest,
  throwingStorage as brokenStorage,
} from "./fakes.ts";

test("setJSON then getJSON round-trips a value", () => {
  const storage = fakeStorage();
  assert.equal(setJSON("k", { a: 1 }, storage), true);
  assert.deepEqual(getJSON("k", null, storage), { a: 1 });
});

test("getJSON returns the fallback for a missing key", () => {
  assert.deepEqual(getJSON("missing", [], fakeStorage()), []);
});

test("getJSON returns the fallback for corrupt JSON", () => {
  const storage = fakeStorage({ k: "{not json" });
  assert.deepEqual(getJSON("k", [], storage), []);
});

test("blocked storage returns the fallback and writes report failure without throwing", () => {
  assert.deepEqual(getJSON("k", [], brokenStorage), []);
  assert.equal(setJSON("k", [1], brokenStorage), false);
});

test("getRequests returns [] when stored data is not an array", () => {
  const storage = fakeStorage({ borrowbox_requests: '{"oops":true}' });
  assert.deepEqual(getRequests(storage), []);
});

test("addRequest appends to the stored list", () => {
  const storage = fakeStorage();
  addRequest(makeRequest({ id: "req-1" }), storage);
  addRequest(makeRequest({ id: "req-2" }), storage);
  assert.deepEqual(
    getRequests(storage).map((r) => r.id),
    ["req-1", "req-2"],
  );
});
