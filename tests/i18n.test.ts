import { test } from "node:test";
import assert from "node:assert/strict";

import en from "../src/shared/i18n/en.ts";
import ar from "../src/shared/i18n/ar.ts";
import { createI18n, parseLang, translate } from "../src/shared/i18n/i18n.ts";
import { makeItem } from "./fakes.ts";

// ---------- Phase 1: the language from the cookie ----------

test("parseLang returns ar only for the exact value 'ar'", () => {
  assert.equal(parseLang("ar"), "ar");
  for (const value of [undefined, "fr", "AR", "", '"ar"', "en", 1]) {
    assert.equal(parseLang(value), "en", String(value));
  }
});

// ---------- Phase 2: dictionaries ----------

test("English and Arabic dictionaries have exactly the same keys", () => {
  const enKeys = Object.keys(en);
  const arKeys = Object.keys(ar);
  const missingInAr = enKeys.filter((k) => !(k in ar));
  const missingInEn = arKeys.filter((k) => !(k in en));
  assert.deepEqual(missingInAr, [], "missing in ar.ts");
  assert.deepEqual(missingInEn, [], "missing in en.ts");
});

test("no Arabic translation is empty", () => {
  const empty = Object.entries(ar)
    .filter(([, v]) => typeof v !== "string" || v.trim() === "")
    .map(([k]) => k);
  assert.deepEqual(empty, []);
});

test("no translation contains HTML", () => {
  const withTags = [...Object.entries(en), ...Object.entries(ar)]
    .filter(([, v]) => /<[a-z/!]/i.test(v))
    .map(([k]) => k);
  assert.deepEqual(withTags, []);
});

// ---------- Phase 2: translate / t ----------

const dicts = {
  en: { greet: "Hello {name}", onlyEn: "English only", empty: "Fallback" },
  ar: { greet: "مرحبا {name}", empty: "" },
};

test("translate fills in placeholders", () => {
  assert.equal(translate(dicts, "en", "greet", { name: "Alex" }), "Hello Alex");
  assert.equal(translate(dicts, "ar", "greet", { name: "Alex" }), "مرحبا Alex");
});

test("translate leaves a placeholder in place when its value is missing", () => {
  assert.equal(translate(dicts, "en", "greet"), "Hello {name}");
});

test("translate falls back to English for a missing or empty Arabic entry", () => {
  assert.equal(translate(dicts, "ar", "onlyEn"), "English only");
  assert.equal(translate(dicts, "ar", "empty"), "Fallback");
});

test("translate returns the key itself for an unknown key, never empty", () => {
  assert.equal(translate(dicts, "ar", "nope.missing"), "nope.missing");
});

test("createI18n translates in the language it was made for", () => {
  assert.equal(createI18n("ar").t("nav.explore"), ar["nav.explore"]);
  assert.equal(createI18n("en").t("nav.explore"), en["nav.explore"]);
});

// ---------- Phase 8: money ----------

test("formatMoney in English uses a dollar sign and Western digits", () => {
  const { formatMoney } = createI18n("en");
  assert.equal(formatMoney(45), "$45");
  assert.equal(formatMoney(1234), "$1,234");
});

test("formatMoney in Arabic keeps Western digits", () => {
  const text = createI18n("ar").formatMoney(45);
  assert.ok(text.includes("45"), text);
  assert.ok(text.includes("$"), text);
  assert.equal(/[٠-٩]/.test(text), false, text);
});

test("formatMoney treats non-numbers as 0", () => {
  assert.equal(createI18n("en").formatMoney("abc"), "$0");
});

// ---------- Phase 5: display of fixed data values ----------

test("tValue translates a known value and shows an unknown one as stored", () => {
  const { tValue } = createI18n("ar");
  assert.equal(tValue("status", "Available"), "متاح");
  assert.equal(tValue("condition", "Weird & new"), "Weird & new");
  assert.equal(tValue("condition", undefined), "");
  assert.equal(createI18n("en").tValue("condition", "Like New"), "Like New");
});

// ---------- Phase 4: no hard-coded interface text ----------

import { readFileSync, readdirSync } from "node:fs";

test("pages and UI code contain no hard-coded English interface text", () => {
  // Every .ts and .tsx file that renders HTML: the app frame, all features, shared UI
  const tsFilesIn = (dir: string): string[] =>
    readdirSync(dir, { recursive: true, encoding: "utf8" })
      .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
      .map((f) => `${dir}/${f.replaceAll("\\", "/")}`);
  const files = [
    ...tsFilesIn("src/app"),
    ...tsFilesIn("src/features"),
    ...tsFilesIn("src/shared/ui"),
  ];
  const ALLOWED = new Set(["BorrowBox"]); // brand name
  const patterns = [
    /(?<!=)>\s*([A-Z][a-z]+(?:[ '][A-Za-z]+)*)\s*</g, // text between tags (not the > of =>)
    /(?:aria-label|placeholder|alt|title)="([A-Z][a-z][^"$]*)"/g, // attributes
  ];
  const found = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        if (!ALLOWED.has(match[1].trim())) found.push(`${file}: ${match[1]}`);
      }
    }
  }
  assert.deepEqual(found, []);
});

// ---------- Phase 5: data and URLs stay English ----------

import { CATEGORIES, categoryHref } from "../src/features/cards/categories.ts";
import { parseCatalogParams } from "../src/features/catalog/catalogParams.ts";
import { itemCardData } from "../src/features/cards/itemCardData.ts";

test("category data and URLs stay English in Arabic", () => {
  assert.deepEqual(CATEGORIES, [
    "Power Tools",
    "Hand Tools",
    "Gardening",
    "Cleaning",
    "Camping",
    "Outdoor Equipment",
  ]);
  assert.equal(categoryHref("Power Tools"), "/catalog?category=Power+Tools");
  for (const name of CATEGORIES) {
    assert.equal(
      parseCatalogParams(`category=${encodeURIComponent(name)}`).category,
      name,
    );
  }
  assert.equal(
    createI18n("ar").tValue("category", "Power Tools"),
    "أدوات كهربائية",
  );
});

test("an Arabic item card keeps its English link and status class", () => {
  const { formatMoney, tValue } = createI18n("ar");
  const card = itemCardData(
    makeItem({
      id: "item-101",
      title: "Bosch Drill",
      category: "Power Tools",
      depositAmount: 45,
      status: "Available",
      imageUrl: "/a.png",
    }),
    formatMoney,
  );
  assert.equal(card.href, "/items/item-101");
  // ItemCard.tsx builds the class from this English value
  assert.equal(card.status, "Available");
  assert.equal(tValue("status", "Available"), "متاح");
});
