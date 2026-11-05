import { test } from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, isCategory } from "../src/features/cards/categories.ts";
import type { Category } from "../src/features/cards/categories.ts";
import type { Item } from "../src/features/cards/types.ts";
import { makeItem } from "./fakes.ts";

// ---- At runtime: values from the URL or localStorage are checked

test("isCategory accepts every real category", () => {
  for (const name of CATEGORIES) assert.equal(isCategory(name), true, name);
});

test("isCategory rejects typos, other case and non-strings", () => {
  for (const value of ["Gardenning", "camping", "", " Camping", null, 42]) {
    assert.equal(isCategory(value), false, String(value));
  }
});

// ---- At compile time: `npm run typecheck` checks these lines.
// A "ts-expect-error" comment makes tsc fail if the next line has NO error,
// so these prove that a typo in a category is a TypeScript error.

test("a typo in a category is a TypeScript error", () => {
  // @ts-expect-error "Gardenning" is not a Category
  const typo: Category = "Gardenning";
  // @ts-expect-error an item with a misspelled category does not compile
  const item: Item = makeItem({ category: "Power tools" });
  const ok: Category = "Gardening";
  assert.ok(typo && item && ok);
});
