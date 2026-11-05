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
 * Sends body as JSON with POST and waits for the answer.
 * The data is `unknown`: it comes from outside the app, so the caller checks it.
 */
export async function postJson(url: string, body: unknown): Promise<ApiResult> {
  const method = "POST";
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
