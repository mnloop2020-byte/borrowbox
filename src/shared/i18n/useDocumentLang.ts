import { useSyncExternalStore } from "react";
import type { Lang } from "../types.ts";
import { parseLang } from "./i18n.ts";

const noChanges = (): (() => void) => () => {};

/**
 * The language of the page, read from <html lang>, which the server set.
 * Only for components Next.js draws without props from a server component
 * (error.tsx). It never changes on its own: a language switch draws the
 * whole page again.
 */
export function useDocumentLang(): Lang {
  return useSyncExternalStore(
    noChanges,
    () => parseLang(document.documentElement.lang),
    () => "en",
  );
}
