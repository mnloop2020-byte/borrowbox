import assert from "node:assert/strict";
import { test } from "node:test";
import { matchRoute } from "../src/app/routeMatcher.ts";

test("the home route keeps its supported hash forms", () => {
  assert.deepEqual(matchRoute(""), { name: "home" });
  assert.deepEqual(matchRoute("#"), { name: "home" });
  assert.deepEqual(matchRoute("#/"), { name: "home" });
});

test("static routes match exact paths and allow their query strings", () => {
  assert.deepEqual(matchRoute("#/catalog"), {
    name: "catalog",
    queryString: "",
  });
  assert.deepEqual(matchRoute("#/catalog?category=Camping&q=stove"), {
    name: "catalog",
    queryString: "category=Camping&q=stove",
  });
  assert.deepEqual(matchRoute("#/register"), { name: "register" });
  assert.deepEqual(matchRoute("#/list-item"), { name: "list-item" });
  assert.deepEqual(matchRoute("#/borrow-list"), { name: "borrow-list" });
  assert.deepEqual(matchRoute("#/dashboard"), { name: "dashboard" });
});

test("unknown static route prefixes go to not found", () => {
  for (const hash of [
    "#/catalog-extra",
    "#/register-old",
    "#/list-item-extra",
    "#/borrow-list-old",
    "#/dashboard-old",
    "#/unknown",
  ]) {
    assert.deepEqual(matchRoute(hash), { name: "not-found" }, hash);
  }
});

test("item routes require one valid item id segment", () => {
  assert.deepEqual(matchRoute("#/item/item-103"), {
    name: "item",
    itemId: "item-103",
  });
  assert.deepEqual(matchRoute("#/item/item-103?view=details"), {
    name: "item",
    itemId: "item-103",
  });

  for (const hash of [
    "#/item/",
    "#/item/not-an-id",
    "#/item/item-1234567",
    "#/item/item-103/extra",
  ]) {
    assert.deepEqual(matchRoute(hash), { name: "not-found" }, hash);
  }
});
