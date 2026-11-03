/**
 * Borrow requests persisted in localStorage under "borrowbox_requests".
 */
import type { BorrowRequest } from "../types.ts";
import { getJSON, setJSON } from "./storage.ts";

const REQUESTS_KEY = "borrowbox_requests";

/**
 * @returns all saved requests; [] when nothing valid is stored
 */
export function getRequests(storage?: Storage): BorrowRequest[] {
  const value = getJSON(REQUESTS_KEY, [], storage);
  return Array.isArray(value) ? value : [];
}

/**
 * @param record - a request built by createRequestRecord
 * @returns false when it could not be saved
 */
export function addRequest(record: BorrowRequest, storage?: Storage): boolean {
  return setJSON(REQUESTS_KEY, [...getRequests(storage), record], storage);
}
