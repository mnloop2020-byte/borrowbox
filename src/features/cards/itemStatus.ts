import type { ItemStatus } from "./types.ts";

/** Every status an item can have */
const ITEM_STATUSES: readonly string[] = [
  "Available",
  "Reserved",
  "Unavailable",
] satisfies ItemStatus[];

/** True for one of the statuses. A type guard, so no `as` is needed. */
export function isItemStatus(value: unknown): value is ItemStatus {
  return typeof value === "string" && ITEM_STATUSES.includes(value);
}
