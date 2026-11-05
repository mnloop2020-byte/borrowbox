/**
 * The one API client: every call to the BorrowBox API (server/index.ts)
 * goes through this file, and it is the only place that calls fetch.
 * Features keep their own addresses, e.g. features/requests/requestsApi.ts.
 *
 * Because every request passes here, this is where problems are watched:
 * each failure is written to the Console as one line, e.g.
 *   [api] POST /api/requests failed: 500
 * Open DevTools > Console to see which request failed and why.
 *
 * Returns a result instead of throwing, like validateRequest() does, so the
 * caller must handle both cases.
 */

export type ApiResult =
  | { ok: true; data: unknown }
  /** status 0 means no usable answer: the server is down, offline, or the answer is not JSON */
  | { ok: false; status: number };

/**
 * Writes one line about a failed request. Only the method, address and
 * reason: never the body, which can hold personal data.
 */
function logFailure(
  method: string,
  url: string,
  reason: string | number,
): void {
  console.error(`[api] ${method} ${url} failed: ${reason}`);
}

/**
 * Where the API lives. The one place the address is written: every path
 * below is joined to it, e.g. "/items" -> "/api/items". During `npm run dev`
 * Vite forwards /api to the API server (vite.config.ts).
 */
export const BASE_URL = "/api";

/**
 * Sends one request and checks the answer. GET and POST both use it, so
 * every request is checked and logged the same way.
 */
async function requestJson(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<ApiResult> {
  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers:
        method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: method === "POST" ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws when there is no answer at all
    logFailure(method, url, "no connection");
    return { ok: false, status: 0 };
  }

  // A 4xx or 5xx answer still arrives, so check it here
  if (!res.ok) {
    logFailure(method, url, res.status);
    return { ok: false, status: res.status };
  }

  try {
    return { ok: true, data: await res.json() };
  } catch {
    logFailure(method, url, "the answer is not JSON");
    return { ok: false, status: 0 };
  }
}

/**
 * Gets JSON with GET, e.g. getJson("/items").
 * The data is `unknown`: it comes from outside the app, so the caller checks
 * it (for items: toItems() in features/cards/itemMapper.ts).
 */
export function getJson(path: string): Promise<ApiResult> {
  return requestJson("GET", path);
}

/**
 * Sends body as JSON with POST, e.g. postJson("/requests", request).
 * The data is `unknown`: it comes from outside the app, so the caller checks it.
 */
export function postJson(path: string, body: unknown): Promise<ApiResult> {
  return requestJson("POST", path, body);
}
