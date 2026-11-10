/**
 * The language of the current request, for server components.
 * cache(): one cookie read per request, however many components ask.
 */
import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { createI18n, LANG_COOKIE, parseLang } from "./i18n.ts";
import type { I18n } from "./i18n.ts";

export const getI18n = cache(async (): Promise<I18n> => {
  const cookieStore = await cookies();
  return createI18n(parseLang(cookieStore.get(LANG_COOKIE)?.value));
});
