import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { WHY_ITEMS } from "./homeContent.ts";

/** The dark "Why BorrowBox" panel */
export function Why(): ReactElement {
  return (
    <section className="home-section" aria-labelledby="why-heading">
      <div className="why-panel">
        <h2 id="why-heading" className="section-title" data-reveal>
          {t("home.why.title")}
        </h2>
        <ul className="why-grid" data-reveal-group>
          {WHY_ITEMS.map((item, i) => (
            <li key={item.titleKey} className="why-card">
              <span className="why-number" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="why-title">{t(item.titleKey)}</h3>
              <p className="why-text">{t(item.descriptionKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
