/**
 * The one API client: every call to the BorrowBox API (server/index.ts)
 * goes through this file, and it is the only place that calls fetch.
 * Features keep their own paths, e.g. features/cards/itemsApi.ts.
 *
 * It runs on the server only (server components and server actions), so the
 * API address stays out of the browser. Each failure is written to the
 * terminal as one line, e.g.
 *   [api] GET http://localhost:4000/api/items failed: 500
 *
 * Returns a result instead of throwing, so the caller must handle both cases.
 */
import "server-only";

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
 * Where the API lives, from API_BASE_URL in .env.local (see .env.example).
 * Every path is joined to it, e.g. "/items" -> ".../api/items". Adding a
 * test switch to it (".../api/delay/3000") changes every request.
 */
function baseUrl(): string {
  const url = process.env.API_BASE_URL;
  if (!url)
    throw new Error("API_BASE_URL is not set: copy .env.example to .env.local");
  return url.replace(/\/$/, "");
}

/**
 * Sends one request and checks the answer. GET and POST both use it, so
 * every request is checked and logged the same way.
 */
async function requestJson(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<ApiResult> {
  const url = `${baseUrl()}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      cache: "no-store",
      headers:
        method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: method === "POST" ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws when there is no answer at all
    logFailure(method, url, "no connection");
    return { ok: false, status: 0 };
  }

  // A 4xx or 5xx answer still arrives, so check it here. 404 is not logged:
  // "no such item" is an answer the page shows (not-found), not a failure.
  if (!res.ok) {
    if (res.status !== 404) logFailure(method, url, res.status);
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
