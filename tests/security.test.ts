import { test } from "node:test";
import assert from "node:assert/strict";

import { escapeHtml, isSafeImageUrl } from "../src/shared/lib/html.ts";
import { parseCatalogParams } from "../src/features/catalog/catalogParams.ts";
import { isValidItemId } from "../src/features/items/itemId.ts";
import { renderItemCard } from "../src/features/items/itemCardHtml.ts";
import { makeItem } from "./fakes.ts";

// ---------- escapeHtml ----------

test("escapeHtml escapes all five HTML-special characters", () => {
  assert.equal(
    escapeHtml(`<a href="x" title='y'>&</a>`),
    "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
  );
});

test("escapeHtml escapes & first, so existing entities are not left active", () => {
  assert.equal(escapeHtml("&lt;"), "&amp;lt;");
});

test("escapeHtml turns non-strings into text", () => {
  assert.equal(escapeHtml(42), "42");
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
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

// ---------- renderItemCard ----------

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

test("renderItemCard escapes text fields, including inside attributes", () => {
  const html = renderItemCard({
    ...baseItem,
    title: '"><img src=x onerror=alert(1)>',
    ownerName: "<script>alert(1)</script>",
  });
  assert.equal(html.includes("<img src=x"), false);
  assert.equal(html.includes("<script>"), false);
  assert.ok(html.includes("&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"));
});

test("renderItemCard drops an unsafe image URL", () => {
  const html = renderItemCard({ ...baseItem, imageUrl: "javascript:alert(1)" });
  assert.equal(html.includes("javascript:"), false);
});

test("renderItemCard only uses known statuses in the class name", () => {
  const html = renderItemCard(
    makeItem({
      ...baseItem,
      // @ts-expect-error: a hostile status from corrupted storage, outside ItemStatus
      status: 'x" onmouseover="alert(1)',
    }),
  );
  assert.equal(html.includes("onmouseover="), false);
});

test("renderItemCard rejects an unsafe item id in the link", () => {
  const html = renderItemCard({ ...baseItem, id: '1" onclick="alert(1)' });
  assert.equal(html.includes("onclick="), false);
});

// ---------- itemCardData (the checks the React card relies on) ----------

import { itemCardData } from "../src/features/items/itemCardData.ts";

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
