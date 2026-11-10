"use server";
/**
 * Server action: switches the language. Next.js draws the page again after
 * the cookie changes, so <html lang dir> and every text follow it.
 */
import { cookies } from "next/headers";
import { LANG_COOKIE, parseLang } from "./i18n.ts";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** @param lang - from the browser; anything but "ar" means English */
export async function switchLanguage(lang: unknown): Promise<void> {
  (await cookies()).set(LANG_COOKIE, parseLang(lang), {
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
    path: "/",
  });
}
