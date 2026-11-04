import { test } from "node:test";
import assert from "node:assert/strict";

import { readFileSync, readdirSync } from "node:fs";
import { isSafeImageUrl } from "../src/shared/lib/imageUrl.ts";
import { parseCatalogParams } from "../src/features/catalog/catalogParams.ts";
import { isValidItemId } from "../src/features/items/itemId.ts";
import { itemCardData } from "../src/features/items/itemCardData.ts";
import { makeItem } from "./fakes.ts";

// ---------- no HTML strings ----------

// React escapes every {value}, so text can never become HTML. These are the
// ways around that escaping; none of them may appear in the app.
test("no source file writes HTML strings into the page", () => {
  const files = readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
    .map((f) => `src/${f.replaceAll("\\", "/")}`);
  const found = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const name of [
      "dangerouslySetInnerHTML",
      "innerHTML",
      "outerHTML",
      "insertAdjacentHTML",
    ]) {
      if (source.includes(name)) found.push(`${file}: ${name}`);
    }
  }
  assert.ok(files.length > 20, "the scan found the source files");
  assert.deepEqual(found, []);
});

// ---------- isSafeImageUrl ----------

test("isSafeImageUrl accepts relative paths, https and inlined images", () => {
  assert.equal(isSafeImageUrl("/assets/drill.svg"), true);
  assert.equal(isSafeImageUrl("./photo.webp"), true);
  assert.equal(isSafeImageUrl("https://example.com/a.png"), true);
  assert.equal(isSafeImageUrl("data:image/svg+xml,%3Csvg%3E"), true);
});

test("isSafeImageUrl rejects script, html data and protocol-relative URLs", () => {
  assert.equal(isSafeImageUrl("javascript:alert(1)"), false);
  assert.equal(isSafeImageUrl(" JavaScript:alert(1)"), false);
  assert.equal(
    isSafeImageUrl("data:text/html,<script>alert(1)</script>"),
    false,
  );
  assert.equal(isSafeImageUrl("//evil.example/x.png"), false);
  assert.equal(isSafeImageUrl("http://example.com/a.png"), false);
  assert.equal(isSafeImageUrl(""), false);
  assert.equal(isSafeImageUrl(undefined), false);
});

// ---------- isValidItemId ----------

test("isValidItemId accepts the seed id format only", () => {
  assert.equal(isValidItemId("item-101"), true);
  assert.equal(isValidItemId("item-1"), true);
  assert.equal(isValidItemId("<b>x</b>"), false);
  assert.equal(isValidItemId('item-101"'), false);
  assert.equal(isValidItemId("item-1234567"), false);
  assert.equal(isValidItemId(""), false);
});

// ---------- parseCatalogParams ----------

test("parseCatalogParams keeps a known category and trims the query", () => {
  assert.deepEqual(parseCatalogParams("category=Gardening&q=%20drill%20"), {
    category: "Gardening",
    q: "drill",
    sort: "default",
  });
});

test("parseCatalogParams drops an unknown category", () => {
  assert.equal(
    parseCatalogParams("category=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E")
      .category,
    "",
  );
});

test("parseCatalogParams limits the query to 100 characters", () => {
  assert.equal(parseCatalogParams("q=" + "a".repeat(150)).q.length, 100);
});

// ---------- item cards ----------

// React escapes every text value it draws, so the card needs no escapeHtml().
// The checks left to us are in itemCardData(), tested here.

const baseItem = makeItem({
  id: "item-101",
  title: "Drill",
  category: "Power Tools",
  condition: "Excellent",
  depositAmount: 45,
  ownerName: "Sarah",
  ownerRating: 4.9,
  status: "Available",
  imageUrl: "/assets/drill.svg",
});

test("itemCardData drops an unsafe image URL", () => {
  assert.equal(
    itemCardData({ ...baseItem, imageUrl: "javascript:alert(1)" }).imageUrl,
    null,
  );
  assert.equal(itemCardData(baseItem).imageUrl, "/assets/drill.svg");
});

test("itemCardData keeps only known statuses", () => {
  const card = itemCardData(
    makeItem({
      ...baseItem,
      // @ts-expect-error: a hostile status from corrupted storage, outside ItemStatus
      status: 'x" onmouseover="alert(1)',
    }),
  );
  assert.equal(card.status, null);
  assert.equal(itemCardData(baseItem).status, "Available");
});

test("itemCardData sends an unsafe id to the catalog", () => {
  const card = itemCardData({ ...baseItem, id: '1" onclick="alert(1)' });
  assert.equal(card.href, "#/catalog");
  assert.equal(card.id, null);
  assert.equal(itemCardData(baseItem).href, "#/item/item-101");
});
