import { test } from "node:test";
import assert from "node:assert/strict";
import { filterItems } from "../src/features/catalog/catalogFilter.ts";
import { ITEM_RECORDS } from "../src/features/items/itemRecords.ts";
import { CATEGORIES } from "../src/features/items/categories.ts";
import { isValidItemId } from "../src/features/items/itemId.ts";
import { makeItem } from "./fakes.ts";

const drill = makeItem({
  id: "item-1",
  title: "Cordless Hammer Drill",
  category: "Power Tools",
  description: "18V drill with a hammer mode.",
});
const tent = makeItem({
  id: "item-2",
  title: "Dome Tent",
  category: "Camping",
  description: "Sleeps four.",
});
const items = [drill, tent];
const ids = (list: { id: string }[]): string[] => list.map((item) => item.id);

test("no filters show every item", () => {
  assert.deepEqual(ids(filterItems(items, { category: "", q: "" })), [
    "item-1",
    "item-2",
  ]);
});

test("a category keeps only its items", () => {
  assert.deepEqual(ids(filterItems(items, { category: "Camping", q: "" })), [
    "item-2",
  ]);
});

test("search ignores case and matches title, description or category", () => {
  assert.deepEqual(ids(filterItems(items, { category: "", q: "DRILL" })), [
    "item-1",
  ]);
  assert.deepEqual(ids(filterItems(items, { category: "", q: "four" })), [
    "item-2",
  ]);
  assert.deepEqual(ids(filterItems(items, { category: "", q: "camping" })), [
    "item-2",
  ]);
});

test("every search word must match, in any order", () => {
  assert.deepEqual(
    ids(filterItems(items, { category: "", q: "drill cordless" })),
    ["item-1"],
  );
  assert.deepEqual(
    ids(filterItems(items, { category: "", q: "cordless tent" })),
    [],
  );
});

test("category and search together", () => {
  assert.deepEqual(
    ids(filterItems(items, { category: "Camping", q: "drill" })),
    [],
  );
});

// The real item list: mistakes here would break cards, links and the API
test("every item has a unique valid id and a known category", () => {
  const seen = new Set<string>();
  for (const record of ITEM_RECORDS) {
    assert.ok(isValidItemId(record.id), `bad id ${record.id}`);
    assert.ok(!seen.has(record.id), `duplicate id ${record.id}`);
    seen.add(record.id);
    assert.ok(
      CATEGORIES.includes(record.category),
      `${record.id}: unknown category ${record.category}`,
    );
  }
});

test("every category has at least one item", () => {
  for (const category of CATEGORIES) {
    assert.ok(
      ITEM_RECORDS.some((record) => record.category === category),
      `no item in ${category}`,
    );
  }
});
