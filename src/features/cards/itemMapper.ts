/**
 * Turns what the API sends into the app's own Item (the mapper).
 * The answer comes from outside the app, so every field is checked here, in
 * one place, before any page uses it. Pure functions: no DOM and no fetch,
 * so Node can test them (tests/itemMapper.test.ts).
 */
import { isCategory } from "./categories.ts";
import { isValidItemId } from "./itemId.ts";
import { isItemStatus } from "./itemStatus.ts";
import type { Item } from "./types.ts";

/** The photo URL for an item id, or "" when it has none (cardPhotos.ts) */
export type PhotoUrl = (id: string) => string;

const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null;

/** Reads one field without `as`: Reflect.get works on any object */
const field = (value: object, key: string): unknown => Reflect.get(value, key);

const isText = (value: unknown): value is string => typeof value === "string";

/**
 * One API item to an app Item, with its photo.
 * @returns null when any field is missing or has the wrong type
 */
export function toItem(value: unknown, photoUrl: PhotoUrl): Item | null {
  if (!isObject(value)) return null;

  const id = field(value, "id");
  const title = field(value, "title");
  const category = field(value, "category");
  const description = field(value, "description");
  const condition = field(value, "condition");
  const conditionNotes = field(value, "conditionNotes");
  const depositAmount = field(value, "depositAmount");
  const ownerId = field(value, "ownerId");
  const ownerName = field(value, "ownerName");
  const ownerVerified = field(value, "ownerVerified");
  const ownerRating = field(value, "ownerRating");
  const status = field(value, "status");
  const isManuallyPaused = field(value, "isManuallyPaused");
  const createdAt = field(value, "createdAt");

  if (
    !isText(id) ||
    !isValidItemId(id) ||
    !isText(title) ||
    title.trim() === "" ||
    !isCategory(category) ||
    !isText(description) ||
    !isText(condition) ||
    !isText(conditionNotes) ||
    typeof depositAmount !== "number" ||
    !Number.isFinite(depositAmount) ||
    depositAmount < 0 ||
    !isText(ownerId) ||
    !isText(ownerName) ||
    typeof ownerVerified !== "boolean" ||
    typeof ownerRating !== "number" ||
    !isItemStatus(status) ||
    typeof isManuallyPaused !== "boolean" ||
    !isText(createdAt)
  ) {
    return null;
  }

  const photo = photoUrl(id);
  return {
    id,
    title,
    category,
    description,
    condition,
    conditionNotes,
    conditionImages: photo ? [photo] : [],
    depositAmount,
    ownerId,
    ownerName,
    ownerVerified,
    ownerRating,
    status,
    isManuallyPaused,
    imageUrl: photo,
    createdAt,
  };
}

/**
 * The answer of GET /api/items ({ items, total }) to a list of Items.
 * A bad item is left out, so one broken item cannot break the whole page.
 *
 * @returns null when the answer is not { items: [...] } at all
 */
export function toItems(data: unknown, photoUrl: PhotoUrl): Item[] | null {
  if (!isObject(data)) return null;
  const items = field(data, "items");
  if (!Array.isArray(items)) return null;
  return items.flatMap((value: unknown) => {
    const item = toItem(value, photoUrl);
    return item ? [item] : [];
  });
}
