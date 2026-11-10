/**
 * Translation. Pure: no cookies, no DOM and no global language, so the
 * server, the browser and Node tests can all use it.
 *
 * The language is chosen for each request (the borrowbox_lang cookie, read
 * in serverI18n.ts). A server component gets its functions from
 * getI18n(); a client component gets `lang` from the server component
 * that draws it and calls createI18n(lang).
 */
import type { Lang } from "../types.ts";
import ar from "./ar.ts";
import en from "./en.ts";

/** One language's interface text: key -> text */
export type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Lang, Dictionary> = { en, ar };

/** The cookie that keeps the chosen language */
export const LANG_COOKIE = "borrowbox_lang";

/** Only the exact string "ar" selects Arabic; anything else is English */
export function parseLang(value: unknown): Lang {
  return value === "ar" ? "ar" : "en";
}

/**
 * Looks a key up in the given dictionaries: chosen language → English → the
 * key itself, so the result is never empty. "{name}" placeholders are filled
 * from values; a placeholder with no value stays as written.
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

export interface I18n {
  lang: Lang;
  /** Interface text. Plain text: show it with {value} in JSX, which React escapes. */
  t(key: string, values?: Record<string, unknown>): string;
  /**
   * Display text for a value from a fixed data list (category, status,
   * condition, role), e.g. tValue("status", "Available"). Data keeps the
   * English value; an unknown value is shown exactly as stored.
   */
  tValue(prefix: string, value: unknown): string;
  /** A deposit in whole US dollars with Western digits, e.g. "$45" */
  formatMoney(amount: unknown): string;
}

/** The translation functions for one language */
export function createI18n(lang: Lang): I18n {
  const t = (key: string, values?: Record<string, unknown>): string =>
    translate(DICTIONARIES, lang, key, values);
  return {
    lang,
    t,
    tValue(prefix, value) {
      if (value === null || value === undefined) return "";
      const key = `${prefix}.${value}`;
      const text = t(key);
      return text === key ? String(value) : text;
    },
    formatMoney(amount) {
      const value = Number(amount);
      return new Intl.NumberFormat(lang === "ar" ? "ar" : "en-US", {
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: 0,
        numberingSystem: "latn",
      }).format(Number.isFinite(value) ? value : 0);
    },
  };
}
