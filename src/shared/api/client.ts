/**
 * Talks to the BorrowBox API (server/index.ts).
 *
 * Returns a result instead of throwing, like validateRequest() does, so the
 * caller must handle both cases.
 */

/** The API addresses the app uses. Change one to "/api/fail/500" to test errors. */
export const API_URLS = {
  requests: "/api/requests",
};

export type ApiResult =
  | { ok: true; data: unknown }
  /** status 0 means no answer at all: the server is down or offline */
  | { ok: false; status: number };

/**
 * Sends body as JSON with POST and waits for the answer.
 * The data is `unknown`: it comes from outside the app, so the caller checks it.
 */
export async function postJson(url: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // fetch only fails on network errors; a 4xx or 5xx answer still arrives
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, data: await res.json() };
  } catch {
    // No connection, or an answer that is not JSON
    return { ok: false, status: 0 };
  }
}
