import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { ArrowIcon } from "../../shared/ui/ArrowIcon.tsx";
import { categoryHref, categoryLabel } from "../cards/categories.ts";
import { CATEGORY_GROUPS } from "./homeContent.ts";

/** The category groups, each linking to the catalog for one category */
export function Categories(): ReactElement {
  return (
    <section
      id="categories"
      className="home-section categories-section"
      aria-labelledby="categories-heading"
    >
      <h2 id="categories-heading" className="section-title" data-reveal>
        {t("home.categories.title")}
      </h2>
      <div className="category-groups">
        {CATEGORY_GROUPS.map((group) => (
          <article
            key={group.id}
            className="category-group"
            data-reveal
            aria-labelledby={`group-${group.id}`}
          >
            <img
              src={group.image}
              alt={t(group.imageAltKey)}
              className="category-group-img"
              loading="lazy"
            />
            <div className="category-group-body">
              <h3 id={`group-${group.id}`} className="category-group-title">
                {t(group.titleKey)}
              </h3>
              <p className="category-group-text">{t(group.descriptionKey)}</p>
              {/* href keeps the English category name; only the label is translated */}
              <ul className="tool-links">
                {group.categories.map((name) => (
                  <li key={name}>
                    <a href={categoryHref(name)} className="tool-link">
                      {categoryLabel(name)} <ArrowIcon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <a href="#/catalog" className="btn btn-ghost section-cta">
        {t("home.categories.viewAll")}
      </a>
    </section>
  );
}
