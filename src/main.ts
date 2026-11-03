import { renderFooter } from "./components/Footer.ts";
import { renderNavbar, updateActiveNavLink } from "./components/Navbar.ts";
import { isValidItemId } from "./logic/validation.ts";
import type { MountedView } from "./types.ts";
import { getElement } from "./utils/dom.ts";
import { restoreFields, snapshotFields } from "./utils/formFields.ts";
import { scrollToSection } from "./utils/scrollToSection.ts";
import { mountCatalogView } from "./views/CatalogView.ts";
import { mountDashboardView } from "./views/DashboardView.ts";
import { mountHomeView } from "./views/HomeView.ts";
import { mountItemDetailView } from "./views/ItemDetailView.ts";
import { mountListItemView } from "./views/ListItemView.ts";
import { mountNotFoundView } from "./views/NotFoundView.ts";
import { mountRegisterView } from "./views/RegisterView.ts";
import "./style.css";

/*
 * App shell and hash router. This file builds the page frame, picks the view
 * for the current hash and handles app-wide events. Each page lives in
 * src/views/.
 */

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

/** Stops the timers and listeners of the view that is on screen */
let activeViewCleanup: () => void = () => {};

/** Picks the view for a hash and mounts it into the page */
function mountRoute(hash: string): MountedView {
  if (hash === "#/" || hash === "" || hash === "#") {
    return mountHomeView(viewContainer);
  }
  // Supports ?q= and ?category=
  if (hash.startsWith("#/catalog")) {
    return mountCatalogView(viewContainer, hash.split("?")[1] || "");
  }
  if (hash.startsWith("#/register")) {
    return mountRegisterView(viewContainer);
  }
  if (hash.startsWith("#/list-item")) {
    return mountListItemView(viewContainer);
  }
  if (hash.startsWith("#/dashboard")) {
    return mountDashboardView(viewContainer);
  }
  // An id that is not in the "item-123" format falls through to "not found"
  const itemId = hash.startsWith("#/item/")
    ? hash.replace("#/item/", "").split("?")[0]
    : "";
  if (isValidItemId(itemId)) {
    return mountItemDetailView(viewContainer, itemId);
  }
  return mountNotFoundView(viewContainer);
}

/** Replaces the current view with the one for the current hash */
function handleRoute(): void {
  updateActiveNavLink(navMount);
  activeViewCleanup();

  const view = mountRoute(window.location.hash || "#/");
  activeViewCleanup = view.cleanup;
  document.title = view.title;
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

// Demo persona switch: the header and the view show the new persona
window.addEventListener("borrowbox:userchange", () => {
  renderNavbar(navMount);
  handleRoute();
});

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

// Initial route
handleRoute();
