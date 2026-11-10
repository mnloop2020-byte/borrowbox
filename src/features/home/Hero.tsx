import Form from "next/form";
import Link from "next/link";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { CheckIcon } from "../../shared/ui/CheckIcon.tsx";
import { SearchIcon } from "../../shared/ui/SearchIcon.tsx";
import { CATEGORIES, categoryHref } from "../cards/categories.ts";
import { HERO_BULLET_KEYS } from "./homeContent.ts";

/** The top of the home page: title, points, search box and category chips */
export async function Hero(): Promise<ReactElement> {
  const { t, tValue } = await getI18n();

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-content">
        <span className="hero-eyebrow hero-enter">
          {t("home.hero.eyebrow")}
        </span>
        <h1 id="hero-heading" className="hero-title hero-enter">
          {t("home.hero.title")}{" "}
          <span className="hero-title-accent">
            {t("home.hero.titleAccent")}
          </span>
        </h1>
        <ul className="hero-points hero-enter hero-enter--2">
          {HERO_BULLET_KEYS.map((key) => (
            <li key={key}>
              <CheckIcon />
              {t(key)}
            </li>
          ))}
        </ul>
        <div className="hero-search-card hero-enter hero-enter--2">
          {/* next/form: a GET form to /catalog?q=..., opened without a full
              page load. The catalog reads q from the URL, so no state here. */}
          <Form
            action="/catalog"
            role="search"
            aria-label={t("home.hero.searchLabel")}
          >
            <div className="search-input-group">
              {/* A real <label htmlFor> (hidden visually; the placeholder and icon show the purpose) */}
              <label htmlFor="hero-search-input" className="visually-hidden">
                {t("home.hero.searchInputLabel")}
              </label>
              <span className="search-icon" aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                type="search"
                id="hero-search-input"
                name="q"
                className="hero-search-input"
                placeholder={t("home.hero.searchPlaceholder")}
              />
              <button type="submit" className="search-submit-btn">
                {t("home.hero.searchButton")}
              </button>
            </div>
          </Form>
          {/* Chips link with the English name; only the label is translated.
              --i staggers their entrance animation. */}
          <ul
            className="hero-categories"
            aria-label={t("home.categories.title")}
          >
            {CATEGORIES.map((name, i) => (
              <li key={name}>
                <Link
                  href={categoryHref(name)}
                  className="category-chip"
                  style={{ "--i": i }}
                >
                  {tValue("category", name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-actions hero-enter hero-enter--3">
          <Link href="/catalog" className="btn btn-primary">
            {t("home.hero.exploreAll")}
          </Link>
          <Link href="/list-item" className="btn btn-ghost">
            {t("nav.listItem")}
          </Link>
        </div>
      </div>
    </section>
  );
}
