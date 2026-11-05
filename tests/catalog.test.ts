import { test } from "node:test";
import assert from "node:assert/strict";
import {
  categoriesFrom,
  filterItems,
  sortItems,
} from "../src/features/catalog/catalogFilter.ts";
import { parseCatalogParams } from "../src/features/catalog/catalogParams.ts";
import { ITEM_RECORDS } from "../src/features/cards/itemRecords.ts";
import { CATEGORIES } from "../src/features/cards/categories.ts";
import { isValidItemId } from "../src/features/cards/itemId.ts";
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

test("search ignores upper/lower case", () => {
  assert.deepEqual(ids(filterItems(items, { category: "", q: "DRILL" })), [
    "item-1",
  ]);
  assert.deepEqual(ids(filterItems(items, { category: "", q: "dome tent" })), [
    "item-2",
  ]);
});

test("search matches the item name only, not the description or category", () => {
  const screwdriver = makeItem({
    id: "item-3",
    title: "Compact Screwdriver",
    description: "Lighter than a drill.",
  });
  const list = [drill, tent, screwdriver];
  assert.deepEqual(ids(filterItems(list, { category: "", q: "drill" })), [
    "item-1",
  ]);
  assert.deepEqual(ids(filterItems(list, { category: "", q: "four" })), []);
  assert.deepEqual(ids(filterItems(list, { category: "", q: "camping" })), []);
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

// ---- Categories from the data

test("categories come from the items, once each, in first-seen order", () => {
  const list = [
    makeItem({ id: "item-1", category: "Camping" }),
    makeItem({ id: "item-2", category: "Gardening" }),
    makeItem({ id: "item-3", category: "Camping" }),
  ];
  assert.deepEqual(categoriesFrom(list), ["Camping", "Gardening"]);
  assert.deepEqual(categoriesFrom([]), []);
});

// ---- Sort

const ladder = makeItem({ id: "item-3", title: "ladder", depositAmount: 20 });
const axe = makeItem({ id: "item-4", title: "Axe", depositAmount: 60 });
const bike = makeItem({ id: "item-5", title: "Bike", depositAmount: 20 });
const unsorted = [ladder, axe, bike];

test("sort by name ignores upper/lower case", () => {
  assert.deepEqual(ids(sortItems(unsorted, "name")), [
    "item-4",
    "item-5",
    "item-3",
  ]);
});

test("sort by deposit, low to high and high to low; ties keep their order", () => {
  assert.deepEqual(ids(sortItems(unsorted, "deposit-asc")), [
    "item-3",
    "item-5",
    "item-4",
  ]);
  assert.deepEqual(ids(sortItems(unsorted, "deposit-desc")), [
    "item-4",
    "item-3",
    "item-5",
  ]);
});

test("sorting returns a copy and never changes the original array", () => {
  const before = ids(unsorted);
  const sorted = sortItems(unsorted, "name");
  assert.notEqual(sorted, unsorted, "a new array");
  assert.deepEqual(ids(unsorted), before, "original order untouched");
});

test('"default" brings back the original order after another sort', () => {
  sortItems(unsorted, "deposit-desc");
  assert.deepEqual(ids(sortItems(unsorted, "default")), [
    "item-3",
    "item-4",
    "item-5",
  ]);
});

test("search, category and sort work together", () => {
  const list = [
    makeItem({
      id: "item-1",
      title: "Rake",
      category: "Gardening",
      depositAmount: 30,
    }),
    makeItem({
      id: "item-2",
      title: "Hose Pro",
      category: "Gardening",
      depositAmount: 10,
    }),
    makeItem({
      id: "item-3",
      title: "Pro Tent",
      category: "Camping",
      depositAmount: 5,
    }),
    makeItem({
      id: "item-4",
      title: "Shears Pro",
      category: "Gardening",
      depositAmount: 50,
    }),
  ];
  const shown = sortItems(
    filterItems(list, { category: "Gardening", q: "PRO" }),
    "deposit-desc",
  );
  // Rake: no "pro" in its text. Tent: another category.
  assert.deepEqual(ids(shown), ["item-4", "item-2"]);
});

// ---- URL filters (untrusted input)

test("the URL sort is read, and an unknown sort becomes default", () => {
  assert.equal(parseCatalogParams("sort=name").sort, "name");
  assert.equal(parseCatalogParams("sort=deposit-desc").sort, "deposit-desc");
  assert.equal(parseCatalogParams("sort=<script>").sort, "default");
  assert.equal(parseCatalogParams("").sort, "default");
});
