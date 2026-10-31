import { renderNavbar, updateActiveNavLink } from "./components/Navbar.js";
import { userStore } from "./store/userStore.js";
import { mountHomeView } from "./views/HomeView.js";
import "./style.css";

// Application root setup
const app = document.querySelector("#app");

app.innerHTML = `
  <div id="nav-mount"></div>
  <main id="main-content" class="main-content" tabindex="-1">
    <div id="view-container"></div>
  </main>
`;

const navMount = document.querySelector("#nav-mount");
const viewContainer = document.querySelector("#view-container");

// Render primary navigation
renderNavbar(navMount);

// Track current active view cleanup handler
let activeViewCleanup = null;

/**
 * Hash-based View Dispatcher
 */
function handleRoute() {
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
    document.title = "BorrowBox — Peer-to-Peer Community Tool Sharing";
    return;
  }

  // Route 2: Catalog View (#/catalog, supports ?q= and ?category= params)
  if (hash.startsWith("#/catalog")) {
    const urlParams = new URLSearchParams(hash.split("?")[1] || "");
    const query = urlParams.get("q") || "";
    const category = urlParams.get("category") || "";

    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">Explore Catalog</h1>
        ${
          category
            ? `<p>Filtering by category: <strong>${category}</strong></p>`
            : query
              ? `<p>Searching for: <strong>"${query}"</strong></p>`
              : `<p>Discover power tools, garden gear, and household equipment available in your community.</p>`
        }
        <p style="margin-top: 1rem;"><a href="#/" class="btn btn-primary" style="font-size: 0.875rem;">← Back to Home</a></p>
      </section>
    `;
    document.title = "Catalog — BorrowBox";
    return;
  }

  // Route 3: List an Item (#/list-item)
  if (hash.startsWith("#/list-item")) {
    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">List an Item for Borrowing</h1>
        <p>Share your equipment with trusted community neighbors and set refundable security deposits.</p>
        <p style="margin-top: 1rem;"><a href="#/" class="btn btn-primary" style="font-size: 0.875rem;">← Back to Home</a></p>
      </section>
    `;
    document.title = "List an Item — BorrowBox";
    return;
  }

  // Route 4: Dashboard (#/dashboard)
  if (hash.startsWith("#/dashboard")) {
    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">My Activity Dashboard</h1>
        <p>Manage borrowed tools and inspect item returns as <strong>${currentUser.name}</strong> (${currentUser.role}).</p>
        <p style="margin-top: 1rem;"><a href="#/" class="btn btn-primary" style="font-size: 0.875rem;">← Back to Home</a></p>
      </section>
    `;
    document.title = "My Activity — BorrowBox";
    return;
  }

  // Route 5: Item Detail View (#/item/:id)
  if (hash.startsWith("#/item/")) {
    const itemId = hash.replace("#/item/", "").split("?")[0];
    viewContainer.innerHTML = `
      <section class="placeholder-view" aria-labelledby="page-title">
        <h1 id="page-title">Item Details</h1>
        <p>Viewing details for item ID: <code>${itemId}</code></p>
        <p style="margin-top: 1rem;"><a href="#/" class="btn btn-primary" style="font-size: 0.875rem;">← Back to Home</a></p>
      </section>
    `;
    document.title = `Item ${itemId} — BorrowBox`;
    return;
  }

  // 404 Fallback
  viewContainer.innerHTML = `
    <section class="placeholder-view" aria-labelledby="page-title">
      <h1 id="page-title">Page Not Found</h1>
      <p>The requested page could not be located.</p>
      <p style="margin-top: 1rem;"><a href="#/" class="btn btn-primary" style="font-size: 0.875rem;">Return Home</a></p>
    </section>
  `;
  document.title = "404 Not Found — BorrowBox";
}

// Listen for hash navigation changes
window.addEventListener("hashchange", handleRoute);

// Listen for demo persona switch event
window.addEventListener("borrowbox:userchange", () => {
  renderNavbar(navMount);
  handleRoute();
});

// Initial route execution
handleRoute();
