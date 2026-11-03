import { t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";
import type { MountedView } from "../types.ts";
import { getElement } from "../utils/dom.ts";

/** Translated text, escaped for use inside this HTML template */
const tx = (key: string, values?: Record<string, unknown>): string =>
  escapeHtml(t(key, values));

/**
 * Registration page.
 *
 * The browser does all the validation through native attributes
 * (required, type="email", minlength), so there is no `novalidate` and no
 * validation code here. Everyone is a demo persona, so a valid submit only
 * shows a confirmation: nothing is stored, and the password never leaves
 * the input.
 *
 */
export function mountRegisterView(container: HTMLElement): MountedView {
  container.innerHTML = `
    <section class="register-view" aria-labelledby="page-title">
      <h1 id="page-title">${tx("register.title")}</h1>
      <p class="register-intro">${tx("register.intro")}</p>

      <form id="register-form" class="register-form">
        <div class="form-field">
          <label for="register-name">${tx("register.name")}</label>
          <input id="register-name" name="name" type="text" autocomplete="name" required minlength="2" />
        </div>

        <div class="form-field">
          <label for="register-email">${tx("register.email")}</label>
          <input id="register-email" name="email" type="email" autocomplete="email" required />
        </div>

        <div class="form-field">
          <label for="register-password">${tx("register.password")}</label>
          <input id="register-password" name="password" type="password" autocomplete="new-password" required minlength="8" aria-describedby="register-password-hint" />
          <p id="register-password-hint" class="field-hint">${tx("register.passwordHint")}</p>
        </div>

        <div class="form-check">
          <input id="register-agree" name="agree" type="checkbox" required />
          <label for="register-agree">${tx("register.agree")}</label>
        </div>

        <button type="submit" class="btn btn-accent btn-lg">${tx("register.submit")}</button>
        <div id="register-status" class="form-message" role="status"></div>
      </form>
    </section>
  `;

  const form = getElement<HTMLFormElement>(container, "#register-form");
  const nameInput = getElement<HTMLInputElement>(form, "#register-name");
  const status = getElement(container, "#register-status");

  // "submit" only fires after the browser's own validation passes
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    form.reset();
    status.textContent = t("register.success", { name });
  });

  return { title: t("title.register"), cleanup: () => {} };
}
