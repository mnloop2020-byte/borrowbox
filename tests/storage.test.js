import { test } from "node:test";
import assert from "node:assert/strict";

import { getJSON, setJSON } from "../src/store/storage.js";
import { addRequest, getRequests } from "../src/store/requestStore.js";

/** A minimal in-memory stand-in for window.localStorage */
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    data,
  };
}

/** Storage that throws on every call, like Safari private mode used to */
const brokenStorage = {
  getItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};

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
  addRequest({ id: "req-1" }, storage);
  addRequest({ id: "req-2" }, storage);
  assert.deepEqual(
    getRequests(storage).map((r) => r.id),
    ["req-1", "req-2"],
  );
});
