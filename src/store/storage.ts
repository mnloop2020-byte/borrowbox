/**
 * Safe JSON access to localStorage.
 * Storage can be missing, full, blocked (private mode) or hold corrupt data;
 * none of those may crash the page, so every call is wrapped in try/catch.
 * The storage object is a parameter so tests can pass a fake one.
 */

/**
 * @param fallback - returned when the key is missing, unreadable or corrupt
 */
export function getJSON<T>(
  key: string,
  fallback: T,
  storage: Storage = globalThis.localStorage,
): T {
  try {
    const raw = storage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * @returns false when the value could not be saved
 */
export function setJSON(
  key: string,
  value: unknown,
  storage: Storage = globalThis.localStorage,
): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
