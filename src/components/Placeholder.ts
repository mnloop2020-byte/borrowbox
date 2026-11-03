import { t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";
import { BACK_ICON } from "./icons.ts";

/** The button under the text */
interface PlaceholderAction {
  href: string;
  /** Plain text; escaped here */
  label: string;
  /** Optional icon HTML shown before the label */
  icon?: string;
}

/**
 * The centred card shown by pages that are not built yet and by "not found"
 * pages: an h1, one paragraph and one button.
 *
 * @param title - plain text; escaped here
 * @param bodyHtml - the paragraph content, already escaped by the caller
 * @param action - the button; "Back to home" when left out
 */
export function renderPlaceholder(
  title: string,
  bodyHtml: string,
  action: PlaceholderAction = {
    href: "#/",
    label: t("page.backHome"),
    icon: BACK_ICON,
  },
): string {
  return `
    <section class="placeholder-view" aria-labelledby="page-title">
      <h1 id="page-title">${escapeHtml(title)}</h1>
      <p>${bodyHtml}</p>
      <p class="placeholder-actions"><a href="${action.href}" class="btn btn-primary">${action.icon ?? ""} ${escapeHtml(action.label)}</a></p>
    </section>
  `;
}
