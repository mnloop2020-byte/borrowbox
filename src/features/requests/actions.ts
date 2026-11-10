"use server";
/**
 * Server action: sends a borrow request to the API. The browser calls it
 * like a function; it runs on the server, so the API address never leaves
 * it. Everything from the browser is checked again here.
 */
import { z } from "zod";
import { isValidItemId } from "../cards/itemId.ts";
import { sendBorrowRequest } from "./requestsApi.ts";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const newRequestSchema = z.object({
  itemId: z.string().refine(isValidItemId),
  borrowerId: z.string().min(1),
  startDate: z.string().regex(ISO_DATE),
  endDate: z.string().regex(ISO_DATE),
});

/** @returns ok: false when the input is invalid or the API refused it */
export async function requestBorrow(input: unknown): Promise<{ ok: boolean }> {
  const parsed = newRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const result = await sendBorrowRequest(parsed.data);
  return { ok: result.ok };
}
