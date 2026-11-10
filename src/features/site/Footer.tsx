import Link from "next/link";
import type { ReactElement } from "react";
import { CATEGORIES, categoryHref } from "../cards/categories.ts";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { ScrollLink } from "../../shared/ui/ScrollLink.tsx";

/**
 * Site footer shown on every page. Real content only: no placeholder
 * address, phone, email or social links.
 */
export async function Footer(): Promise<ReactElement> {
  const { t, tValue } = await getI18n();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-brand">
            <span className="footer-logo">BorrowBox</span>
            <p className="footer-tagline">{t("footer.tagline")}</p>
            <Link href="/list-item" className="btn btn-primary">
              {t("nav.listItem")}
            </Link>
          </div>

          <nav className="footer-column" aria-labelledby="footer-quick-heading">
            <h2 id="footer-quick-heading" className="footer-heading">
              {t("footer.quickLinks")}
            </h2>
            <ul className="footer-list">
              <li>
                <Link href="/catalog" className="footer-link">
                  {t("nav.explore")}
                </Link>
              </li>
              <li>
                <ScrollLink targetId="how-it-works" className="footer-link">
                  {t("nav.howItWorks")}
                </ScrollLink>
              </li>
              <li>
                <Link href="/dashboard" className="footer-link">
                  {t("nav.myActivity")}
                </Link>
              </li>
              <li>
                <Link href="/register" className="footer-link">
                  {t("footer.register")}
                </Link>
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
                  <Link href={categoryHref(name)} className="footer-link">
                    {tValue("category", name)}
                  </Link>
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
