import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ReactElement } from "react";
import { Button } from "../../shared/ui/Button.tsx";
import { Input } from "../../shared/ui/Input.tsx";
import { t } from "../../shared/i18n/i18n.ts";
import { todayISO } from "../../shared/lib/dates.ts";
import { showToast } from "../../shared/ui/toast.ts";
import type { Item } from "../cards/types.ts";
import { userStore } from "../users/userStore.ts";
import { addRequest, getRequests } from "./requestStore.ts";
import { createRequestRecord } from "./requestRules.ts";
import { createBorrowRequestSchema } from "./borrowRequestSchema.ts";
import type { BorrowFormValues } from "./borrowRequestSchema.ts";
import { sendBorrowRequest } from "./requestsApi.ts";

/** Booking messages use validation codes so language changes stay live. */
const message = (code: string): string => t(`booking.error.${code}`);

function requestId(): string {
  return `req-${Date.now()}`;
}

interface BorrowFormProps {
  item: Item;
}

/** The validated "From / To" date form and borrow request action. */
export function BorrowForm({ item }: BorrowFormProps): ReactElement {
  const schema = createBorrowRequestSchema(() => ({
    item,
    borrowerId: userStore.getCurrentUser().id,
    requests: getRequests(),
    today: todayISO(),
  }));
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BorrowFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: "", endDate: "" },
    shouldFocusError: true,
  });

  const today = todayISO();

  async function onSubmit(values: BorrowFormValues): Promise<void> {
    const borrower = userStore.getCurrentUser();
    const response = await sendBorrowRequest({
      itemId: item.id,
      borrowerId: borrower.id,
      startDate: values.startDate,
      endDate: values.endDate,
    });

    if (!response.ok) {
      showToast(t("toast.requestFailed"), "error");
      return;
    }

    // Keep the existing local copy only after the API accepts the request.
    const saved = addRequest(
      createRequestRecord({
        item,
        borrower,
        startDate: values.startDate,
        endDate: values.endDate,
        now: new Date(),
        id: requestId(),
      }),
    );
    if (!saved) {
      setError("root.request", {
        type: "server",
        message: "save-failed",
      });
      return;
    }

    reset();
    showToast(t("booking.success"));
  }

  const startError = errors.startDate?.message;
  const endError = errors.endDate?.message;
  const formError = errors.root?.request?.message;

  return (
    <form className="borrow-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="date-fields">
        <div className="form-field">
          <label htmlFor="borrow-start">{t("booking.from")}</label>
          <Input
            {...register("startDate")}
            type="date"
            id="borrow-start"
            name="startDate"
            min={today}
            required
            className="borrow-form-input"
            aria-invalid={startError ? true : undefined}
            aria-describedby="borrow-start-error"
          />
          <p
            id="borrow-start-error"
            className="field-error"
            hidden={!startError}
          >
            {startError && message(startError)}
          </p>
        </div>
        <div className="form-field">
          <label htmlFor="borrow-end">{t("booking.to")}</label>
          <Input
            {...register("endDate")}
            type="date"
            id="borrow-end"
            name="endDate"
            min={today}
            required
            className="borrow-form-input"
            aria-invalid={endError ? true : undefined}
            aria-describedby="borrow-end-error"
          />
          <p id="borrow-end-error" className="field-error" hidden={!endError}>
            {endError && message(endError)}
          </p>
        </div>
      </div>
      <Button type="submit" className="borrow-submit" disabled={isSubmitting}>
        {t("booking.submit")}
      </Button>
      <div className="form-message form-message--error" role="alert">
        {formError && message(formError)}
      </div>
    </form>
  );
}
