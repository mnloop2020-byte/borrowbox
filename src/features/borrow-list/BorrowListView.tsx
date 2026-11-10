"use client";
import Link from "next/link";
import { useRef } from "react";
import type { ReactElement } from "react";
import { createI18n } from "../../shared/i18n/i18n.ts";
import type { Lang } from "../../shared/types.ts";
import { EmptyState } from "../../shared/ui/EmptyState.tsx";
import { LoadingState } from "../../shared/ui/LoadingState.tsx";
import type { Item } from "../cards/types.ts";
import { BorrowListRow } from "./BorrowListRow.tsx";
import { MAX_DAYS, knownEntries } from "./borrowListRules.ts";
import { borrowListStore } from "./borrowListStore.ts";
import { useBorrowList, useBorrowListReady } from "./useBorrowList.ts";

interface BorrowListViewProps {
  /** Every item from the API: the name, photo and deposit of each row */
  items: Item[];
  lang: Lang;
}

/**
 * "My borrow list" (/borrow-list): the cart. Change the days, remove one
 * item or clear all. The list is saved in the browser, so it survives a
 * refresh; the item details come from the API through the page.
 */
export function BorrowListView({
  items,
  lang,
}: BorrowListViewProps): ReactElement {
  const { t, formatMoney } = createI18n(lang);
  const list = useBorrowList();
  const ready = useBorrowListReady();
  // When the focused button disappears, focus goes to the heading, so
  // keyboard and screen-reader users are not lost at the top of the page
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = (): void => headingRef.current?.focus();

  const rows = knownEntries(list, items).flatMap((entry) => {
    const item = items.find((candidate) => candidate.id === entry.itemId);
    return item ? [{ entry, item }] : [];
  });
  const totalDays = rows.reduce((sum, row) => sum + row.entry.days, 0);
  const totalDeposit = rows.reduce(
    (sum, row) => sum + row.item.depositAmount,
    0,
  );

  return (
    <section className="borrow-list-view" aria-labelledby="page-title">
      <h1
        id="page-title"
        className="borrow-list-title"
        ref={headingRef}
        tabIndex={-1}
      >
        {t("borrowList.title")}
      </h1>
      <p className="borrow-list-intro">
        {t("borrowList.intro", { max: MAX_DAYS })}
      </p>

      {!ready ? (
        <LoadingState label={t("borrowList.loading")} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("borrowList.emptyTitle")}
          text={t("borrowList.emptyText")}
          action={
            <Link href="/catalog" className="btn btn-primary">
              {t("borrowList.browse")}
            </Link>
          }
        />
      ) : (
        <>
          <ul className="borrow-list">
            {rows.map(({ entry, item }) => (
              <BorrowListRow
                key={entry.itemId}
                entry={entry}
                item={item}
                lang={lang}
                onRowRemoved={focusHeading}
              />
            ))}
          </ul>
          <div className="borrow-list-summary">
            <p className="borrow-list-total">
              {t("borrowList.summary", {
                count: rows.length,
                days: totalDays,
                deposit: formatMoney(totalDeposit),
              })}
            </p>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                borrowListStore.clear();
                focusHeading();
              }}
            >
              {t("borrowList.clear")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
