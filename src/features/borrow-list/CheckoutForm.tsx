"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ReactElement } from "react";
import { createI18n } from "../../shared/i18n/i18n.ts";
import { todayISO } from "../../shared/lib/dates.ts";
import type { Lang } from "../../shared/types.ts";
import { Button } from "../../shared/ui/Button.tsx";
import { Input } from "../../shared/ui/Input.tsx";
import { showToast } from "../../shared/ui/toastStore.ts";
import { checkout } from "./actions.ts";
import { borrowListStore } from "./borrowListStore.ts";
import { checkoutSchema, PICKUP_METHODS } from "./checkoutSchema.ts";
import type { CheckoutValues } from "./checkoutSchema.ts";

interface CheckoutFormProps {
  lang: Lang;
}

/** The text fields, drawn the same way */
const TEXT_FIELDS = [
  { name: "name", type: "text", autoComplete: "name" },
  { name: "phone", type: "tel", autoComplete: "tel" },
] as const;

/**
 * Sends the whole borrow list as requests. React Hook Form keeps the
 * fields; every rule is in checkoutSchema (Zod). On success the list is
 * cleared through the store's action.
 */
export function CheckoutForm({ lang }: CheckoutFormProps): ReactElement {
  const { t } = createI18n(lang);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      pickupDate: "",
      pickupMethod: "owner",
      agree: false,
    },
  });

  /** The message for an error code, or "" when the field is valid */
  const error = (code: string | undefined): string =>
    code ? t(`checkout.error.${code}`) : "";

  async function onSubmit(values: CheckoutValues): Promise<void> {
    const result = await checkout(values, borrowListStore.getList());
    if (!result.ok) {
      showToast(t("checkout.failed"), "error");
      return;
    }
    borrowListStore.clear();
    reset();
    showToast(t("checkout.success"));
  }

  return (
    <form
      className="register-form checkout-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="checkout-heading"
    >
      <h2 id="checkout-heading" className="item-subheading">
        {t("checkout.title")}
      </h2>

      {TEXT_FIELDS.map((field) => (
        <div className="form-field" key={field.name}>
          <label htmlFor={`checkout-${field.name}`}>
            {t(`checkout.${field.name}`)}
          </label>
          <Input
            {...register(field.name)}
            id={`checkout-${field.name}`}
            type={field.type}
            autoComplete={field.autoComplete}
            aria-invalid={errors[field.name] ? true : undefined}
            aria-describedby={`checkout-${field.name}-error`}
          />
          <p id={`checkout-${field.name}-error`} className="field-error">
            {error(errors[field.name]?.message)}
          </p>
        </div>
      ))}

      <div className="form-field">
        <label htmlFor="checkout-pickupDate">{t("checkout.pickupDate")}</label>
        <Input
          {...register("pickupDate")}
          id="checkout-pickupDate"
          type="date"
          min={todayISO()}
          aria-invalid={errors.pickupDate ? true : undefined}
          aria-describedby="checkout-pickupDate-error"
        />
        <p id="checkout-pickupDate-error" className="field-error">
          {error(errors.pickupDate?.message)}
        </p>
      </div>

      <fieldset className="form-field">
        <legend>{t("checkout.method")}</legend>
        {PICKUP_METHODS.map((method) => (
          <div className="form-check" key={method}>
            <input
              {...register("pickupMethod")}
              id={`checkout-method-${method}`}
              type="radio"
              value={method}
            />
            <label htmlFor={`checkout-method-${method}`}>
              {t(`checkout.method.${method}`)}
            </label>
          </div>
        ))}
      </fieldset>

      <div className="form-check">
        <input
          {...register("agree")}
          id="checkout-agree"
          type="checkbox"
          aria-invalid={errors.agree ? true : undefined}
          aria-describedby="checkout-agree-error"
        />
        <label htmlFor="checkout-agree">{t("checkout.agree")}</label>
      </div>
      <p id="checkout-agree-error" className="field-error">
        {error(errors.agree?.message)}
      </p>

      <Button type="submit" disabled={isSubmitting}>
        {t("checkout.submit")}
      </Button>
    </form>
  );
}
