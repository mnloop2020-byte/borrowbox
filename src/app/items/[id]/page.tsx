import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { ItemDetail } from "../../../features/cards/ItemDetail.tsx";
import { isValidItemId } from "../../../features/cards/itemId.ts";
import { getItem } from "../../../features/cards/itemsApi.ts";
import type { Item } from "../../../features/cards/types.ts";
import { getI18n } from "../../../shared/i18n/serverI18n.ts";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

/**
 * The item for this URL, or null when there is none. An id in the wrong
 * format is not even sent to the API. getItem() is cached, so the title
 * and the page share one request.
 */
async function findItem(params: ItemPageProps["params"]): Promise<Item | null> {
  const { id } = await params;
  return isValidItemId(id) ? getItem(id) : null;
}

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const { t } = await getI18n();
  const item = await findItem(params);
  return {
    title: item
      ? t("title.item", { title: item.title })
      : t("title.itemNotFound"),
  };
}

/** /items/item-103: one item, loaded from GET /api/items/:id */
export default async function ItemPage({
  params,
}: ItemPageProps): Promise<ReactElement> {
  const item = await findItem(params);
  // An unknown id shows not-found.tsx
  if (!item) notFound();
  return <ItemDetail item={item} />;
}
