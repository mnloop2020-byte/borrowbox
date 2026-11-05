import { useEffect, useRef } from "react";
import type { FormEvent, ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { observeReveals } from "../../shared/browser/reveal.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { ArrowIcon } from "../../shared/ui/ArrowIcon.tsx";
import { ScrollLink } from "../../shared/ui/ScrollLink.tsx";
import { SearchIcon } from "../../shared/ui/SearchIcon.tsx";
import {
  CATEGORIES,
  categoryHref,
  categoryLabel,
} from "../items/categories.ts";
import { ItemCard } from "../items/ItemCard.tsx";
import { listItems } from "../items/listItems.ts";
import {
  CATEGORY_GROUPS,
  FEATURED_ITEM_IDS,
  HERO_BULLET_KEYS,
  HOW_IMAGE,
  HOW_STEP_KEYS,
  IDLE_IMAGE,
  IDLE_POINT_KEYS,
  WHY_ITEMS,
} from "./homeContent.ts";

function CheckIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5 9-10"></path>
    </svg>
  );
}

function Hero(): ReactElement {
  // The search text is read once, on submit, so the input needs no state
  function handleSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const term = typeof value === "string" ? value.trim() : "";
    window.location.assign(
      term ? `#/catalog?q=${encodeURIComponent(term)}` : "#/catalog",
    );
  }

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
          <form
            role="search"
            aria-label={t("home.hero.searchLabel")}
            onSubmit={handleSearch}
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
          </form>
          {/* Chips link with the English name; only the label is translated.
              --i staggers their entrance animation. */}
          <ul
            className="hero-categories"
            aria-label={t("home.categories.title")}
          >
            {CATEGORIES.map((name, i) => (
              <li key={name}>
                <a
                  href={categoryHref(name)}
                  className="category-chip"
                  style={{ "--i": i }}
                >
                  {categoryLabel(name)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-actions hero-enter hero-enter--3">
          <a href="#/catalog" className="btn btn-primary">
            {t("home.hero.exploreAll")}
          </a>
          <a href="#/list-item" className="btn btn-ghost">
            {t("nav.listItem")}
          </a>
        </div>
      </div>
    </section>
  );
}

function About(): ReactElement {
  return (
    <section
      className="home-section about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-heading-col" data-reveal>
        <span className="section-eyebrow">{t("home.about.eyebrow")}</span>
        <h2 id="about-heading" className="section-title">
          {t("home.about.title")}
        </h2>
      </div>
      <div className="about-body-col" data-reveal>
        <p className="about-text">{t("home.about.text")}</p>
        <ScrollLink targetId="how-it-works" className="text-link">
          {t("home.about.link")} <ArrowIcon />
        </ScrollLink>
      </div>
    </section>
  );
}

function Categories(): ReactElement {
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

function Featured(): ReactElement {
  const items = listItems().filter((item) =>
    FEATURED_ITEM_IDS.includes(item.id),
  );
  return (
    <section
      className="home-section featured-section"
      aria-labelledby="featured-heading"
    >
      <div className="featured-header" data-reveal>
        <h2 id="featured-heading" className="section-title">
          {t("home.featured.title")}
        </h2>
        <a href="#/catalog" className="text-link">
          {t("home.featured.viewAll")} <ArrowIcon />
        </a>
      </div>
      <div className="featured-grid" data-reveal-group>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks(): ReactElement {
  return (
    <section
      id="how-it-works"
      className="home-section split-section"
      aria-labelledby="how-heading"
    >
      <div className="split-text">
        {/* tabIndex -1: scrollToSection() moves focus here */}
        <h2
          id="how-heading"
          className="section-title"
          tabIndex={-1}
          data-reveal
        >
          {t("home.how.title")}
        </h2>
        <p className="section-lead" data-reveal>
          {t("home.how.lead")}
        </p>
        <ol className="how-steps" data-reveal-group>
          {HOW_STEP_KEYS.map((key, i) => (
            <li key={key}>
              {/* Two digits ("01"), like Nomu's numbered process; <ol> already gives the order */}
              <span className="step-number" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t(key)}
            </li>
          ))}
        </ol>
      </div>
      <img
        src={HOW_IMAGE.image}
        alt={t(HOW_IMAGE.altKey)}
        className="split-img"
        loading="lazy"
        data-reveal
      />
    </section>
  );
}

function IdleTools(): ReactElement {
  return (
    <section
      className="home-section split-section split-section--reverse"
      aria-labelledby="idle-heading"
    >
      <div className="split-text" data-reveal>
        <h2 id="idle-heading" className="section-title">
          {t("home.idle.title")}
        </h2>
        <p className="section-lead">{t("home.idle.lead")}</p>
        <ul className="check-list">
          {IDLE_POINT_KEYS.map((key) => (
            <li key={key}>
              <CheckIcon />
              {t(key)}
            </li>
          ))}
        </ul>
        <a href="#/list-item" className="btn btn-primary">
          {t("nav.listItem")}
        </a>
      </div>
      <img
        src={IDLE_IMAGE.image}
        alt={t(IDLE_IMAGE.altKey)}
        className="split-img"
        loading="lazy"
        data-reveal
      />
    </section>
  );
}

function Why(): ReactElement {
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

/** The home page. The scroll reveal starts when it appears and stops when it leaves. */
export function HomeView(): ReactElement {
  usePageTitle(t("title.home"));
  const ref = useRef<HTMLDivElement>(null);

  // Runs once after the first draw; React calls the returned
  // function when the page leaves, which stops the observer
  useEffect(() => {
    if (!ref.current) return;
    return observeReveals(ref.current);
  }, []);

  return (
    <div className="home-view" ref={ref}>
      <Hero />
      <About />
      <Categories />
      <Featured />
      <HowItWorks />
      <IdleTools />
      <Why />
    </div>
  );
}
