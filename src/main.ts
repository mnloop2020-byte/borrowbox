import { renderFooter } from "./components/Footer.ts";
import { renderNavbar, updateActiveNavLink } from "./components/Navbar.ts";
import { categoryLabel } from "./content/categories.ts";
import { t } from "./i18n/i18n.ts";
import { escapeHtml } from "./logic/html.ts";
import { isValidItemId, parseCatalogParams } from "./logic/validation.ts";
import { userStore } from "./store/userStore.ts";
import { getElement } from "./utils/dom.ts";
import { scrollToSection } from "./utils/scrollToSection.ts";
import { mountHomeView } from "./views/HomeView.ts";
import { mountItemDetailView } from "./views/ItemDetailView.ts";
import { mountRegisterView } from "./views/RegisterView.ts";
import "./style.css";

// Application root setup
const app = getElement(document, "#app");

app.innerHTML = `
  <div id="nav-mount"></div>
  <main id="main-content" class="main-content" tabindex="-1">
    <div id="view-container"></div>
  </main>
  <div id="footer-mount"></div>
`;

const navMount = getElement(document, "#nav-mount");
const viewContainer = getElement(document, "#view-container");
const footerMount = getElement(document, "#footer-mount");

/** Header and footer depend on language and persona, so both can re-render */
function renderChrome(): void {
  renderNavbar(navMount);
  footerMount.innerHTML = renderFooter();
}

renderChrome();

// Track current active view cleanup handler
let activeViewCleanup: (() => void) | null = null;

/** "← Back to home" link used by the placeholder pages; the arrow flips in RTL */
function backHomeLink(): string {
  return `<p class="placeholder-actions"><a href="#/" class="btn btn-accent"><span class="icon-directional" aria-hidden="true">←</span> ${escapeHtml(t("page.backHome"))}</a></p>`;
}

/**
 * Hash-based View Dispatcher
 */
