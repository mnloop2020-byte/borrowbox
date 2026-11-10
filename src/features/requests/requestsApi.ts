/**
 * Sends borrow requests to the API (POST /api/requests in server/index.ts).
 * Server only: the server action in actions.ts calls sendBorrowRequest(),
 * and only this file knows the path.
 */
import "server-only";
import { postJson } from "../../shared/api/client.ts";
import type { ApiResult } from "../../shared/api/client.ts";

/** Where requests go, after API_BASE_URL */
const REQUESTS_PATH = "/requests";

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
  return postJson(REQUESTS_PATH, request);
}
