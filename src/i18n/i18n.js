/**
 * Language management and translation (product spec §10).
 *
 * Safe to import in Node: nothing here touches document or window at import
 * time, and every storage call is wrapped in try/catch.
 */
import ar from "./ar.js";
import en from "./en.js";

const DICTIONARIES = { en, ar };
const LANG_KEY = "borrowbox_lang";

/**
 * @param {unknown} value
 * @returns {"en" | "ar"} only the exact string "ar" selects Arabic
 */
function normalizeLang(value) {
  return value === "ar" ? "ar" : "en";
}

/**
 * Reads the saved language. Missing, invalid or unreadable means English.
 * @param {Storage} [storage]
 * @returns {"en" | "ar"}
 */
export function readStoredLang(storage = globalThis.localStorage) {
  try {
    return normalizeLang(storage.getItem(LANG_KEY));
  } catch {
    return "en";
  }
}

/**
 * Saves the language as a plain string ("en" or "ar").
 * @param {"en" | "ar"} lang
 * @param {Storage} [storage]
 * @returns {boolean} false when storage is blocked or full
 */
export function saveLang(lang, storage = globalThis.localStorage) {
  try {
    storage.setItem(LANG_KEY, normalizeLang(lang));
    return true;
  } catch {
    return false;
  }
}

let currentLang = readStoredLang();

/** @returns {"en" | "ar"} */
export function getLang() {
  return currentLang;
}

/**
 * Changes the language for the rest of the visit, saves it when possible,
 * updates <html lang dir> and tells the app to re-render.
 *
 * @param {unknown} lang
 * @returns {"en" | "ar"} the language actually set
 */
export function setLang(lang) {
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
 * @param {{ en: object, ar?: object }} dictionaries
 * @param {"en" | "ar"} lang
 * @param {string} key
 * @param {Record<string, unknown>} [values]
 * @returns {string}
 */
export function translate(dictionaries, lang, key, values = {}) {
  const pick = (dict) =>
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
 * @param {string} key
 * @param {Record<string, unknown>} [values]
 * @returns {string}
 */
export function t(key, values) {
  return translate(DICTIONARIES, currentLang, key, values);
}

/**
 * Display text for a value from a fixed data list (category, status,
 * condition, role). Data keeps the English value; a known value is
 * translated, an unknown one is shown exactly as stored (spec §10.4).
 *
 * @param {string} prefix - e.g. "status"
 * @param {unknown} value - e.g. "Available"
 * @returns {string}
 */
export function tValue(prefix, value) {
  if (value === null || value === undefined) return "";
  const key = `${prefix}.${value}`;
  const text = t(key);
  return text === key ? String(value) : text;
}

/**
 * Formats a deposit in whole US dollars with Western digits in both languages.
 * @param {unknown} amount
 * @returns {string} e.g. "$45" in English
 */
export function formatMoney(amount) {
  const value = Number(amount);
  return new Intl.NumberFormat(currentLang === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(Number.isFinite(value) ? value : 0);
}
