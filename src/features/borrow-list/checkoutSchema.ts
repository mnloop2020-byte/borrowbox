/**
 * Every rule of the checkout form, in one Zod schema. The form (in the
 * browser) and the server action (on the server) both use it, so the rules
 * are written once. Messages are codes; the form shows them in the page's
 * language (checkout.error.<code>).
 */
import { z } from "zod";
import { todayISO } from "../../shared/lib/dates.ts";

export const PICKUP_METHODS = ["owner", "delivery"] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "name"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{8,15}$/, "phone"),
  pickupDate: z
    .string()
    .regex(ISO_DATE, "date")
    // Only a real date is compared, so an empty field says "date", not "pastDate"
    .refine((date) => !ISO_DATE.test(date) || date >= todayISO(), "pastDate"),
  pickupMethod: z.enum(PICKUP_METHODS, { message: "method" }),
  agree: z.boolean().refine((agreed) => agreed, "agree"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

/** The last day of a borrow that starts on `start` and lasts `days` days */
export function endDate(start: string, days: number): string {
  const date = new Date(`${start}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days - 1);
  return date.toISOString().slice(0, 10);
}
