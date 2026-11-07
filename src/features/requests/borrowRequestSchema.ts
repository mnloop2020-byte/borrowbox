import { z } from "zod";
import type { Item } from "../cards/types.ts";
import type { BorrowRequest } from "./types.ts";
import { validateRequest } from "./requestRules.ts";

export interface BorrowValidationContext {
  item: Item;
  borrowerId: string;
  requests: BorrowRequest[];
  today: string;
}

export interface BorrowFormValues {
  startDate: string;
  endDate: string;
}

/**
 * The schema delegates all borrowing rules to validateRequest. Context is
 * fetched when validation runs, so borrower, requests, and today's date stay current.
 */
export function createBorrowRequestSchema(
  getContext: () => BorrowValidationContext,
) {
  return z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .superRefine((values, context) => {
      const result = validateRequest({ ...getContext(), ...values });
      if (result.ok) return;

      const path =
        result.field === "start"
          ? ["startDate"]
          : result.field === "end"
            ? ["endDate"]
            : ["root", "request"];
      context.addIssue({
        code: "custom",
        path,
        message: result.code,
      });
    });
}
