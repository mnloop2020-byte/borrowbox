import type { Metadata } from "next";
import type { ReactElement } from "react";
import { BorrowListView } from "../../features/borrow-list/BorrowListView.tsx";
import { getItems } from "../../features/cards/itemsApi.ts";
import { getI18n } from "../../shared/i18n/serverI18n.ts";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.borrowList") };
}

/**
 * /borrow-list. The server sends the item details; the list itself is in
 * the browser (Zustand, saved in localStorage), so BorrowListView is a
 * client component.
 */
export default async function BorrowListPage(): Promise<ReactElement> {
  const { lang } = await getI18n();
  return <BorrowListView items={await getItems()} lang={lang} />;
}
