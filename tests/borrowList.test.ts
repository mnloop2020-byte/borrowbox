import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_DAYS,
  addToList,
  decreaseDays,
  increaseDays,
  listCount,
  parseBorrowList,
  removeFromList,
} from "../src/features/borrow-list/borrowListRules.ts";
import {
  KNOWN_ITEM_IDS,
  createBorrowListStore,
} from "../src/features/borrow-list/borrowListStore.ts";
import { ITEM_RECORDS } from "../src/features/items/itemRecords.ts";
import type { BorrowListEntry } from "../src/shared/types.ts";
import { fakeStorage, throwingStorage } from "./fakes.ts";

const entry = (itemId: string, days: number): BorrowListEntry => ({
  itemId,
  days,
});

// ---- Rules (pure)

test("adding a new item puts it at the end with 1 day", () => {
  const list = addToList([entry("item-1", 2)], "item-2");
  assert.deepEqual(list, [entry("item-1", 2), entry("item-2", 1)]);
});

test("adding an item already in the list adds a day, not a second row", () => {
  assert.deepEqual(addToList([entry("item-1", 2)], "item-1"), [
    entry("item-1", 3),
  ]);
});

test("increase adds one day, up to MAX_DAYS", () => {
  assert.deepEqual(increaseDays([entry("item-1", 1)], "item-1"), [
    entry("item-1", 2),
  ]);
  assert.deepEqual(increaseDays([entry("item-1", MAX_DAYS)], "item-1"), [
    entry("item-1", MAX_DAYS),
  ]);
});

test("decrease takes one day away, and decreasing from 1 removes the item", () => {
  const list = [entry("item-1", 2), entry("item-2", 1)];
  assert.deepEqual(decreaseDays(list, "item-1"), [
    entry("item-1", 1),
    entry("item-2", 1),
  ]);
  assert.deepEqual(decreaseDays(list, "item-2"), [entry("item-1", 2)]);
});

test("remove takes out one item and keeps the others in order", () => {
  const list = [entry("item-1", 1), entry("item-2", 3), entry("item-3", 1)];
  assert.deepEqual(removeFromList(list, "item-2"), [
    entry("item-1", 1),
    entry("item-3", 1),
  ]);
});

test("the rules never change the list passed in", () => {
  const list = [entry("item-1", 2)];
  addToList(list, "item-1");
  addToList(list, "item-2");
  increaseDays(list, "item-1");
  decreaseDays(list, "item-1");
  removeFromList(list, "item-1");
  assert.deepEqual(list, [entry("item-1", 2)]);
});

test("the count is the number of items in the list", () => {
  assert.equal(listCount([]), 0);
  assert.equal(listCount([entry("item-1", 3), entry("item-2", 1)]), 2);
});

// ---- Saved data is untrusted

test("parseBorrowList keeps only valid entries", () => {
  const saved: unknown = [
    { itemId: "item-1", days: 2 },
    { itemId: "<img src=x>", days: 1 }, // bad id
    { itemId: "item-2", days: 0 }, // too few days
    { itemId: "item-3", days: MAX_DAYS + 1 }, // too many days
    { itemId: "item-4", days: 1.5 }, // not a whole number
    { itemId: "item-5", days: "2" }, // not a number
    { itemId: "item-1", days: 4 }, // duplicate: the first one wins
    null,
    "item-6",
  ];
  assert.deepEqual(parseBorrowList(saved), [entry("item-1", 2)]);
});

test("parseBorrowList returns [] for anything that is not a list", () => {
  for (const value of [null, undefined, {}, "x", 42]) {
    assert.deepEqual(parseBorrowList(value), []);
  }
});

// ---- Store: saving, the count and listeners

test("the list is still there after a refresh (a new store, same storage)", () => {
  const storage = fakeStorage();
  const before = createBorrowListStore(storage);
  before.add("item-1");
  before.add("item-2");
  before.increase("item-2");

  const afterRefresh = createBorrowListStore(storage);
  assert.deepEqual(afterRefresh.getList(), [
    entry("item-1", 1),
    entry("item-2", 2),
  ]);
});

test("the count is correct after every action", () => {
  const storage = fakeStorage();
  const store = createBorrowListStore(storage);
  const count = (): number => listCount(store.getList());
  assert.equal(count(), 0);
  store.add("item-1");
  assert.equal(count(), 1);
  store.add("item-2");
  assert.equal(count(), 2);
  store.add("item-2"); // same item: one more day, not one more item
  assert.equal(count(), 2);
  store.increase("item-1");
  assert.equal(count(), 2);
  store.decrease("item-1"); // 2 days -> 1 day
  assert.equal(count(), 2);
  store.decrease("item-1"); // 1 day -> removed
  assert.equal(count(), 1);
  store.remove("item-2");
  assert.equal(count(), 0);
  store.add("item-3");
  store.add("item-4");
  store.clear();
  assert.equal(count(), 0);
  assert.deepEqual(createBorrowListStore(storage).getList(), [], "saved too");
});

test("getList returns the same array until the list changes", () => {
  // useSyncExternalStore needs this, or React draws forever
  const store = createBorrowListStore(fakeStorage());
  const first = store.getList();
  assert.equal(store.getList(), first);
  store.add("item-1");
  const second = store.getList();
  assert.notEqual(second, first);
  assert.equal(store.getList(), second);
});

test("one add is one item, even after many subscribe/unsubscribe cycles", () => {
  // Like changing the catalog filter many times: each change draws the
  // cards again, and each one subscribes and unsubscribes.
  const store = createBorrowListStore(fakeStorage());
  let staleCalls = 0;
  for (let i = 0; i < 20; i++) {
    const stop = store.subscribe(() => staleCalls++);
    stop();
  }
  let calls = 0;
  const stop = store.subscribe(() => calls++);
  store.add("item-1");
  stop();
  assert.equal(staleCalls, 0, "old listeners are really gone");
  assert.equal(calls, 1, "one listener call per add");
  assert.deepEqual(store.getList(), [entry("item-1", 1)]);
});

test("a broken or blocked storage never crashes the list", () => {
  const corrupt = createBorrowListStore(
    fakeStorage({ borrowbox_borrow_list: "{not json" }),
  );
  assert.deepEqual(corrupt.getList(), []);

  const blocked = createBorrowListStore(throwingStorage);
  assert.deepEqual(blocked.getList(), []);
  blocked.add("item-1"); // cannot be saved, but still works on this page
  assert.deepEqual(blocked.getList(), [entry("item-1", 1)]);
});

test("items that do not exist are dropped, so the count matches the page", () => {
  const known = new Set(["item-1"]);
  const saved: unknown = [entry("item-1", 1), entry("item-999", 2)];
  assert.deepEqual(parseBorrowList(saved, known), [entry("item-1", 1)]);

  const storage = fakeStorage({ borrowbox_borrow_list: JSON.stringify(saved) });
  const store = createBorrowListStore(storage, known);
  assert.equal(listCount(store.getList()), 1);
});

test("the app's list knows the real items", () => {
  const storage = fakeStorage({
    borrowbox_borrow_list: JSON.stringify([entry(ITEM_RECORDS[0].id, 1)]),
  });
  assert.equal(
    listCount(createBorrowListStore(storage, KNOWN_ITEM_IDS).getList()),
    1,
  );
  assert.ok(KNOWN_ITEM_IDS.has(ITEM_RECORDS[0].id));
  assert.equal(KNOWN_ITEM_IDS.size, ITEM_RECORDS.length);
});
