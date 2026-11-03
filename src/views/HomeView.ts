import { createHeroBackground } from "../components/Carousel.ts";
import { renderItemCard } from "../components/ItemCard.ts";
import { categoryHref, categoryLabel } from "../content/categories.ts";
import {
  CATEGORY_GROUPS,
  HERO_BULLET_KEYS,
  HERO_SLIDES,
  HOW_IMAGE,
  HOW_STEP_KEYS,
  IDLE_IMAGE,
  IDLE_POINT_KEYS,
  WHY_ITEMS,
} from "../content/homeContent.ts";
import { t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";
import { SEED_ITEMS } from "../store/seedData.ts";
import { getElement } from "../utils/dom.ts";

/** Translated text, escaped for use inside these HTML templates */
const tx = (key: string, values?: Record<string, unknown>): string =>
  escapeHtml(t(key, values));

// The arrow points along the reading direction, so it flips in RTL (.icon-directional)
const ARROW_ICON = `<svg class="icon-directional" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"></path></svg>`;
const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"></path></svg>`;
const SEARCH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>`;

function renderHero(): string {
  return `
    <section class="hero" aria-labelledby="hero-heading">
      <div id="hero-bg-mount" class="hero-bg-mount"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">${tx("home.hero.eyebrow")}</span>
        <h1 id="hero-heading" class="hero-title">
          ${tx("home.hero.title")} <span class="hero-title-accent">${tx("home.hero.titleAccent")}</span>
        </h1>
        <ul class="hero-bullets">
          ${HERO_BULLET_KEYS.map((key) => `<li>${tx(key)}</li>`).join("")}
        </ul>
        <form id="hero-search-form" class="hero-search-form" role="search" aria-label="${tx("home.hero.searchLabel")}">
          <div class="search-input-group">
            <!-- A real <label for> (hidden visually; the placeholder and icon show the purpose) -->
            <label for="hero-search-input" class="visually-hidden">${tx("home.hero.searchInputLabel")}</label>
            <span class="search-icon" aria-hidden="true">${SEARCH_ICON}</span>
            <input
              type="search"
              id="hero-search-input"
              class="hero-search-input"
              placeholder="${tx("home.hero.searchPlaceholder")}"
            />
            <button type="submit" class="search-submit-btn">${tx("home.hero.searchButton")}</button>
          </div>
        </form>
        <div class="hero-actions">
          <a href="#/catalog" class="btn btn-accent btn-lg">${tx("home.hero.exploreAll")}</a>
          <a href="#/list-item" class="btn btn-outline btn-lg">${tx("nav.listItem")}</a>
        </div>
      </div>
    </section>
  `;
}

function renderAbout(): string {
  return `
    <section class="home-section about-section" aria-labelledby="about-heading">
      <div class="about-heading-col">
        <span class="section-eyebrow">${tx("home.about.eyebrow")}</span>
        <h2 id="about-heading" class="section-title">${tx("home.about.title")}</h2>
      </div>
      <div class="about-body-col">
        <p class="about-text">${tx("home.about.text")}</p>
        <a href="#/" class="text-link" data-scroll-target="how-it-works">${tx("home.about.link")} ${ARROW_ICON}</a>
      </div>
    </section>
  `;
}

function renderCategoryGroup(group: (typeof CATEGORY_GROUPS)[number]): string {
  // href keeps the English category name; only the label is translated
  const links = group.categories
    .map(
      (name) =>
        `<li><a href="${categoryHref(name)}" class="tool-link">${escapeHtml(categoryLabel(name))} ${ARROW_ICON}</a></li>`,
    )
    .join("");

  return `
    <article class="category-group" aria-labelledby="group-${group.id}">
      <img src="${group.image}" alt="${tx(group.imageAltKey)}" class="category-group-img" loading="lazy" />
      <div class="category-group-body">
        <h3 id="group-${group.id}" class="category-group-title">${tx(group.titleKey)}</h3>
        <p class="category-group-text">${tx(group.descriptionKey)}</p>
        <ul class="tool-links">${links}</ul>
      </div>
    </article>
  `;
}

function renderCategories(): string {
  return `
    <section id="categories" class="home-section categories-section" aria-labelledby="categories-heading">
      <h2 id="categories-heading" class="section-title">${tx("home.categories.title")}</h2>
      <div class="category-groups">
        ${CATEGORY_GROUPS.map(renderCategoryGroup).join("")}
      </div>
      <a href="#/catalog" class="btn btn-outline btn-lg section-cta">${tx("home.categories.viewAll")}</a>
    </section>
  `;
}

function renderFeatured(): string {
  return `
    <section class="home-section featured-section" aria-labelledby="featured-heading">
      <div class="featured-header">
        <h2 id="featured-heading" class="section-title">${tx("home.featured.title")}</h2>
        <a href="#/catalog" class="text-link">${tx("home.featured.viewAll")} ${ARROW_ICON}</a>
      </div>
      <div class="featured-grid">
        ${SEED_ITEMS.map((item) => renderItemCard(item)).join("")}
      </div>
    </section>
  `;
}

function renderHowItWorks(): string {
  return `
    <section id="how-it-works" class="home-section split-section" aria-labelledby="how-heading">
      <div class="split-text">
        <h2 id="how-heading" class="section-title" tabindex="-1">${tx("home.how.title")}</h2>
        <p class="section-lead">${tx("home.how.lead")}</p>
        <ol class="how-steps">
          ${HOW_STEP_KEYS.map(
            (key, i) =>
              `<li><span class="step-number" aria-hidden="true">${i + 1}</span>${tx(key)}</li>`,
          ).join("")}
        </ol>
      </div>
      <img src="${HOW_IMAGE.image}" alt="${tx(HOW_IMAGE.altKey)}" class="split-img" loading="lazy" />
    </section>
  `;
}

function renderIdleTools(): string {
  return `
    <section class="home-section split-section split-section--reverse" aria-labelledby="idle-heading">
      <div class="split-text">
        <h2 id="idle-heading" class="section-title">${tx("home.idle.title")}</h2>
        <p class="section-lead">${tx("home.idle.lead")}</p>
        <ul class="check-list">
          ${IDLE_POINT_KEYS.map((key) => `<li>${CHECK_ICON}${tx(key)}</li>`).join("")}
        </ul>
        <a href="#/list-item" class="btn btn-accent btn-lg">${tx("nav.listItem")}</a>
      </div>
      <img src="${IDLE_IMAGE.image}" alt="${tx(IDLE_IMAGE.altKey)}" class="split-img" loading="lazy" />
    </section>
  `;
}

function renderWhy(): string {
  return `
    <section class="home-section" aria-labelledby="why-heading">
      <div class="why-panel">
        <h2 id="why-heading" class="section-title">${tx("home.why.title")}</h2>
        <ul class="why-grid">
          ${WHY_ITEMS.map(
            (item, i) => `
              <li class="why-card">
                <span class="why-number" aria-hidden="true">${i + 1}</span>
                <h3 class="why-title">${tx(item.titleKey)}</h3>
                <p class="why-text">${tx(item.descriptionKey)}</p>
              </li>`,
          ).join("")}
        </ul>
      </div>
    </section>
  `;
}

/**
 * Mounts the home page into the container.
 * Returns a cleanup function that stops the hero background timer.
 *
 * @returns cleanup
 */
export function mountHomeView(container: HTMLElement): () => void {
  container.innerHTML = `
    <div class="home-view">
      ${renderHero()}
      ${renderAbout()}
      ${renderCategories()}
      ${renderFeatured()}
      ${renderHowItWorks()}
      ${renderIdleTools()}
      ${renderWhy()}
    </div>
  `;

  const heroBackground = createHeroBackground(
    getElement(container, "#hero-bg-mount"),
    HERO_SLIDES,
  );

  const searchForm = getElement<HTMLFormElement>(
    container,
    "#hero-search-form",
  );
  const searchInput = getElement<HTMLInputElement>(
    container,
    "#hero-search-input",
  );
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = searchInput.value.trim();
    window.location.hash = term
      ? `#/catalog?q=${encodeURIComponent(term)}`
      : "#/catalog";
  });

  return function cleanup() {
    heroBackground.cleanup();
  };
}
