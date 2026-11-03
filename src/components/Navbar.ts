import { getLang, setLang, t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";
import { userStore } from "../store/userStore.ts";

// Keep active listeners stored to allow clean removal during re-renders
let activeDocumentClickHandler: ((e: MouseEvent) => void) | null = null;
let activeDocumentKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

/**
 * Renders and binds the Airbnb-style Main Navigation bar.
 * Left: Brand logo -> #/
 * Center: Explore -> #/catalog, List an Item -> #/list-item, My Activity -> #/dashboard
 * Right: Profile icon with demo persona switcher
 *
 */
export function renderNavbar(container: HTMLElement): void {
  const users = userStore.getUsers();
  const currentUser = userStore.getCurrentUser();
  const otherLang = getLang() === "ar" ? "en" : "ar";

  // Clean up any existing global listeners before re-rendering
  cleanupGlobalNavbarEvents();

  container.innerHTML = `
    <header class="app-header" role="banner">
      <a href="#main-content" class="skip-link">${escapeHtml(t("nav.skip"))}</a>
      <div class="nav-container">
        <!-- Brand Logo / Name -->
        <a href="#/" class="nav-brand" aria-label="${escapeHtml(t("nav.homeLabel"))}">
          <span class="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 8 12 3 3 8v8l9 5 9-5z"></path>
              <path d="m3 8 9 5 9-5M12 13v8"></path>
            </svg>
          </span>
          <span class="brand-name">BorrowBox</span>
        </a>

        <!-- Main Navigation Links -->
        <nav id="primary-navigation" class="nav-menu" aria-label="${escapeHtml(t("nav.mainLabel"))}">
          <ul class="nav-links-list">
            <li>
              <a href="#/catalog" class="nav-link" data-route="#/catalog">${escapeHtml(t("nav.explore"))}</a>
            </li>
            <li>
              <a href="#/" class="nav-link" data-scroll-target="how-it-works">${escapeHtml(t("nav.howItWorks"))}</a>
            </li>
            <li>
              <a href="#/dashboard" class="nav-link" data-route="#/dashboard">${escapeHtml(t("nav.myActivity"))}</a>
            </li>
            <!-- On small screens the lime button is hidden, so the link lives in the menu -->
            <li class="nav-mobile-only">
              <a href="#/list-item" class="nav-link" data-route="#/list-item">${escapeHtml(t("nav.listItem"))}</a>
            </li>
          </ul>
        </nav>

        <a href="#/list-item" class="btn btn-accent nav-cta">${escapeHtml(t("nav.listItem"))}</a>

        <!-- Right Side Controls: Profile / Demo Switcher + Mobile Toggle -->
        <div class="nav-controls">
          <!-- Language switch: labelled in the language it switches to, so lang is that language -->
          <button type="button" class="lang-switch" lang="${otherLang}">${escapeHtml(t("lang.switchTo"))}</button>

          <div class="profile-menu-container">
            <button
              id="profile-menu-button"
              class="profile-button"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="profile-dropdown-panel"
              aria-label="${escapeHtml(t("nav.profileLabel", { name: currentUser.name }))}"
            >
              <span class="profile-avatar" aria-hidden="true">${escapeHtml(currentUser.avatarInitial)}</span>
              <span class="profile-name">${escapeHtml(currentUser.name)}</span>
              <svg class="profile-dropdown-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Panel with Semantic List -->
            <div id="profile-dropdown-panel" class="profile-dropdown">
              <div class="dropdown-header">${escapeHtml(t("nav.switchPersona"))}</div>
              <ul class="dropdown-persona-list">
                ${users
                  .map(
                    (user) => `
                  <li>
                    <button
                      type="button"
                      class="persona-item-btn ${user.id === currentUser.id ? "is-selected" : ""}"
                      data-user-id="${escapeHtml(user.id)}"
                      aria-current="${user.id === currentUser.id ? "true" : "false"}"
                    >
                      <span>${escapeHtml(user.name)}</span>
                      <span class="persona-role-tag">(${escapeHtml(t(`role.${user.role}`))})</span>
                    </button>
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
          </div>

          <!-- Mobile Menu Hamburger Button -->
          <button
            id="mobile-nav-toggle"
            class="nav-toggle-btn"
            type="button"
            aria-expanded="false"
            aria-controls="primary-navigation"
            aria-label="${escapeHtml(t("nav.menuToggle"))}"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;

  bindNavbarEvents(container);
  updateActiveNavLink(container);
}

/**
 * Handles active route styling
 */
export function updateActiveNavLink(container: HTMLElement): void {
  const currentHash = window.location.hash || "#/";
  const navLinks = container.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const route = link.getAttribute("data-route");
    // Match the route itself plus its sub-paths and query strings,
    // e.g. "#/catalog?q=drill" keeps "Explore" active. Home matches no link.
    const isCurrent =
      currentHash === route ||
      currentHash.startsWith(`${route}?`) ||
      currentHash.startsWith(`${route}/`);
    if (isCurrent) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    }
  });
}

