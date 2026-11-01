/**
 * Safe JSON access to localStorage (product spec §8.1).
 * Storage can be missing, full, blocked (private mode) or hold corrupt data;
 * none of those may crash the page, so every call is wrapped in try/catch.
 * The storage object is a parameter so tests can pass a fake one.
 */

/**
 * @template T
 * @param {string} key
 * @param {T} fallback - returned when the key is missing, unreadable or corrupt
 * @param {Storage} [storage]
 * @returns {T}
 */
export function getJSON(key, fallback, storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 * @param {Storage} [storage]
 * @returns {boolean} false when the value could not be saved
 */
export function setJSON(key, value, storage = globalThis.localStorage) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
