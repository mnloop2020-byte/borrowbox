"use client";
import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { createI18n } from "../../shared/i18n/i18n.ts";
import type { Lang } from "../../shared/types.ts";

interface RegisterViewProps {
  lang: Lang;
}

/**
 * Registration page.
 *
 * The browser does all the validation through native attributes
 * (required, type="email", minLength), so there is no `noValidate` and no
 * validation code here. Everyone is a demo persona, so a valid submit only
 * shows a confirmation: nothing is stored, and the password never leaves
 * the input.
 *
 * The inputs are uncontrolled: the browser keeps what is typed, and the
 * name is read once, on submit. No state is needed for each field.
 */
export function RegisterView({ lang }: RegisterViewProps): ReactElement {
  const { t } = createI18n(lang);
  // The name of the last account created, or null before the first one.
  // The name, not the message, so a language switch translates it.
  const [createdName, setCreatedName] = useState<string | null>(null);

  // "submit" only fires after the browser's own validation passes
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const name = new FormData(form).get("name");
    // get() can return a file or null, so check that it is text
    setCreatedName(typeof name === "string" ? name.trim() : "");
    form.reset();
  }

  return (
    <section className="register-view" aria-labelledby="page-title">
      <h1 id="page-title">{t("register.title")}</h1>
      <p className="register-intro">{t("register.intro")}</p>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="register-name">{t("register.name")}</label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-email">{t("register.email")}</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-password">{t("register.password")}</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-describedby="register-password-hint"
          />
          <p id="register-password-hint" className="field-hint">
            {t("register.passwordHint")}
          </p>
        </div>

        <div className="form-check">
          <input id="register-agree" name="agree" type="checkbox" required />
          <label htmlFor="register-agree">{t("register.agree")}</label>
        </div>

        <button type="submit" className="btn btn-primary">
          {t("register.submit")}
        </button>
        <div className="form-message" role="status">
          {createdName !== null && t("register.success", { name: createdName })}
        </div>
      </form>
    </section>
  );
}
