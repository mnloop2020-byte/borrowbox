"use client";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { createI18n } from "../../shared/i18n/i18n.ts";
import type { Lang } from "../../shared/types.ts";
import { itemCardData } from "../cards/itemCardData.ts";
import type { Item } from "../cards/types.ts";
import { MAX_DAYS } from "./borrowListRules.ts";
import { borrowListStore } from "./borrowListStore.ts";
import type { BorrowListEntry } from "./types.ts";

interface BorrowListRowProps {
  entry: BorrowListEntry;
  item: Item;
  lang: Lang;
  /** Called after a change that takes the row off the page */
  onRowRemoved: () => void;
}

/** One item in the list: photo, name, deposit, days (− and +) and Remove */
export function BorrowListRow({
  entry,
  item,
  lang,
  onRowRemoved,
}: BorrowListRowProps): ReactElement {
  const { t, formatMoney } = createI18n(lang);
  const card = itemCardData(item, formatMoney);
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
        <Image
          src={card.imageUrl}
          alt=""
          width={72}
          height={72}
          className="borrow-row-image"
        />
      )}
      <div className="borrow-row-info">
        <Link href={card.href} className="borrow-row-title">
          <bdi>{item.title}</bdi>
        </Link>
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
