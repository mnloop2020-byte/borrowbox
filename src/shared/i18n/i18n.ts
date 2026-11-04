/**
 * Language management and translation.
 *
 * Safe to import in Node: nothing here touches document or window at import
 * time, and every storage call is wrapped in try/catch.
 */
import type { Lang } from "../types.ts";
import ar from "./ar.ts";
import en from "./en.ts";

/** One language's interface text: key -> text */
export type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Lang, Dictionary> = { en, ar };
const LANG_KEY = "borrowbox_lang";

/**
 * @returns only the exact string "ar" selects Arabic
 */
function normalizeLang(value: unknown): Lang {
  return value === "ar" ? "ar" : "en";
}

/**
 * Reads the saved language. Missing, invalid or unreadable means English.
 */
export function readStoredLang(
  storage: Storage = globalThis.localStorage,
): Lang {
  try {
    return normalizeLang(storage.getItem(LANG_KEY));
  } catch {
    return "en";
  }
}

/**
 * Saves the language as a plain string ("en" or "ar").
 * @returns false when storage is blocked or full
 */
export function saveLang(
  lang: Lang,
  storage: Storage = globalThis.localStorage,
): boolean {
  try {
    storage.setItem(LANG_KEY, normalizeLang(lang));
    return true;
  } catch {
    return false;
  }
}

let currentLang: Lang = readStoredLang();

export function getLang(): Lang {
  return currentLang;
}

/**
 * Changes the language for the rest of the visit, saves it when possible,
 * updates <html lang dir> and tells the app to re-render.
 *
 * @returns the language actually set
 */
export function setLang(lang: unknown): Lang {
  currentLang = normalizeLang(lang);
  saveLang(currentLang);
  if (typeof document !== "undefined") {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("borrowbox:langchange", { detail: currentLang }),
    );
  }
  return currentLang;
}

/**
 * Looks a key up in the given dictionaries: chosen language → English → the
 * key itself, so the result is never empty. "{name}" placeholders are filled
 * from values; a placeholder with no value stays as written.
 *
 */
export function translate(
  dictionaries: { en: Dictionary; ar?: Dictionary },
  lang: Lang,
  key: string,
  values: Record<string, unknown> = {},
): string {
  const pick = (dict: Dictionary | undefined): string | null =>
    dict && typeof dict[key] === "string" && dict[key].trim() !== ""
      ? dict[key]
      : null;
  const text = pick(dictionaries[lang]) ?? pick(dictionaries.en) ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(values, name) ? String(values[name]) : match,
  );
}

/**
 * Interface text in the current language. The result is plain text: insert it
 * with textContent, or with escapeHtml() inside an HTML template.
 *
 */
export function t(key: string, values?: Record<string, unknown>): string {
  return translate(DICTIONARIES, currentLang, key, values);
}

/**
 * Display text for a value from a fixed data list (category, status,
 * condition, role). Data keeps the English value; a known value is
 * translated, an unknown one is shown exactly as stored.
 *
 * @param prefix - e.g. "status"
 * @param value - e.g. "Available"
 */
export function tValue(prefix: string, value: unknown): string {
  if (value === null || value === undefined) return "";
  const key = `${prefix}.${value}`;
  const text = t(key);
  return text === key ? String(value) : text;
}

/**
 * Formats a deposit in whole US dollars with Western digits in both languages.
 * @returns e.g. "$45" in English
 */
export function formatMoney(amount: unknown): string {
  const value = Number(amount);
  return new Intl.NumberFormat(currentLang === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(Number.isFinite(value) ? value : 0);
}
