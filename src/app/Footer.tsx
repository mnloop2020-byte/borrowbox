import type { ReactElement } from "react";
import {
  CATEGORIES,
  categoryHref,
  categoryLabel,
} from "../features/cards/categories.ts";
import { t } from "../shared/i18n/i18n.ts";
import { ScrollLink } from "../shared/ui/ScrollLink.tsx";

/**
 * Site footer shown on every page. Real content only: no placeholder
 * address, phone, email or social links.
 */
export function Footer(): ReactElement {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-brand">
            <span className="footer-logo">BorrowBox</span>
            <p className="footer-tagline">{t("footer.tagline")}</p>
            <a href="#/list-item" className="btn btn-primary">
              {t("nav.listItem")}
            </a>
          </div>

          <nav className="footer-column" aria-labelledby="footer-quick-heading">
            <h2 id="footer-quick-heading" className="footer-heading">
              {t("footer.quickLinks")}
            </h2>
            <ul className="footer-list">
              <li>
                <a href="#/catalog" className="footer-link">
                  {t("nav.explore")}
                </a>
              </li>
              <li>
                <ScrollLink targetId="how-it-works" className="footer-link">
                  {t("nav.howItWorks")}
                </ScrollLink>
              </li>
              <li>
                <a href="#/dashboard" className="footer-link">
                  {t("nav.myActivity")}
                </a>
              </li>
              <li>
                <a href="#/register" className="footer-link">
                  {t("footer.register")}
                </a>
              </li>
            </ul>
          </nav>

          <nav
            className="footer-column"
            aria-labelledby="footer-categories-heading"
          >
            <h2 id="footer-categories-heading" className="footer-heading">
              {t("footer.categories")}
            </h2>
            <ul className="footer-list">
              {/* key: lets React tell the list items apart */}
              {CATEGORIES.map((name) => (
                <li key={name}>
                  <a href={categoryHref(name)} className="footer-link">
                    {categoryLabel(name)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="footer-bottom">{t("footer.bottom")}</p>
      </div>
    </footer>
  );
}
