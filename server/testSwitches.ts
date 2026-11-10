/**
 * Test switches in the path, right after /api, so every state of the app
 * can be seen by changing only API_BASE_URL (the same idea as the ShopBoard
 * API):
 *   /api/delay/3000/items   answers after 3 seconds (loading)
 *   /api/fail/500/items     answers with that error status (error)
 *   /api/empty/items        answers with no items (empty)
 * They combine, e.g. /api/delay/2000/fail/503/items: slow, then broken.
 * Pure function: no server code, so Node can test it.
 */

const MAX_DELAY_MS = 8000;

export interface TestSwitches {
  /** 0 to 8000 */
  delayMs: number;
  empty: boolean;
  /** An error status from 400 to 599, or null for a normal answer */
  failStatus: number | null;
  /** The path without the switches, e.g. "/api/items" */
  pathname: string;
}

/**
 * Reads and removes the switches at the start of the path.
 * An invalid switch value (e.g. /api/fail/abc) is not a switch, so the
 * path is left as it is and the API answers 404.
 */
export function readTestSwitches(pathname: string): TestSwitches {
  const switches: TestSwitches = {
    delayMs: 0,
    empty: false,
    failStatus: null,
    pathname,
  };
  if (!pathname.startsWith("/api/")) return switches;

  const parts = pathname.slice("/api/".length).split("/");
  while (parts.length > 0) {
    const [name, value] = parts;
    const number = Number(value);
    if (name === "empty") {
      switches.empty = true;
      parts.splice(0, 1);
    } else if (name === "delay" && Number.isInteger(number) && number > 0) {
      switches.delayMs = Math.min(number, MAX_DELAY_MS);
      parts.splice(0, 2);
    } else if (
      name === "fail" &&
      Number.isInteger(number) &&
      number >= 400 &&
      number <= 599
    ) {
      switches.failStatus = number;
      parts.splice(0, 2);
    } else {
      break;
    }
  }
  switches.pathname = `/api/${parts.join("/")}`;
  return switches;
}
