import {
  CATEGORIES,
  categoryHref,
  categoryLabel,
} from "../content/categories.ts";
import { t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";

/**
 * Site footer shown on every page. Real content only: no placeholder
 * address, phone, email or social links.
 *
 * @returns HTML string
 */
export function renderFooter(): string {
  const categoryLinks = CATEGORIES.map(
    (name) =>
      `<li><a href="${categoryHref(name)}" class="footer-link">${escapeHtml(categoryLabel(name))}</a></li>`,
  ).join("");

  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-columns">
          <div class="footer-brand">
            <span class="footer-logo">BorrowBox</span>
            <p class="footer-tagline">${escapeHtml(t("footer.tagline"))}</p>
            <a href="#/list-item" class="btn btn-primary">${escapeHtml(t("nav.listItem"))}</a>
          </div>

          <nav class="footer-column" aria-labelledby="footer-quick-heading">
            <h2 id="footer-quick-heading" class="footer-heading">${escapeHtml(t("footer.quickLinks"))}</h2>
            <ul class="footer-list">
              <li><a href="#/catalog" class="footer-link">${escapeHtml(t("nav.explore"))}</a></li>
              <li><a href="#/" class="footer-link" data-scroll-target="how-it-works">${escapeHtml(t("nav.howItWorks"))}</a></li>
              <li><a href="#/dashboard" class="footer-link">${escapeHtml(t("nav.myActivity"))}</a></li>
              <li><a href="#/register" class="footer-link">${escapeHtml(t("footer.register"))}</a></li>
            </ul>
          </nav>

          <nav class="footer-column" aria-labelledby="footer-categories-heading">
            <h2 id="footer-categories-heading" class="footer-heading">${escapeHtml(t("footer.categories"))}</h2>
            <ul class="footer-list">${categoryLinks}</ul>
          </nav>
        </div>

        <p class="footer-bottom">${escapeHtml(t("footer.bottom"))}</p>
      </div>
    </footer>
  `;
}
