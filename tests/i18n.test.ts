import { test } from "node:test";
import assert from "node:assert/strict";

import en from "../src/i18n/en.ts";
import ar from "../src/i18n/ar.ts";
import {
  formatMoney,
  getLang,
  readStoredLang,
  saveLang,
  setLang,
  t,
  translate,
} from "../src/i18n/i18n.ts";
import { fakeStorage, makeItem, throwingStorage } from "./fakes.ts";

// ---------- Phase 1: stored language ----------

test("readStoredLang returns ar only for the exact value 'ar'", () => {
  assert.equal(readStoredLang(fakeStorage({ borrowbox_lang: "ar" })), "ar");
});

test("readStoredLang falls back to en for missing or invalid values", () => {
  for (const value of [undefined, "fr", "AR", "", '"ar"', "en"]) {
    const storage =
      value === undefined
        ? fakeStorage()
        : fakeStorage({ borrowbox_lang: value });
    assert.equal(readStoredLang(storage), "en", String(value));
  }
});

test("readStoredLang falls back to en when storage throws", () => {
  assert.equal(readStoredLang(throwingStorage), "en");
});

test("saveLang reports failure without throwing when storage throws", () => {
  assert.equal(saveLang("ar", throwingStorage), false);
  const storage = fakeStorage();
  assert.equal(saveLang("ar", storage), true);
  assert.equal(storage.data.borrowbox_lang, "ar");
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

test("setLang rejects invalid languages and falls back to en", () => {
  assert.equal(setLang("de"), "en");
  assert.equal(getLang(), "en");
  assert.equal(setLang("ar"), "ar");
  assert.equal(getLang(), "ar");
  assert.equal(t("nav.explore"), ar["nav.explore"]);
  setLang("en");
});

// ---------- Phase 8: money ----------

test("formatMoney in English uses a dollar sign and Western digits", () => {
  setLang("en");
  assert.equal(formatMoney(45), "$45");
  assert.equal(formatMoney(1234), "$1,234");
});

test("formatMoney in Arabic keeps Western digits", () => {
  setLang("ar");
  const text = formatMoney(45);
  assert.ok(text.includes("45"), text);
  assert.ok(text.includes("$"), text);
  assert.equal(/[٠-٩]/.test(text), false, text);
  setLang("en");
});

test("formatMoney treats non-numbers as 0", () => {
  setLang("en");
  assert.equal(formatMoney("abc"), "$0");
});

// ---------- Phase 5: display of fixed data values ----------

import { tValue } from "../src/i18n/i18n.ts";

test("tValue translates a known value and shows an unknown one as stored", () => {
  setLang("ar");
  assert.equal(tValue("status", "Available"), "متاح");
  assert.equal(tValue("condition", "Weird & new"), "Weird & new");
  assert.equal(tValue("condition", undefined), "");
  setLang("en");
  assert.equal(tValue("condition", "Like New"), "Like New");
});

// ---------- Phase 4: no hard-coded interface text ----------

import { readFileSync, readdirSync } from "node:fs";

test("views and components contain no hard-coded English interface text", () => {
  const files = [
    "src/main.ts",
    ...readdirSync("src/components").map((f) => `src/components/${f}`),
    ...readdirSync("src/views").map((f) => `src/views/${f}`),
  ];
  const ALLOWED = new Set(["BorrowBox"]); // brand name
  const patterns = [
    />\s*([A-Z][a-z]+(?:[ '][A-Za-z]+)*)\s*</g, // text between tags
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

import {
  CATEGORIES,
  categoryHref,
  categoryLabel,
} from "../src/content/categories.ts";
import { parseCatalogParams } from "../src/logic/validation.ts";
import { renderItemCard } from "../src/components/ItemCard.ts";

test("category data and URLs stay English in Arabic", () => {
  setLang("ar");
  assert.deepEqual(CATEGORIES, [
    "Power Tools",
    "Hand Tools",
    "Gardening",
    "Cleaning",
    "Camping",
    "Outdoor Equipment",
  ]);
  assert.equal(categoryHref("Power Tools"), "#/catalog?category=Power%20Tools");
  for (const name of CATEGORIES) {
    assert.equal(
      parseCatalogParams(`category=${encodeURIComponent(name)}`).category,
      name,
    );
  }
  assert.equal(categoryLabel("Power Tools"), "أدوات كهربائية");
  setLang("en");
});

test("an Arabic item card keeps its English link and status class", () => {
  setLang("ar");
  const html = renderItemCard(
    makeItem({
      id: "item-101",
      title: "Bosch Drill",
      category: "Power Tools",
      condition: "Excellent",
      depositAmount: 45,
      ownerName: "Sarah",
      status: "Available",
      imageUrl: "/a.png",
    }),
  );
  assert.ok(html.includes('href="#/item/item-101"'));
  assert.ok(html.includes("status-available"));
  assert.ok(html.includes("متاح"));
  assert.ok(html.includes("Bosch Drill"), "item title is not translated");
  setLang("en");
});
