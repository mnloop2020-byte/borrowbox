import Link from "next/link";
import Image from "next/image";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { ArrowIcon } from "../../shared/ui/ArrowIcon.tsx";
import { categoryHref } from "../cards/categories.ts";
import { CATEGORY_GROUPS } from "./homeContent.ts";

/** The category groups, each linking to the catalog for one category */
export async function Categories(): Promise<ReactElement> {
  const { t, tValue } = await getI18n();
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
            <Image
              src={group.image}
              alt={t(group.imageAltKey)}
              className="category-group-img"
              sizes="(min-width: 768px) 33vw, 100vw"
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
                    <Link href={categoryHref(name)} className="tool-link">
                      {tValue("category", name)} <ArrowIcon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <Link href="/catalog" className="btn btn-ghost section-cta">
        {t("home.categories.viewAll")}
      </Link>
    </section>
  );
}
