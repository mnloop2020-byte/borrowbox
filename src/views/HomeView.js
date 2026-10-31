import { createCarousel } from "../components/Carousel.js";
import { renderItemCard } from "../components/ItemCard.js";
import { SEED_ITEMS } from "../store/seedData.js";

const CATEGORIES = [
  {
    name: "Power Tools",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2l4 4L7 17H3v-4L14 2z"></path><path d="M3 21h18"></path></svg>`,
  },
  {
    name: "Gardening",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9s-9-4.03-9-9a9 9 0 0 1 9-9z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>`,
  },
  {
    name: "Cleaning",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>`,
  },
  {
    name: "Camping",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 20L12 4 5 20h14z"></path><path d="M12 4v16"></path></svg>`,
  },
  {
    name: "Home Improvement",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  },
  {
    name: "Outdoor Equipment",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  },
];

/**
 * Mounts the complete BorrowBox Home Page into the specified container.
 * Returns an unmount/cleanup function to stop timers and free listeners.
 *
 * @param {HTMLElement} container
 * @returns {Function} cleanup
 */
export function mountHomeView(container) {
  container.innerHTML = `
    <div class="home-view">
      <!-- Section 1: Hero Section (Split Layout) -->
      <section class="hero-section" aria-labelledby="hero-heading">
        <div class="hero-left">
          <span class="hero-badge">Community Tool Sharing</span>
          <h1 id="hero-heading" class="hero-title">
            Borrow What You Need.<br />
            Share What You Have.
          </h1>
          <p class="hero-description">
            Connect with neighbors to access high-quality power tools, garden gear, and equipment without the cost and clutter of buying. Backed by simulated refundable security deposits.
          </p>

          <!-- Search Form -->
          <form id="hero-search-form" class="hero-search-form" role="search" aria-label="Search tools and equipment">
            <div class="search-input-group">
              <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="search"
                id="hero-search-input"
                class="hero-search-input"
                placeholder="Search drills, lawn mowers, tents..."
                aria-label="Search equipment by keyword"
              />
              <button type="submit" class="search-submit-btn">Search</button>
            </div>
          </form>

          <div class="hero-actions">
            <a href="#/catalog" class="btn btn-primary">Explore All Items</a>
            <span class="hero-note">✓ 100% Free Borrowing · Refundable Deposits</span>
          </div>
        </div>

        <!-- Hero Right: Carousel mount -->
        <div class="hero-right">
          <div id="carousel-mount" class="carousel-mount"></div>
        </div>
      </section>

      <!-- Section 2: Popular Categories -->
      <section class="categories-section" aria-labelledby="categories-heading">
        <div class="section-header">
          <h2 id="categories-heading" class="section-title">Popular Categories</h2>
          <p class="section-subtitle">Browse frequently borrowed equipment across your community</p>
        </div>

        <div class="categories-carousel-track" role="list">
          ${CATEGORIES.map(
            (cat) => `
            <div role="listitem">
              <a href="#/catalog?category=${encodeURIComponent(cat.name)}" class="category-card" aria-label="Explore ${cat.name}">
                <div class="category-icon-circle" aria-hidden="true">
                  ${cat.icon}
                </div>
                <span class="category-name">${cat.name}</span>
              </a>
            </div>
          `,
          ).join("")}
        </div>
      </section>

      <!-- Section 3: Featured Items Grid -->
      <section class="featured-section" aria-labelledby="featured-heading">
        <div class="section-header">
          <div class="section-title-wrap">
            <h2 id="featured-heading" class="section-title">Featured Items in Your Area</h2>
            <p class="section-subtitle">Verified equipment available to borrow today</p>
          </div>
          <a href="#/catalog" class="view-all-link">
            View full catalog
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
          </a>
        </div>

        <div class="featured-grid">
          ${SEED_ITEMS.map((item) => renderItemCard(item)).join("")}
        </div>
      </section>

      <!-- Section 4: How BorrowBox Works -->
      <section class="how-it-works-section" aria-labelledby="how-heading">
        <div class="section-header text-center">
          <h2 id="how-heading" class="section-title">How BorrowBox Works</h2>
          <p class="section-subtitle">Simple, safe, and transparent community sharing</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number" aria-hidden="true">1</div>
            <div class="step-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 class="step-title">Discover</h3>
            <p class="step-text">Find the exact tool or outdoor equipment you need from neighbors nearby.</p>
          </div>

          <div class="step-card">
            <div class="step-number" aria-hidden="true">2</div>
            <div class="step-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 class="step-title">Borrow</h3>
            <p class="step-text">Request your dates. Once approved by the owner, your refundable deposit is safely held.</p>
          </div>

          <div class="step-card">
            <div class="step-number" aria-hidden="true">3</div>
            <div class="step-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 class="step-title">Return</h3>
            <p class="step-text">Return the tool after use. The owner inspects condition and releases your full deposit.</p>
          </div>
        </div>
      </section>

      <!-- Section 5: Community Call to Action -->
      <section class="cta-section" aria-labelledby="cta-heading">
        <div class="cta-container">
          <div class="cta-content">
            <h2 id="cta-heading" class="cta-title">Have Tools You Rarely Use?</h2>
            <p class="cta-description">
              Share them with your community, help others get projects done, and build local trust—all protected by verified members and security deposits.
            </p>
            <a href="#/list-item" class="btn btn-primary cta-btn">List an Item</a>
          </div>
        </div>
      </section>
    </div>
  `;

  // Mount Carousel component
  const carouselMount = container.querySelector("#carousel-mount");
  let carouselInstance = null;
  if (carouselMount) {
    carouselInstance = createCarousel(carouselMount);
  }

  // Bind Search Form submission
  const searchForm = container.querySelector("#hero-search-form");
  const searchInput = container.querySelector("#hero-search-input");
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const term = searchInput.value.trim();
      if (term) {
        window.location.hash = `#/catalog?q=${encodeURIComponent(term)}`;
      } else {
        window.location.hash = "#/catalog";
      }
    });
  }

  // Return comprehensive unmount cleanup
  return function cleanup() {
    if (carouselInstance && typeof carouselInstance.cleanup === "function") {
      carouselInstance.cleanup();
    }
  };
}
