/**
 * Borrow requests persisted in localStorage under "borrowbox_requests".
 */
import { getJSON, setJSON } from "./storage.js";

const REQUESTS_KEY = "borrowbox_requests";

/**
 * @param {Storage} [storage]
 * @returns {object[]} all saved requests; [] when nothing valid is stored
 */
export function getRequests(storage) {
  const value = getJSON(REQUESTS_KEY, [], storage);
  return Array.isArray(value) ? value : [];
}

/**
 * @param {object} record - a request built by createRequestRecord
 * @param {Storage} [storage]
 * @returns {boolean} false when it could not be saved
 */
export function addRequest(record, storage) {
  return setJSON(REQUESTS_KEY, [...getRequests(storage), record], storage);
}
