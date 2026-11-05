import { useRef } from "react";
import type { ReactElement } from "react";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { formatMoney, t } from "../../shared/i18n/i18n.ts";
import { EmptyState } from "../../shared/ui/EmptyState.tsx";
import { ItemsStatus } from "../cards/ItemsStatus.tsx";
import { listCards } from "../cards/listCards.ts";
import { useItems } from "../cards/useItems.ts";
import { BorrowListRow } from "./BorrowListRow.tsx";
import { MAX_DAYS, knownEntries } from "./borrowListRules.ts";
import { borrowListStore } from "./borrowListStore.ts";
import { useBorrowList } from "./useBorrowList.ts";

/**
 * "My borrow list" page (#/borrow-list): the cart. Change the days, remove
 * one item or clear all. The list is saved, so it survives a refresh. The
 * item details (name, photo, deposit) come from the API.
 */
export function BorrowListView(): ReactElement {
  usePageTitle(t("title.borrowList"));
  const list = useBorrowList();
  // When the focused button disappears, focus goes to the heading, so
  // keyboard and screen-reader users are not lost at the top of the page
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = (): void => headingRef.current?.focus();

  const state = useItems();
  const items = state.status === "success" ? listCards(state.items) : [];
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

      {state.status !== "success" ? (
        <ItemsStatus state={state} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("borrowList.emptyTitle")}
          text={t("borrowList.emptyText")}
          action={
            <a href="#/catalog" className="btn btn-primary">
              {t("borrowList.browse")}
            </a>
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
