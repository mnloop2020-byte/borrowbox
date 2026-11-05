/**
 * Test switches for GET /api/items, so every state of the app can be seen
 * without changing its code (the same idea as the ShopBoard API):
 *   /api/items?delay=3000   answers after 3 seconds (loading)
 *   /api/items?fail=500     answers with that error status (error)
 *   /api/items?empty=1      answers with no items (empty)
 * They combine, e.g. ?delay=2000&fail=503: slow, then broken.
 * Pure function: no server code, so Node can test it.
 */

const MAX_DELAY_MS = 8000;

export interface TestSwitches {
  /** 0 to 8000 */
  delayMs: number;
  empty: boolean;
  /** An error status from 400 to 599, or null for a normal answer */
  failStatus: number | null;
}

/** Reads the switches from a URL query. Anything invalid is ignored. */
export function readTestSwitches(params: URLSearchParams): TestSwitches {
  const delay = Number(params.get("delay"));
  const fail = Number(params.get("fail"));
  return {
    delayMs:
      Number.isInteger(delay) && delay > 0 ? Math.min(delay, MAX_DELAY_MS) : 0,
    empty: params.get("empty") === "1",
    failStatus:
      Number.isInteger(fail) && fail >= 400 && fail <= 599 ? fail : null,
  };
}
