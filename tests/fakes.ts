/**
 * Test helpers shared by the test files (not a test file itself).
 */
import type { BorrowRequest, Item } from "../src/types.ts";

/** In-memory stand-in for localStorage; `data` lets a test look inside */
export function fakeStorage(
  initial: Record<string, string> = {},
): Storage & { data: Record<string, string> } {
  const data: Record<string, string> = { ...initial };
  return {
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = String(value);
    },
    removeItem: (key: string) => {
      delete data[key];
    },
    clear: () => {
      for (const key of Object.keys(data)) delete data[key];
    },
    key: (index: number) => Object.keys(data)[index] ?? null,
    get length() {
      return Object.keys(data).length;
    },
    data,
  };
}

const blocked = (): never => {
  throw new Error("blocked");
};

/** Storage that throws on every call, like Safari private mode used to */
export const throwingStorage: Storage = {
  getItem: blocked,
  setItem: blocked,
  removeItem: blocked,
  clear: blocked,
  key: blocked,
  get length(): number {
    return blocked();
  },
};

/**
 * Tests often pass incomplete or deliberately hostile data (an XSS status,
 * a bad id) to prove the code survives it. These casts say so out loud,
 * instead of loosening the app's real types.
 */
export const asItem = (data: object): Item => data as Item;
export const asRequest = (data: object): BorrowRequest => data as BorrowRequest;
