import { useRef, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { todayISO } from "../../shared/lib/dates.ts";
import { showToast } from "../../shared/ui/toast.ts";
import type { Item } from "../../shared/types.ts";
import { userStore } from "../users/userStore.ts";
import { createRequestRecord, validateRequest } from "./requestRules.ts";
import { addRequest, getRequests } from "./requestStore.ts";
import { sendBorrowRequest } from "./requestsApi.ts";

/**
 * Which message each place shows, as a code from requestRules
 * ("" for none). Codes, not text, so a language switch translates them.
 */
interface FormErrors {
  start: string;
  end: string;
  form: string;
}

const NO_ERRORS: FormErrors = { start: "", end: "", form: "" };

/** Booking messages, from the dictionaries by code */
const message = (code: string): string => t(`booking.error.${code}`);

interface BorrowFormProps {
  item: Item;
}

/** The "From / To" dates and the "Request to borrow" button */
export function BorrowForm({ item }: BorrowFormProps): ReactElement {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  // While the API answers, the button is off, so a second click
  // cannot send the same request twice
  const [isSending, setIsSending] = useState(false);

  // Direct access to the inputs, only to move focus to the wrong one
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const today = todayISO();

  // async: the handler waits for the API before it shows the result
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const borrower = userStore.getCurrentUser();
    setErrors(NO_ERRORS);

    const result = validateRequest({
      item,
      borrowerId: borrower.id,
      startDate,
      endDate,
      requests: getRequests(),
      today,
    });
    if (!result.ok) {
      setErrors({ ...NO_ERRORS, [result.field]: result.code });
      if (result.field === "start") startRef.current?.focus();
      if (result.field === "end") endRef.current?.focus();
      return;
    }

    // 1. Send to the API
    setIsSending(true);
    const response = await sendBorrowRequest({
      itemId: item.id,
      borrowerId: borrower.id,
      startDate,
      endDate,
    });
    setIsSending(false);

    if (!response.ok) {
      showToast(t("toast.requestFailed"), "error");
      return;
    }

    // 2. The server accepted it: keep a copy here too, so this page's
    //    availability and duplicate checks know about it
    const saved = addRequest(
      createRequestRecord({
        item,
        borrower,
        startDate,
        endDate,
        now: new Date(),
        id: `req-${Date.now()}`,
      }),
    );
    if (!saved) {
      setErrors({ ...NO_ERRORS, form: "save-failed" });
      return;
    }
    setStartDate("");
    setEndDate("");
    showToast(t("booking.success"));
  }

  return (
    <form className="borrow-form" noValidate onSubmit={handleSubmit}>
      <div className="date-fields">
        <div className="form-field">
          <label htmlFor="borrow-start">{t("booking.from")}</label>
          <input
            ref={startRef}
            type="date"
            id="borrow-start"
            name="start"
            min={today}
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            aria-invalid={errors.start ? true : undefined}
            aria-describedby="borrow-start-error"
          />
          <p
            id="borrow-start-error"
            className="field-error"
            hidden={!errors.start}
          >
            {errors.start && message(errors.start)}
          </p>
        </div>
        <div className="form-field">
          <label htmlFor="borrow-end">{t("booking.to")}</label>
          <input
            ref={endRef}
            type="date"
            id="borrow-end"
            name="end"
            min={today}
            required
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            aria-invalid={errors.end ? true : undefined}
            aria-describedby="borrow-end-error"
          />
          <p id="borrow-end-error" className="field-error" hidden={!errors.end}>
            {errors.end && message(errors.end)}
          </p>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary borrow-submit"
        disabled={isSending}
      >
        {t("booking.submit")}
      </button>
      <div className="form-message form-message--error" role="alert">
        {errors.form && message(errors.form)}
      </div>
    </form>
  );
}
