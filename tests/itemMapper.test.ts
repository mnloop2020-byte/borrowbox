import { test } from "node:test";
import assert from "node:assert/strict";
import { toItem, toItems } from "../src/features/cards/itemMapper.ts";
import type { ApiItem } from "../src/features/cards/types.ts";
import { makeItem } from "./fakes.ts";

// What the server sends for one item (no photo fields)
const apiItem = (overrides: Partial<ApiItem> = {}): ApiItem => {
  const { imageUrl, conditionImages, ...fields } = makeItem();
  void imageUrl;
  void conditionImages;
  return { ...fields, ...overrides };
};
const photoUrl = (id: string): string => `/photos/${id}.webp`;

test("a valid API item becomes an app Item with its photo", () => {
  const item = toItem(apiItem({ id: "item-103" }), photoUrl);
  assert.deepEqual(item, {
    ...makeItem({ id: "item-103" }),
    imageUrl: "/photos/item-103.webp",
    conditionImages: ["/photos/item-103.webp"],
  });
});

test("an item without a photo gets no image", () => {
  const item = toItem(apiItem(), () => "");
  assert.equal(item?.imageUrl, "");
  assert.deepEqual(item?.conditionImages, []);
});

test("an item with a wrong or missing field is rejected (null)", () => {
  const broken: unknown[] = [
    apiItem({ category: "Gardenning" }), // not a Category
    apiItem({ status: "Lost" }), // not an ItemStatus
    apiItem({ id: "<img src=x>" }), // not a valid id
    apiItem({ title: "" }), // empty name
    { ...apiItem(), depositAmount: "45" }, // a string, not a number
    { ...apiItem(), ownerVerified: "yes" }, // not a boolean
    { ...apiItem(), title: undefined }, // missing
    null,
    "item-101",
  ];
  for (const value of broken) {
    assert.equal(toItem(value, photoUrl), null, JSON.stringify(value));
  }
});

test("toItems reads { items, total } and drops only the bad items", () => {
  const data: unknown = {
    items: [
      apiItem({ id: "item-101" }),
      { id: "item-102" },
      apiItem({ id: "item-103" }),
    ],
    total: 3,
  };
  const items = toItems(data, photoUrl);
  assert.deepEqual(
    items?.map((item) => item.id),
    ["item-101", "item-103"],
  );
});

test("toItems returns null when the answer is not a list of items", () => {
  for (const data of [null, [], {}, { items: "x" }, "oops"]) {
    assert.equal(toItems(data, photoUrl), null, JSON.stringify(data));
  }
});

test("an empty list is a valid answer, not an error", () => {
  assert.deepEqual(toItems({ items: [], total: 0 }, photoUrl), []);
});
