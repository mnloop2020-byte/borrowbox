import { useSyncExternalStore } from "react";
import type { Lang } from "../types.ts";
import { getLang, subscribeLang } from "./i18n.ts";

/**
 * The current language. A component that calls it draws again when the
 * language changes. (i18n.ts itself has no React, so Node can test it.)
 */
export function useLang(): Lang {
  return useSyncExternalStore(subscribeLang, getLang);
}
