"use server";
/**
 * Server action: sends one borrow request per item in the list. It checks
 * the form again with the same schema and the list with parseBorrowList(),
 * because everything from the browser is untrusted.
 */
import { sendBorrowRequest } from "../requests/requestsApi.ts";
import { getCurrentUser } from "../users/currentUser.ts";
import { parseBorrowList } from "./borrowListRules.ts";
import { checkoutSchema, endDate } from "./checkoutSchema.ts";

/** @returns ok: false when the input is invalid or the API refused a request */
export async function checkout(
  values: unknown,
  list: unknown,
): Promise<{ ok: boolean }> {
  const form = checkoutSchema.safeParse(values);
  const entries = parseBorrowList(list);
  if (!form.success || entries.length === 0) return { ok: false };

  const borrower = await getCurrentUser();
  const results = await Promise.all(
    entries.map((entry) =>
      sendBorrowRequest({
        itemId: entry.itemId,
        borrowerId: borrower.id,
        startDate: form.data.pickupDate,
        endDate: endDate(form.data.pickupDate, entry.days),
      }),
    ),
  );
  return { ok: results.every((result) => result.ok) };
}
