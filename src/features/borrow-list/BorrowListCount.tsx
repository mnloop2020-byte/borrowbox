"use client";
import { use } from "react";
import type { ReactElement } from "react";
import { createI18n } from "../../shared/i18n/i18n.ts";
import type { Lang } from "../../shared/types.ts";
import { knownEntries, listCount } from "./borrowListRules.ts";
import { useBorrowList, useBorrowListReady } from "./useBorrowList.ts";

interface BorrowListCountProps {
  /** Every item id from the API (null when it failed), sent by the layout */
  itemIds: Promise<string[] | null>;
  lang: Lang;
}

/**
 * The number on the "My list" link. It counts only the rows the list page
 * can show, so the two always agree. use() waits for the item ids; the
 * Navbar draws it inside Suspense, so a slow API only delays this number.
 */
export function BorrowListCount({
  itemIds,
  lang,
}: BorrowListCountProps): ReactElement | null {
  const ids = use(itemIds);
  const list = useBorrowList();
  const ready = useBorrowListReady();
  if (!ready) return null;

  const count = ids
    ? knownEntries(
        list,
        ids.map((id) => ({ id })),
      ).length
    : listCount(list);
  const { t } = createI18n(lang);
  return (
    <>
      <span className="nav-list-count" aria-hidden="true">
        {count}
      </span>
      <span className="visually-hidden">{t("nav.listCount", { count })}</span>
    </>
  );
}