/**
 * Removes global document click and keydown listeners
 */
function cleanupGlobalNavbarEvents(): void {
  if (activeDocumentClickHandler) {
    document.removeEventListener("click", activeDocumentClickHandler);
    activeDocumentClickHandler = null;
  }
  if (activeDocumentKeydownHandler) {
    document.removeEventListener("keydown", activeDocumentKeydownHandler);
    activeDocumentKeydownHandler = null;
  }
}

/**
 * Binds DOM event listeners for the navigation bar
 */
function bindNavbarEvents(container: HTMLElement): void {
  const mobileToggle =
    container.querySelector<HTMLButtonElement>("#mobile-nav-toggle");
  const navMenu = container.querySelector<HTMLElement>("#primary-navigation");
  const profileButton = container.querySelector<HTMLButtonElement>(
    "#profile-menu-button",
  );
  const profileDropdown = container.querySelector<HTMLElement>(
    "#profile-dropdown-panel",
  );
  const personaButtons =
    container.querySelectorAll<HTMLButtonElement>(".persona-item-btn");

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", String(!isExpanded));
      navMenu.classList.toggle("is-open", !isExpanded);

      // Close profile dropdown if mobile menu opens
      if (!isExpanded && profileButton && profileDropdown) {
        profileButton.setAttribute("aria-expanded", "false");
        profileDropdown.classList.remove("is-open");
      }
    });

    // Close mobile menu on nav link click
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      });
    });
  }

  // Profile dropdown toggle
  if (profileButton && profileDropdown) {
    profileButton.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      const isExpanded = profileButton.getAttribute("aria-expanded") === "true";
      profileButton.setAttribute("aria-expanded", String(!isExpanded));
      profileDropdown.classList.toggle("is-open", !isExpanded);

      // Close mobile menu if profile dropdown opens
      if (!isExpanded && mobileToggle && navMenu) {
        mobileToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      }
    });
  }

  // Global Outside-Click Handler
  activeDocumentClickHandler = (e: MouseEvent) => {
    // e.target can be null or a non-Node (such as window); only a Node can be "inside"
    const target = e.target;
    if (!(target instanceof Node)) return;

    // 1. Handle profile dropdown outside click
    if (
      profileButton &&
      profileDropdown &&
      profileDropdown.classList.contains("is-open")
    ) {
      if (
        !profileDropdown.contains(target) &&
        !profileButton.contains(target)
      ) {
        profileButton.setAttribute("aria-expanded", "false");
        profileDropdown.classList.remove("is-open");
      }
    }

    // 2. Handle mobile menu outside click (do not close if clicking inside navMenu or on toggle)
    if (mobileToggle && navMenu && navMenu.classList.contains("is-open")) {
      if (!navMenu.contains(target) && !mobileToggle.contains(target)) {
        mobileToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      }
    }
  };
  document.addEventListener("click", activeDocumentClickHandler);

  // Global Escape Keydown Handler with Focus Restoration
  activeDocumentKeydownHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      let restoredFocus = false;

      // Check profile dropdown first
      if (
        profileButton &&
        profileDropdown &&
        profileDropdown.classList.contains("is-open")
      ) {
        profileButton.setAttribute("aria-expanded", "false");
        profileDropdown.classList.remove("is-open");
        if (typeof profileButton.focus === "function") {
          profileButton.focus();
          restoredFocus = true;
        }
      }

      // Check mobile navigation menu
      if (mobileToggle && navMenu && navMenu.classList.contains("is-open")) {
        mobileToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
        if (!restoredFocus && typeof mobileToggle.focus === "function") {
          mobileToggle.focus();
        }
      }
    }
  };
  document.addEventListener("keydown", activeDocumentKeydownHandler);

  // Language switch: main.ts re-renders the page on "borrowbox:langchange"
  container.querySelector(".lang-switch")?.addEventListener("click", () => {
    setLang(getLang() === "ar" ? "en" : "ar");
  });

  // Switch persona click handler
  personaButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("data-user-id");
      userStore.setCurrentUser(userId);
      profileButton?.setAttribute("aria-expanded", "false");
      profileDropdown?.classList.remove("is-open");
      // Re-render navbar to reflect updated persona name and avatar
      renderNavbar(container);
    });
  });
}