function handleRoute(): void {
  const hash = window.location.hash || "#/";
  updateActiveNavLink(navMount);

  // Clean up previous view timers and listeners if present
  if (typeof activeViewCleanup === "function") {
    activeViewCleanup();
    activeViewCleanup = null;
  }

  const currentUser = userStore.getCurrentUser();

  // Route 1: Home View (#/ or empty)
  if (hash === "#/" || hash === "" || hash === "#") {
    activeViewCleanup = mountHomeView(viewContainer);
    document.title = t("title.home");
    return;
  }

  // Route 2: Catalog View (#/catalog, supports ?q= and ?category= params)
  if (hash.startsWith("#/catalog")) {
    // Only allowed values survive; the text is then set with textContent,
    // which never turns it into HTML
    const { category, q: query } = parseCatalogParams(hash.split("?")[1] || "");
    const label = category
      ? t("page.catalog.filtering")
      : t("page.catalog.searching");

    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">${escapeHtml(t("page.catalog.title"))}</h1>
        ${
          category || query
            ? `<p>${escapeHtml(label)} <strong data-slot="value"></strong></p>`
            : `<p>${escapeHtml(t("page.catalog.intro"))}</p>`
        }
        ${backHomeLink()}
      </section>
    `;
    const valueSlot = viewContainer.querySelector('[data-slot="value"]');
    if (valueSlot) {
      // The URL keeps the English category; only its display is translated
      valueSlot.textContent = category ? categoryLabel(category) : `“${query}”`;
    }
    document.title = t("title.catalog");
    return;
  }

  // Registration (#/register)
  if (hash.startsWith("#/register")) {
    const view = mountRegisterView(viewContainer);
    activeViewCleanup = view.cleanup;
    document.title = view.title;
    return;
  }

  // Route 3: List an Item (#/list-item)
  if (hash.startsWith("#/list-item")) {
    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">${escapeHtml(t("page.listItem.title"))}</h1>
        <p>${escapeHtml(t("page.listItem.intro"))}</p>
        ${backHomeLink()}
      </section>
    `;
    document.title = t("title.listItem");
    return;
  }

  // Route 4: Dashboard (#/dashboard)
  if (hash.startsWith("#/dashboard")) {
    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">${escapeHtml(t("page.dashboard.title"))}</h1>
        <p>${escapeHtml(
          t("page.dashboard.intro", {
            name: currentUser.name,
            role: t(`role.${currentUser.role}`),
          }),
        )}</p>
        ${backHomeLink()}
      </section>
    `;
    document.title = t("title.dashboard");
    return;
  }

  // Route 5: Item Detail View (#/item/:id)
  // An id that is not in the "item-123" format falls through to the 404 view
  const itemId = hash.startsWith("#/item/")
    ? hash.replace("#/item/", "").split("?")[0]
    : "";
  if (isValidItemId(itemId)) {
    const view = mountItemDetailView(viewContainer, itemId);
    activeViewCleanup = view.cleanup;
    document.title = view.title;
    return;
  }

  // 404 Fallback
  viewContainer.innerHTML = `
    <section class="placeholder-view" aria-labelledby="page-title">
      <h1 id="page-title">${escapeHtml(t("page.notFound.title"))}</h1>
      <p>${escapeHtml(t("page.notFound.text"))}</p>
      ${backHomeLink()}
    </section>
  `;
  document.title = t("title.notFound");
}

// Listen for hash navigation changes.
// After a route change, move focus to <main> so screen-reader and keyboard
// users start at the new view's content. Not done on first load,
// where the browser's normal starting point is correct.
window.addEventListener("hashchange", () => {
  handleRoute();
  getElement(document, "#main-content").focus();
});

// "How it works" style links: scroll to a section on the home page.
// From another route, go home first, then scroll once the home view renders.
document.addEventListener("click", (event) => {
  const link =
    event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-scroll-target]")
      : null;
  if (!link) return;
  event.preventDefault();

  // Close the mobile menu if the link was inside it
  if (document.querySelector(".nav-menu.is-open")) {
    document.querySelector<HTMLButtonElement>(".nav-toggle-btn")?.click();
  }

  const targetId = link.dataset.scrollTarget ?? "";
  const isHome = ["", "#", "#/"].includes(window.location.hash);
  if (isHome) {
    scrollToSection(targetId);
  } else {
    // Registered after the router's listener, so it runs after the view renders.
    // setTimeout (not requestAnimationFrame) so it never waits for a paint.
    window.addEventListener(
      "hashchange",
      () => setTimeout(() => scrollToSection(targetId), 0),
      { once: true },
    );
    window.location.hash = "#/";
  }
});

// Listen for demo persona switch event
window.addEventListener("borrowbox:userchange", () => {
  renderNavbar(navMount);
  handleRoute();
});

/**
 * Values typed into the current view, keyed by element id, so a re-render
 * (language change) can put them back. Passwords and files are never copied.
 */
/** Elements that hold a typed value */
type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function snapshotFields(root: HTMLElement): Map<string, string> {
  const values = new Map<string, string>();
  root
    .querySelectorAll<FormField>("input[id], select[id], textarea[id]")
    .forEach((el) => {
      if (el.type === "password" || el.type === "file") return;
      values.set(el.id, el.value);
    });
  return values;
}

/**
 */
function restoreFields(root: HTMLElement, values: Map<string, string>): void {
  values.forEach((value, id) => {
    const el = root.querySelector<FormField>(`#${CSS.escape(id)}`);
    if (el) el.value = value;
  });
}

// Language switch: re-render everything in the new language
// without a reload, keeping the route, persona, typed values, scroll and focus.
// The hash is not touched, so no hashchange fires.
window.addEventListener("borrowbox:langchange", () => {
  const fields = snapshotFields(viewContainer);
  const scrollY = window.scrollY;

  renderChrome();
  handleRoute();

  restoreFields(viewContainer, fields);
  // Focus first without scrolling, then put the page back where it was
  navMount
    .querySelector<HTMLButtonElement>(".lang-switch")
    ?.focus({ preventScroll: true });
  window.scrollTo(0, scrollY);
});

// Initial route execution
handleRoute();
