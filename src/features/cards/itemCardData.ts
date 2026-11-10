/**
 * The safe values an item card shows (ItemCard.tsx).
 * Pure: no DOM, so Node can test it (tests/security.test.ts).
 *
 * Every item field is treated as untrusted (items will later come from
 * localStorage and the List an Item form): the image URL and id are
 * checked, and only known statuses reach the class name.
 */
import type { I18n } from "../../shared/i18n/i18n.ts";
import { isSafeImageUrl } from "../../shared/lib/imageUrl.ts";
import type { Item, ItemStatus } from "./types.ts";
import { isValidItemId } from "./itemId.ts";
import { isItemStatus } from "./itemStatus.ts";

export interface ItemCardData {
  /** The item page, or the catalog when the id is not valid */
  href: string;
  /** The id for data-item-id, or null when it is not valid */
  id: string | null;
  /** null when the URL is not safe: the card then shows no image */
  imageUrl: string | null;
  /** null for an unknown status: the card then shows no badge */
  status: ItemStatus | null;
  /** null when there is no rating yet */
  rating: number | null;
  /** The deposit as money text, e.g. "$45" */
  deposit: string;
}

/** @param formatMoney - from the page's language (createI18n or getI18n) */
export function itemCardData(
  item: Item,
  formatMoney: I18n["formatMoney"],
): ItemCardData {
  const validId = isValidItemId(item.id);
  const rating = Number(item.ownerRating);
  return {
    href: validId ? `/items/${item.id}` : "/catalog",
    id: validId ? item.id : null,
    imageUrl: isSafeImageUrl(item.imageUrl) ? item.imageUrl : null,
    status: isItemStatus(item.status) ? item.status : null,
    rating: Number.isFinite(rating) && rating > 0 ? rating : null,
    deposit: formatMoney(item.depositAmount),
  };
}
