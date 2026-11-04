/**
 * Sends borrow requests to the API (POST /api/requests in server/index.ts).
 * Pages call sendBorrowRequest(); only this file knows the address.
 */
import { postJson } from "../../shared/api/client.ts";
import type { ApiResult } from "../../shared/api/client.ts";

/** Where requests go. Change it to "/api/fail/500" to test the error toast. */
const REQUESTS_URL = "/api/requests";

/** What the server needs for a new request */
export interface NewBorrowRequest {
  itemId: string;
  borrowerId: string;
  startDate: string;
  endDate: string;
}

export function sendBorrowRequest(
  request: NewBorrowRequest,
): Promise<ApiResult> {
  return postJson(REQUESTS_URL, request);
}
