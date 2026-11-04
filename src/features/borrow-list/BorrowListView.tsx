import { useRef } from "react";
import type { ReactElement } from "react";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { formatMoney, t } from "../../shared/i18n/i18n.ts";
import type { BorrowListEntry, Item } from "../../shared/types.ts";
import { itemCardData } from "../cards/itemCardData.ts";
import { listCards } from "../cards/listCards.ts";
import { MAX_DAYS, listCount } from "./borrowListRules.ts";
import { borrowListStore } from "./borrowListStore.ts";
import { useBorrowList } from "./useBorrowList.ts";

interface BorrowListRowProps {
  entry: BorrowListEntry;
  item: Item;
  /** Called after a change that takes the row off the page */
  onRowRemoved: () => void;
}

/** One item in the list: photo, name, deposit, days (− and +) and Remove */
function BorrowListRow({
  entry,
  item,
  onRowRemoved,
}: BorrowListRowProps): ReactElement {
  const card = itemCardData(item);
  const daysId = `days-${item.id}`;

  function decrease(): void {
    borrowListStore.decrease(item.id);
    // From 1 day, "−" removes the row together with the focused button
    if (entry.days === 1) onRowRemoved();
  }

  function remove(): void {
    borrowListStore.remove(item.id);
    onRowRemoved();
  }

  return (
    <li className="borrow-row">
      {card.imageUrl && (
        <img src={card.imageUrl} alt="" className="borrow-row-image" />
      )}
      <div className="borrow-row-info">
        <a href={card.href} className="borrow-row-title">
          <bdi>{item.title}</bdi>
        </a>
        <span className="borrow-row-deposit">
          {t("borrowList.deposit", { amount: card.deposit })}
        </span>
      </div>

      <div className="borrow-row-controls">
        <div className="days-stepper" role="group" aria-labelledby={daysId}>
          <span id={daysId} className="days-stepper-label">
            {t("borrowList.daysLabel")}
          </span>
          <button
            type="button"
            className="days-stepper-btn"
            aria-label={t("borrowList.fewerDays", { title: item.title })}
            onClick={decrease}
          >
            −
          </button>
          {/* <output> is read out by screen readers when the number changes */}
          <output className="days-stepper-value">{entry.days}</output>
          <button
            type="button"
            className="days-stepper-btn"
            aria-label={t("borrowList.moreDays", { title: item.title })}
            disabled={entry.days >= MAX_DAYS}
            onClick={() => borrowListStore.increase(item.id)}
          >
            +
          </button>
        </div>
        <button type="button" className="borrow-row-remove" onClick={remove}>
          {t("borrowList.remove")}
          <span className="visually-hidden">: {item.title}</span>
        </button>
      </div>
    </li>
  );
}

/**
 * "My borrow list" page (#/borrow-list): the cart. Change the days, remove
 * one item or clear all. The list is saved, so it survives a refresh.
 */
export function BorrowListView(): ReactElement {
  usePageTitle(t("title.borrowList"));
  const list = useBorrowList();
  // When the focused button disappears, focus goes to the heading, so
  // keyboard and screen-reader users are not lost at the top of the page
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = (): void => headingRef.current?.focus();

  const items = listCards();
  const rows = list.flatMap((entry) => {
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

      {rows.length === 0 ? (
        <div className="catalog-empty">
          <h2 className="catalog-empty-title">{t("borrowList.emptyTitle")}</h2>
          <p>{t("borrowList.emptyText")}</p>
          <a href="#/catalog" className="btn btn-primary">
            {t("borrowList.browse")}
          </a>
        </div>
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
                count: listCount(list),
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
