import { userStore } from "../store/userStore.js";

// Keep active listeners stored to allow clean removal during re-renders
let activeDocumentClickHandler = null;
let activeDocumentKeydownHandler = null;

/**
 * Renders and binds the Airbnb-style Main Navigation bar.
 * Left: Brand logo -> #/
 * Center: Explore -> #/catalog, List an Item -> #/list-item, My Activity -> #/dashboard
 * Right: Profile icon with demo persona switcher
 *
 * @param {HTMLElement} container
 */
export function renderNavbar(container) {
  const users = userStore.getUsers();
  const currentUser = userStore.getCurrentUser();

  // Clean up any existing global listeners before re-rendering
  cleanupGlobalNavbarEvents();

  container.innerHTML = `
    <header class="app-header" role="banner">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <div class="nav-container">
        <!-- Brand Logo / Name -->
        <a href="#/" class="nav-brand" aria-label="BorrowBox Home">
          <span class="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </span>
          <span class="brand-name">BorrowBox</span>
        </a>

        <!-- Main Navigation Links -->
        <nav id="primary-navigation" class="nav-menu" aria-label="Main Navigation">
          <ul class="nav-links-list">
            <li>
              <a href="#/catalog" class="nav-link" data-route="#/catalog">Explore</a>
            </li>
            <li>
              <a href="#/list-item" class="nav-link" data-route="#/list-item">List an Item</a>
            </li>
            <li>
              <a href="#/dashboard" class="nav-link" data-route="#/dashboard">My Activity</a>
            </li>
          </ul>
        </nav>

        <!-- Right Side Controls: Profile / Demo Switcher + Mobile Toggle -->
        <div class="nav-controls">
          <div class="profile-menu-container">
            <button
              id="profile-menu-button"
              class="profile-button"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="profile-dropdown-panel"
              aria-label="Profile and Demo Switcher for ${currentUser.name}"
            >
              <span class="profile-avatar" aria-hidden="true">${currentUser.avatarInitial}</span>
              <span class="profile-name">${currentUser.name}</span>
              <svg class="profile-dropdown-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Panel with Semantic List -->
            <div id="profile-dropdown-panel" class="profile-dropdown">
              <div class="dropdown-header">Switch Demo Persona</div>
              <ul class="dropdown-persona-list">
                ${users
                  .map(
                    (user) => `
                  <li>
                    <button
                      type="button"
                      class="persona-item-btn ${user.id === currentUser.id ? "is-selected" : ""}"
                      data-user-id="${user.id}"
                      aria-current="${user.id === currentUser.id ? "true" : "false"}"
                    >
                      <span>${user.name}</span>
                      <span class="persona-role-tag">(${user.role})</span>
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
            aria-label="Toggle navigation menu"
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
 * @param {HTMLElement} container
 */
export function updateActiveNavLink(container) {
  const currentHash = window.location.hash || "#/";
  const navLinks = container.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const route = link.getAttribute("data-route");
    if (
      route === currentHash ||
      (route === "#/catalog" && currentHash === "#/")
    ) {
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
function cleanupGlobalNavbarEvents() {
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
 * @param {HTMLElement} container
 */
function bindNavbarEvents(container) {
  const mobileToggle = container.querySelector("#mobile-nav-toggle");
  const navMenu = container.querySelector("#primary-navigation");
  const profileButton = container.querySelector("#profile-menu-button");
  const profileDropdown = container.querySelector("#profile-dropdown-panel");
  const personaButtons = container.querySelectorAll(".persona-item-btn");

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", (e) => {
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
    profileButton.addEventListener("click", (e) => {
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
  activeDocumentClickHandler = (e) => {
    // 1. Handle profile dropdown outside click
    if (
      profileButton &&
      profileDropdown &&
      profileDropdown.classList.contains("is-open")
    ) {
      if (
        !profileDropdown.contains(e.target) &&
        !profileButton.contains(e.target)
      ) {
        profileButton.setAttribute("aria-expanded", "false");
        profileDropdown.classList.remove("is-open");
      }
    }

    // 2. Handle mobile menu outside click (do not close if clicking inside navMenu or on toggle)
    if (mobileToggle && navMenu && navMenu.classList.contains("is-open")) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      }
    }
  };
  document.addEventListener("click", activeDocumentClickHandler);

  // Global Escape Keydown Handler with Focus Restoration
  activeDocumentKeydownHandler = (e) => {
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

  // Switch persona click handler
  personaButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.getAttribute("data-user-id");
      userStore.setCurrentUser(userId);
      profileButton.setAttribute("aria-expanded", "false");
      profileDropdown.classList.remove("is-open");
      // Re-render navbar to reflect updated persona name and avatar
      renderNavbar(container);
    });
  });
}
