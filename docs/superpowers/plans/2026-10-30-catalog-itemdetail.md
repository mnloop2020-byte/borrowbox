# Catalog & Item Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Catalog page, Item Detail page, and booking request submission for the BorrowBox MVP.

**Architecture:** Extend the existing component-view-store pattern. Data helpers are built and validated first, then views consume them. Routing stays inline in `main.js` (no separate router module). All new CSS appends to `src/style.css` using the established custom-property palette. No new npm dependencies.

**Tech Stack:** Vite 8, vanilla ES modules, semantic HTML5, CSS custom properties, localStorage.

**Spec:** `docs/superpowers/specs/2026-10-30-borrowbox-design.md` (Version 1.3.0)

---

## Verified Codebase Inventory

### Files that EXIST (confirmed by direct inspection)

| Path                                     | Purpose                                                                                                                                                                                                                                                              | Key exports                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `src/main.js` (131 lines)                | Bootstrapper with inline `handleRoute()` using `if/else` on `window.location.hash`. Tracks `activeViewCleanup`. Listens for `hashchange` and `borrowbox:userchange`.                                                                                                 | —                                     |
| `src/style.css` (1191 lines)             | All CSS in one file. `:root` custom properties for Sage Green palette, typography tokens, spacing, shadows. Sections: reset, buttons, navbar, hero, categories, featured grid, how-it-works, CTA, placeholder views. Responsive breakpoints at `768px` and `1024px`. | —                                     |
| `src/counter.js` (10 lines)              | Unused Vite boilerplate.                                                                                                                                                                                                                                             | `setupCounter`                        |
| `src/store/seedData.js` (92 lines)       | 4 seed items (IDs `item-101` to `item-104`). Categories: Power Tools, Gardening, Camping, Cleaning. Images are local SVGs. Each item has ONE `imageUrl` and a `conditionImages` array with one entry.                                                                | `SEED_ITEMS`                          |
| `src/store/demoUsers.js` (30 lines)      | 3 demo users. Fields: `id`, `name`, `role`, `email`, `avatarInitial`, `isVerified`. Missing from spec: `trustScore`, `completedBorrowsCount`, `avatarUrl`.                                                                                                           | `DEMO_USERS`                          |
| `src/store/userStore.js` (28 lines)      | Manages active demo persona in localStorage under key `borrowbox_current_user_id`. Fires `borrowbox:userchange` custom event on switch.                                                                                                                              | `userStore`                           |
| `src/components/Navbar.js` (279 lines)   | Full navbar: skip-link, nav-brand, nav-menu, profile dropdown with persona switcher, mobile hamburger. Handles outside-click close, Escape with focus restore.                                                                                                       | `renderNavbar`, `updateActiveNavLink` |
| `src/components/ItemCard.js` (62 lines)  | Returns HTML `<article>` card. Links to `#/item/${item.id}`. Shows: image, status badge, category, rating, title, condition, owner, deposit, "Free Loan" tag.                                                                                                        | `renderItemCard`                      |
| `src/components/Carousel.js` (214 lines) | 4-slide carousel with 5s auto-rotate, fade transition, prev/next/dot controls, hover/focus pause, `prefers-reduced-motion` support. Returns `{ cleanup() }`.                                                                                                         | `CAROUSEL_SLIDES`, `createCarousel`   |
| `src/views/HomeView.js` (220 lines)      | 5 sections: Hero + carousel, Popular Categories (6 categories), Featured Items (renders all 4 `SEED_ITEMS` via `renderItemCard`), How It Works (3 steps), Community CTA. Returns cleanup function.                                                                   | `mountHomeView`                       |
| `index.html` (20 lines)                  | `<div id="app">`, loads Inter + Tajawal from Google Fonts, `type="module"` script.                                                                                                                                                                                   | —                                     |

### Files that DO NOT EXIST (confirmed absent)

| Expected by spec                    | Status                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/router/router.js`              | **Does not exist.** The `src/router/` directory itself does not exist. Routing is inline in `main.js`. |
| `src/store/store.js`                | **Does not exist.** No centralized store module.                                                       |
| `src/store/storage.js`              | **Does not exist.** No localStorage wrapper.                                                           |
| `src/store/requests.js`             | **Does not exist.** No borrow request logic.                                                           |
| `src/store/availability.js`         | **Does not exist.** No date-overlap helpers.                                                           |
| `src/store/expiration.js`           | **Does not exist.** No 48h expiration sweeper.                                                         |
| `src/components/FilterBar.js`       | **Does not exist.**                                                                                    |
| `src/components/DatePicker.js`      | **Does not exist.**                                                                                    |
| `src/components/BookingPanel.js`    | **Does not exist.**                                                                                    |
| `src/components/ImageGallery.js`    | **Does not exist.**                                                                                    |
| `src/components/Modal.js`           | **Does not exist.**                                                                                    |
| `src/components/StatusBadge.js`     | **Does not exist.**                                                                                    |
| `src/views/CatalogView.js`          | **Does not exist.** Placeholder HTML is inline in `main.js` L48–L67.                                   |
| `src/views/ItemDetailView.js`       | **Does not exist.** Placeholder HTML is inline in `main.js` L97–L108.                                  |
| `src/styles/` directory             | **Does not exist.** All CSS is in `src/style.css`.                                                     |
| `tests/`, `test/`, `__tests__/`     | **None exist.**                                                                                        |
| `vitest.config.js`, `jest.config.*` | **None exist.**                                                                                        |

### Testing Infrastructure

`package.json` has **no test runner** installed. Scripts: `dev`, `build`, `preview`, `lint`, `format`, `format:check`. devDependencies: `@eslint/js`, `eslint`, `globals`, `prettier`, `vite`. No vitest, jest, or any test framework.

### Data Model Gaps (spec vs. implementation)

| Gap                       | Detail                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User model incomplete** | `demoUsers.js` is missing `trustScore`, `completedBorrowsCount`, and `avatarUrl` from the spec (§5.1). These will be needed on the Item Detail page to display owner reputation. |
| **Item images**           | Each seed item has only one image (`imageUrl` + one entry in `conditionImages`). The Item Detail gallery requires multiple images. Seed data needs additional image entries.     |
| **No request data**       | No borrow request model is implemented. The full model is defined in spec §5.3 with 18+ fields.                                                                                  |
| **No availability logic** | No code exists to check date overlaps or derive item availability status. Spec §6.2 defines the overlap formula.                                                                 |

---

## Global Constraints

| Constraint                                                                              | Source             |
| --------------------------------------------------------------------------------------- | ------------------ |
| Vite with vanilla JavaScript, HTML, CSS only. No frameworks.                            | CLAUDE.md §1       |
| Mobile-first CSS. No `!important`.                                                      | CLAUDE.md §3       |
| Semantic HTML. All inputs have `<label>` with `for`. Native HTML validation attributes. | CLAUDE.md §2       |
| ESLint and Prettier must pass. No unnecessary packages.                                 | CLAUDE.md §5       |
| Hash-based routing via `window.location.hash`.                                          | Design spec §2.1   |
| All state in localStorage. Seed data on first load.                                     | Design spec §4, §8 |
| Preserve existing Home page and Navbar.                                                 | User instruction   |

---

## Review Focus

These five input classes or failure modes are most likely to cause problems and are not naturally covered by individual task tests:

1. **Date overlap across Pending Approval and Active requests** — A borrower selects dates Nov 1–4 for an item that already has a `Pending Approval` request for Nov 3–6. The booking must be blocked both in the UI calendar and in the store validation. _Test: attempt to create a request with overlapping dates when an existing `Pending Approval` request exists; verify rejection._

2. **Filter combinations producing zero results** — All six filter dropdowns are set to values that match no items. The catalog must show a meaningful empty state, not a blank page. _Test: set `category=Camping` and `condition=Fair` with only 4 seed items; verify the empty-state message renders._

3. **Stale localStorage after seed data changes** — Existing users may have old seed data in localStorage from previous sessions. The store must merge or reset gracefully. _Test: pre-populate localStorage with items missing the new fields; verify the store loads without errors._

4. **Demo user switching while viewing Item Detail** — Switching from Alex (borrower) to Sarah (owner of the item) while on `#/item/item-101` must update the booking panel to hide the "Request to Borrow" action for one's own items. _Test: mount ItemDetailView for item-101 as user-1 (owner); verify the request button is not rendered._

5. **Calendar navigation keyboard accessibility** — A keyboard-only user must be able to navigate the custom date picker month grid, select start and end dates, and see booked dates announced as unavailable. _Test: simulate Tab, Arrow, Enter key events on the calendar; verify correct date selection and disabled-date announcement._

---

## Design Decision: Date Range Picker

### Problem

Native `<input type="date">` does not support disabling arbitrary individual dates. The approved requirement states that booked dates must be **visibly disabled and impossible to select**.

### Recommended Solution: Custom Calendar Grid Component

Build a `DateRangePicker.js` component (~200 lines) that renders a monthly calendar grid in vanilla JavaScript:

**UI layer (visual prevention):**

- Render a `<table>` with day-of-week headers and a button per day cell.
- Query `src/store/availability.js` for all booked date intervals for the current item.
- Mark each booked day with `disabled` attribute + a distinct visual style (greyed out, strikethrough, `aria-disabled="true"`, `aria-label="Unavailable — booked Nov 3 to Nov 6"`).
- Past dates are also disabled (`disabled`, greyed out).
- User clicks a day button to set the start date, then clicks another to set the end date.
- If any day within the selected range is booked, show an inline error and clear the selection.
- Month navigation via prev/next buttons.

**Store layer (data-level prevention):**

- `availability.js` exports `getBookedIntervals(itemId)` and `isRangeAvailable(itemId, startDate, endDate)`.
- Before creating a request, `BookingPanel` calls `isRangeAvailable()` as a final guard.
- This dual-layer approach ensures no overlap even if the UI is bypassed.

**Keyboard accessibility:**

- Arrow keys navigate between day cells within the grid.
- Enter/Space selects a day.
- Tab moves focus out of the calendar to the next control.
- Disabled days are focusable but not selectable, with screen reader announcement.

**`prefers-reduced-motion`:**

- No animations in the calendar. Month transitions are instant.

**Why not a third-party date picker library:**

- CLAUDE.md §1 prohibits adding frameworks or unnecessary dependencies.
- The custom component is ~200 lines, fully under our control, and fits the project's complexity level.

---

## Design Decision: Testing Strategy

### Current state

No test runner, no test framework, no test directories, no test scripts.

### Recommendation

For this MVP (a beginner-level university assignment per CLAUDE.md §7), verification will rely on:

1. **ESLint + Prettier** — `npm run lint` and `npm run format:check` after every phase.
2. **Vite production build** — `npm run build` to catch import/syntax errors.
3. **Manual functional testing** — documented test scenarios per phase, executed in the browser.
4. **Automated validation scripts** — small Node scripts (using only built-in `fs`) that parse source files to verify structural requirements (e.g., "CatalogView.js imports FilterBar", "every `<select>` has a `<label>`").

> [!NOTE]
> If you want automated unit tests (e.g., for the pure-function store helpers), I recommend adding **Vitest** as a single devDependency — it integrates natively with Vite, requires zero configuration, and is already the standard for Vite projects. This would require your explicit approval before proceeding.

---

## File Plan

### Files to CREATE

| File                                | Responsibility                                                                                                                                                                                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/store/storage.js`              | Thin localStorage wrapper: `getJSON(key, fallback)`, `setJSON(key, value)`. Safe JSON parse with fallback. Single place to manage key naming.                                                                                                                              |
| `src/store/itemStore.js`            | Item CRUD: `getAllItems()`, `getItemById(id)`, `getItemsByFilter(filters)`. Loads from localStorage with `SEED_ITEMS` as fallback. Does NOT duplicate `seedData.js` — imports and uses it as the default.                                                                  |
| `src/store/requestStore.js`         | Borrow request CRUD: `createRequest(data)`, `getRequestsByItem(itemId)`, `getRequestsByUser(userId)`, `updateRequest(id, updates)`. Uses the Borrow Request Model from spec §5.3. Persists to localStorage key `borrowbox_requests`.                                       |
| `src/store/availability.js`         | Pure functions: `getBookedIntervals(itemId)` returns `[{start, end, status}]` for `Pending Approval` and `Active` requests. `isRangeAvailable(itemId, start, end)` returns boolean. `deriveItemStatus(itemId)` returns `Available`/`Reserved`/`Unavailable`.               |
| `src/store/expiration.js`           | `sweepExpiredRequests()` — scans all `Pending Approval` requests, transitions any older than 48h to `Expired`. Called by `itemStore` and `requestStore` on initialization and by views before displaying data.                                                             |
| `src/components/FilterBar.js`       | Horizontal filter bar with `<select>` dropdowns for Category, Condition, Deposit range, Availability, Sort By, plus a "Clear All" button. Each `<select>` has a `<label>`. Reads current filter state from URL query string. Returns HTML + `bindFilterEvents(container)`. |
| `src/components/DateRangePicker.js` | Custom calendar grid (described above). Exports `createDateRangePicker(mountEl, itemId, onChange)`. Returns `{ cleanup(), getSelection() }`.                                                                                                                               |
| `src/components/BookingPanel.js`    | Booking sidebar: deposit display, DateRangePicker mount, duration calculation, booking summary, "Confirm Request" button. Exports `createBookingPanel(mountEl, item)`. Returns `{ cleanup() }`.                                                                            |
| `src/components/ImageGallery.js`    | Main image + thumbnail strip. Click thumbnail → update main image. Exports `renderImageGallery(images, altBase)` returning HTML, and `bindGalleryEvents(container)`.                                                                                                       |
| `src/views/CatalogView.js`          | Mounts FilterBar + item grid using `renderItemCard`. Reads filters from URL, queries `itemStore.getItemsByFilter()`. Shows result count and empty state. Returns cleanup function.                                                                                         |
| `src/views/ItemDetailView.js`       | Loads item by ID from `itemStore`. Mounts ImageGallery, item info, owner info, and BookingPanel (only if current user is not the owner). Returns cleanup function.                                                                                                         |

### Files to MODIFY

| File                     | Changes                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/main.js`            | Replace the catalog placeholder (L48–L67) with an import and call to `mountCatalogView()`. Replace the item detail placeholder (L97–L108) with an import and call to `mountItemDetailView()`. Keep all other routes unchanged. |
| `src/store/seedData.js`  | (1) Add additional image URLs to each item's `conditionImages` array for the gallery. (2) Add a `SEED_REQUESTS` array (initially empty, or with 1–2 sample requests for testing).                                              |
| `src/store/demoUsers.js` | Add `trustScore`, `completedBorrowsCount`, and `avatarUrl` fields to match spec §5.1. Keep existing fields.                                                                                                                    |
| `src/style.css`          | Append new CSS sections: catalog grid, filter bar, item detail layout, image gallery, booking panel, date range picker, empty states. No modifications to existing sections.                                                   |

### Files NOT modified

| File                         | Reason                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/components/Navbar.js`   | Already complete. No changes needed.                                                             |
| `src/components/Carousel.js` | Used only by HomeView. No changes needed.                                                        |
| `src/components/ItemCard.js` | Already links to `#/item/${id}` and shows all required card fields. Reused as-is in CatalogView. |
| `src/views/HomeView.js`      | Already complete. No changes needed.                                                             |
| `index.html`                 | No changes needed.                                                                               |
| `package.json`               | No new dependencies. No changes unless testing framework is approved.                            |

---

## Implementation Phases

### Phase 1: Data Foundation

> Build and validate all store modules before any UI work. Every later phase depends on these.

#### Task 1.1: localStorage Wrapper

**Files:**

- Create: `src/store/storage.js`

**Produces:**

- `getJSON(key, fallback)` → parses `localStorage.getItem(key)`, returns `fallback` on error or missing key.
- `setJSON(key, value)` → `localStorage.setItem(key, JSON.stringify(value))`.

- [ ] **Step 1:** Create `src/store/storage.js` with `getJSON(key, fallback)` and `setJSON(key, value)`.
  - `getJSON` wraps `JSON.parse(localStorage.getItem(key))` in try/catch, returns `fallback` on failure.
  - `setJSON` calls `localStorage.setItem(key, JSON.stringify(value))`.

- [ ] **Step 2:** Verify no lint errors.
      Run: `npx eslint src/store/storage.js`
      Expected: clean output.

---

#### Task 1.2: Item Store

**Files:**

- Create: `src/store/itemStore.js`

**Consumes:** `storage.js:getJSON/setJSON`, `seedData.js:SEED_ITEMS`

**Produces:**

- `initItems()` → loads items from localStorage key `borrowbox_items`, seeding with `SEED_ITEMS` on first run.
- `getAllItems()` → returns array of all items.
- `getItemById(id)` → returns single item or `null`.
- `getItemsByFilter({ category, condition, depositMax, availability, search, sortBy })` → filtered + sorted array.

- [ ] **Step 1:** Create `src/store/itemStore.js` implementing the four functions above.
  - `initItems()` checks localStorage for `borrowbox_items`. If missing or invalid, writes `SEED_ITEMS` and returns them. Otherwise returns stored items.
  - `getItemsByFilter` applies each filter only when the parameter is non-empty. `search` matches against `title` and `description` (case-insensitive). `sortBy` supports `newest`, `deposit-low`, `deposit-high`, `rating`.
  - `availability` filter will call `availability.js` (wired in Task 1.4).

- [ ] **Step 2:** Verify no lint errors.
      Run: `npx eslint src/store/itemStore.js`
      Expected: clean output.

---

#### Task 1.3: Request Store

**Files:**

- Create: `src/store/requestStore.js`

**Consumes:** `storage.js:getJSON/setJSON`

**Produces:**

- `getAllRequests()` → array of all borrow requests.
- `getRequestsByItem(itemId)` → filtered by itemId.
- `getRequestsByUser(userId)` → filtered by borrowerId.
- `createRequest(data)` → validates, generates ID, sets timestamps, saves. Returns the new request.
- `updateRequest(id, updates)` → merges updates into existing request, saves. Returns updated request.

- [ ] **Step 1:** Create `src/store/requestStore.js`.
  - localStorage key: `borrowbox_requests`.
  - `createRequest(data)` assigns `id: "req-" + Date.now()`, sets `status: "Pending Approval"`, `depositStatus: "Not Held"`, `createdAt: new Date().toISOString()`, and all nullable timestamps to `null`. Validates required fields (`itemId`, `borrowerId`, `startDate`, `endDate`, `depositAmount`). Throws on missing fields.
  - All functions call `sweepExpiredRequests()` from `expiration.js` before returning data (wired in Task 1.5).

- [ ] **Step 2:** Verify no lint errors.
      Run: `npx eslint src/store/requestStore.js`
      Expected: clean output.

---

#### Task 1.4: Availability Helper

**Files:**

- Create: `src/store/availability.js`

**Consumes:** `requestStore.js:getRequestsByItem`

**Produces:**

- `getBookedIntervals(itemId)` → returns `[{ start: "YYYY-MM-DD", end: "YYYY-MM-DD", requestId, status }]` for requests with `status === "Pending Approval"` or `status === "Active"`.
- `isRangeAvailable(itemId, startDate, endDate)` → returns `true` if no booked interval overlaps `[startDate, endDate]`. Overlap formula from spec §6.2: `startA <= existingEnd && endA >= existingStart`.
- `deriveItemStatus(itemId, item)` → returns `"Unavailable"` if `item.isManuallyPaused === true` or item has a `Disputed` request; `"Reserved"` if any `Active`/`Pending Approval` request covers today's date; `"Available"` otherwise.

- [ ] **Step 1:** Create `src/store/availability.js` implementing the three functions.
  - Date comparison uses string comparison (`"2026-11-01" <= "2026-11-04"`) which works correctly for `YYYY-MM-DD` format.

- [ ] **Step 2:** Verify no lint errors.
      Run: `npx eslint src/store/availability.js`
      Expected: clean output.

---

#### Task 1.5: Expiration Sweeper

**Files:**

- Create: `src/store/expiration.js`

**Consumes:** `storage.js:getJSON/setJSON`

**Produces:**

- `sweepExpiredRequests()` → scans all requests with `status === "Pending Approval"`. For each where `(Date.now() - new Date(createdAt).getTime()) > 48 * 60 * 60 * 1000`, sets `status: "Expired"`, `depositStatus: "Not Held"`, `expiredAt: new Date().toISOString()`. Saves back to localStorage. Returns count of expired requests.

- [ ] **Step 1:** Create `src/store/expiration.js`.
  - Reads directly from `getJSON("borrowbox_requests", [])` to avoid circular dependency with `requestStore`.
  - Writes back with `setJSON`.

- [ ] **Step 2:** Wire `sweepExpiredRequests()` into `requestStore.js` — call it at the top of `getAllRequests()`, `getRequestsByItem()`, and `getRequestsByUser()`.

- [ ] **Step 3:** Verify no lint errors on both files.
      Run: `npx eslint src/store/expiration.js src/store/requestStore.js`
      Expected: clean output.

---

#### Task 1.6: Extend Seed Data

**Files:**

- Modify: `src/store/seedData.js`
- Modify: `src/store/demoUsers.js`

- [ ] **Step 1:** In `seedData.js`, add 2–3 additional image entries to each item's `conditionImages` array (reuse the existing SVGs in rotated combinations, or add simple new SVG placeholders to `src/assets/images/`). This provides the gallery with multiple thumbnails.

- [ ] **Step 2:** Add `SEED_REQUESTS` export — an empty array `[]`. This gives `requestStore` a seed fallback without inventing fake data.

- [ ] **Step 3:** In `demoUsers.js`, add `trustScore`, `completedBorrowsCount`, and `avatarUrl` to each user object, per spec §5.1 values:
  - Sarah: `trustScore: 4.9`, `completedBorrowsCount: 14`, `avatarUrl: null` (will use `avatarInitial` fallback).
  - Alex: `trustScore: 4.8`, `completedBorrowsCount: 8`, `avatarUrl: null`.
  - Elena: `trustScore: 0`, `completedBorrowsCount: 0`, `avatarUrl: null`.

- [ ] **Step 4:** Verify no lint errors.
      Run: `npx eslint src/store/seedData.js src/store/demoUsers.js`
      Expected: clean output.

---

#### Task 1.7: Phase 1 Verification

- [ ] **Step 1:** Run full lint check.
      Run: `npm run lint`
      Expected: zero errors and warnings.

- [ ] **Step 2:** Run Prettier check.
      Run: `npm run format:check`
      Expected: all files formatted (run `npm run format` first if needed).

- [ ] **Step 3:** Run production build.
      Run: `npm run build`
      Expected: build succeeds with zero errors.

- [ ] **Step 4:** Manual smoke test — open dev server, confirm Home page still works, no console errors.
      Run: `npm run dev`
      Expected: Home page loads identically to before.

---

### Phase 2: Catalog Page

> Build the Catalog view with filter bar and item grid. Depends on Phase 1 store modules.

#### Task 2.1: FilterBar Component

**Files:**

- Create: `src/components/FilterBar.js`

**Produces:**

- `renderFilterBar(currentFilters)` → returns HTML string with a `<div class="filter-bar">` containing labeled `<select>` elements for: Category (Power Tools, Gardening, Cleaning, Camping, Hand Tools), Condition (Like New, Excellent, Good, Fair), Deposit (Under \$25, \$25–\$50, Over \$50), Availability (All, Available Now), Sort By (Newest, Deposit: Low to High, Deposit: High to Low, Rating). Plus a "Clear All" `<button>`.
- `bindFilterEvents(container, onFilterChange)` → attaches `change` handlers to each `<select>` and click handler to "Clear All". Calls `onFilterChange(filters)` with the current filter object.

- [ ] **Step 1:** Create `src/components/FilterBar.js`.
  - Every `<select>` has a matching `<label>` with `for` attribute.
  - Default option is "All [Category/Condition/etc.]" with empty value.
  - "Clear All" button: `aria-label="Clear all filters"`, resets all selects to default and calls `onFilterChange({})`.

- [ ] **Step 2:** Verify lint.
      Run: `npx eslint src/components/FilterBar.js`

---

#### Task 2.2: CatalogView

**Files:**

- Create: `src/views/CatalogView.js`
- Modify: `src/main.js` (replace catalog placeholder)

**Consumes:** `FilterBar.js:renderFilterBar/bindFilterEvents`, `ItemCard.js:renderItemCard`, `itemStore.js:getItemsByFilter`, `availability.js:deriveItemStatus`

**Produces:**

- `mountCatalogView(container)` → renders filter bar + item grid + result count + empty state. Returns cleanup function.

- [ ] **Step 1:** Create `src/views/CatalogView.js`.
  - Reads filter state from `window.location.hash` query parameters (`category`, `condition`, `deposit`, `availability`, `sort`, `q`).
  - Calls `itemStore.getItemsByFilter(filters)` to get matching items.
  - For each item, calls `deriveItemStatus(item.id, item)` to get current availability and passes it to `renderItemCard` (or patches `item.status` before rendering).
  - Renders `renderFilterBar(currentFilters)` above the grid.
  - Shows `<p class="results-count">` with "N items found".
  - Empty state: `<div class="catalog-empty-state">` with a message and link back to clear filters.
  - `bindFilterEvents` callback updates `window.location.hash` with new query parameters (triggering `hashchange` → re-render).
  - Cleanup removes any bound listeners.

- [ ] **Step 2:** In `src/main.js`, replace the catalog placeholder block (lines 48–67) with:

  ```js
  import { mountCatalogView } from "./views/CatalogView.js";
  ```

  And in the `#/catalog` route branch:

  ```js
  activeViewCleanup = mountCatalogView(viewContainer);
  ```

  Keep the `document.title` assignment.

- [ ] **Step 3:** Verify lint.
      Run: `npm run lint`

---

#### Task 2.3: Catalog CSS

**Files:**

- Modify: `src/style.css` (append new sections)

- [ ] **Step 1:** Append Catalog CSS sections to `src/style.css`:
  - `.filter-bar` — horizontal flex container, wraps on mobile, gap spacing. Each select + label pair is inline.
  - `.filter-bar select` — styled to match Sage Green palette, border, radius.
  - `.catalog-grid` — CSS Grid: 1 column mobile, 2 columns at `min-width: 640px`, 3 columns at `min-width: 1024px`, 4 columns at `min-width: 1440px`.
  - `.results-count` — subtle muted text above the grid.
  - `.catalog-empty-state` — centered message with padding.
  - `.clear-filters-btn` — styled button matching `.btn` base.
  - Use only existing CSS custom properties. No `!important`.

- [ ] **Step 2:** Verify Prettier.
      Run: `npm run format:check`

---

#### Task 2.4: Phase 2 Verification

- [ ] **Step 1:** `npm run lint` — zero errors.
- [ ] **Step 2:** `npm run format:check` — clean.
- [ ] **Step 3:** `npm run build` — succeeds.
- [ ] **Step 4:** Manual test in browser:
  - Navigate to `#/catalog` — grid shows all 4 items.
  - Select Category "Gardening" — shows 1 item, result count updates.
  - Select Condition "Good" — shows matching items.
  - Click "Clear All" — all items shown.
  - Type a search on Home page → catalog opens with `?q=` parameter and items are filtered.
  - Click a category on Home page → catalog opens with `?category=` parameter.
  - Click an item card → navigates to `#/item/<id>`.
  - Test at 320px, 768px, 1024px — grid columns adjust correctly.
  - Confirm Home page still works unchanged.

---

### Phase 3: Item Detail Page (Information Only)

> Build the Item Detail view with image gallery and item/owner info. No booking panel yet.

#### Task 3.1: ImageGallery Component

**Files:**

- Create: `src/components/ImageGallery.js`

**Produces:**

- `renderImageGallery(images, altBase)` → returns HTML with a large main image and a row of thumbnail buttons.
- `bindGalleryEvents(container)` → clicking a thumbnail updates the main image `src`. Returns cleanup function (no listeners needed beyond the container scope — relies on event delegation).

- [ ] **Step 1:** Create `src/components/ImageGallery.js`.
  - Main image: `<img class="gallery-main-image" src="${images[0]}" alt="${altBase}">`.
  - Thumbnails: `<div class="gallery-thumbnails" role="list">` with `<button>` per image, `aria-label="View image N"`, `aria-pressed` on active.
  - Event delegation: one `click` handler on the thumbnail container, reads `data-index` from the clicked button.
  - If only 1 image, hide the thumbnail strip.

- [ ] **Step 2:** Verify lint.

---

#### Task 3.2: ItemDetailView (Without Booking)

**Files:**

- Create: `src/views/ItemDetailView.js`
- Modify: `src/main.js` (replace item detail placeholder)

**Consumes:** `ImageGallery.js`, `itemStore.js:getItemById`, `demoUsers.js:DEMO_USERS` (for owner info lookup), `userStore.js:getCurrentUser`

**Produces:**

- `mountItemDetailView(container, itemId)` → renders full item detail page. Returns cleanup function.

- [ ] **Step 1:** Create `src/views/ItemDetailView.js`.
  - Extract `itemId` from parameter (passed by `main.js`).
  - Call `getItemById(itemId)`. If not found, render a "Item not found" message with link to catalog.
  - Layout: two-column on desktop (item info left, booking panel placeholder right), single column on mobile.
  - Left column sections:
    1. Image gallery (via `renderImageGallery` + `bindGalleryEvents`).
    2. Title, category, condition badge, availability status.
    3. Description.
    4. Condition notes and condition images.
    5. Owner info: name, verified badge, trust score, completed borrows count (from `DEMO_USERS` lookup by `item.ownerId`).
  - Right column: placeholder `<div id="booking-panel-mount">` for Phase 4.
  - Back link: `<a href="#/catalog">← Back to catalog</a>`.

- [ ] **Step 2:** In `src/main.js`, replace the item detail placeholder (lines 97–108) with:

  ```js
  import { mountItemDetailView } from "./views/ItemDetailView.js";
  ```

  And in the `#/item/` route branch:

  ```js
  activeViewCleanup = mountItemDetailView(viewContainer, itemId);
  ```

- [ ] **Step 3:** Verify lint.

---

#### Task 3.3: Item Detail CSS

**Files:**

- Modify: `src/style.css` (append)

- [ ] **Step 1:** Append Item Detail CSS:
  - `.item-detail` — max-width container, padding.
  - `.item-detail-layout` — single column mobile; `grid-template-columns: 1.4fr 0.6fr` at `min-width: 1024px`.
  - `.gallery-main-image` — width 100%, `object-fit: cover`, `border-radius: var(--radius-md)`.
  - `.gallery-thumbnails` — horizontal flex, gap, overflow-x auto.
  - `.gallery-thumb-btn` — small square, border, radius, `cursor: pointer`. Active state: border accent color.
  - `.item-info-*` — typography, spacing for title, description, condition, owner.
  - `.owner-card` — flex row with avatar circle (initials), name, verified badge, stats.
  - All using existing custom properties.

- [ ] **Step 2:** Verify Prettier.

---

#### Task 3.4: Phase 3 Verification

- [ ] **Step 1:** `npm run lint` — zero errors.
- [ ] **Step 2:** `npm run build` — succeeds.
- [ ] **Step 3:** Manual test:
  - Click any item card → `#/item/item-101` loads with gallery, info, owner section.
  - Click thumbnail → main image changes.
  - Verify owner info shows trust score and borrow count.
  - Non-existent item ID → "not found" message.
  - Test at 320px (stacked), 1024px (side-by-side).
  - Home page and Catalog still work.

---

### Phase 4: Date Picker & Booking Panel

> Build the custom calendar date picker, booking panel, and connect to the request store. Depends on Phase 1 (data) and Phase 3 (Item Detail mount point).

#### Task 4.1: DateRangePicker Component

**Files:**

- Create: `src/components/DateRangePicker.js`

**Consumes:** `availability.js:getBookedIntervals`

**Produces:**

- `createDateRangePicker(mountEl, itemId, onChange)` → renders calendar grid, returns `{ cleanup(), getSelection() }`.
- `onChange({ startDate, endDate, days })` is called when a valid range is selected.

- [ ] **Step 1:** Create `src/components/DateRangePicker.js`.
  - State: `currentMonth`, `currentYear`, `selectedStart`, `selectedEnd`.
  - Render: month/year header with prev/next buttons, day-of-week labels (Mon–Sun), grid of day `<button>` elements.
  - Each day button: `data-date="YYYY-MM-DD"`.
  - Disabled days: past dates + booked dates (from `getBookedIntervals(itemId)`). Set `disabled`, `aria-disabled="true"`, class `day-booked` or `day-past`.
  - Selection flow: first click sets `selectedStart` (highlight with `.day-selected-start`). Second click sets `selectedEnd` (must be > start). If any day in range is booked → show inline error, clear selection. Otherwise highlight range with `.day-in-range` and call `onChange`.
  - Month nav: clicking prev/next re-renders the grid for the new month. `min` month is current month.
  - `getSelection()` returns `{ startDate, endDate }` or `null`.
  - `cleanup()` — no timers to clear, but removes event listeners from mount element.
  - Keyboard: arrow keys move focus between day buttons. Enter/Space selects. Tab moves out.

- [ ] **Step 2:** Verify lint.

---

#### Task 4.2: BookingPanel Component

**Files:**

- Create: `src/components/BookingPanel.js`

**Consumes:** `DateRangePicker.js:createDateRangePicker`, `requestStore.js:createRequest`, `availability.js:isRangeAvailable`, `userStore.js:getCurrentUser`

**Produces:**

- `createBookingPanel(mountEl, item)` → renders deposit info, date picker, summary, confirm button. Returns `{ cleanup() }`.

- [ ] **Step 1:** Create `src/components/BookingPanel.js`.
  - Layout:
    1. Deposit display: "Refundable Deposit: \$XX" prominently.
    2. DateRangePicker mount.
    3. Duration display: "X days selected" (hidden until range selected). Use `aria-live="polite"` region.
    4. Booking summary (hidden until range selected): item name, start date, end date, days, deposit.
    5. "Confirm Request" button: `disabled` until valid range. `aria-disabled` when inactive.
  - On confirm click:
    1. Final guard: call `isRangeAvailable(item.id, start, end)`. If blocked, show error.
    2. Call `createRequest({ itemId, itemTitle, borrowerId, borrowerName, ownerId, startDate, endDate, depositAmount })`.
    3. Show success message: "Request submitted! Status: Pending Approval."
    4. Disable the button to prevent double submission.
  - If current user is the owner (`item.ownerId === currentUser.id`): render a message "You own this item" instead of the booking panel.
  - If item is `Unavailable` (manually paused): render "This item is currently unavailable."

- [ ] **Step 2:** Verify lint.

---

#### Task 4.3: Wire BookingPanel into ItemDetailView

**Files:**

- Modify: `src/views/ItemDetailView.js`

- [ ] **Step 1:** Import `createBookingPanel` and mount it into the `#booking-panel-mount` container created in Task 3.2.
  - Pass the item object.
  - Store the panel's cleanup return value and call it in the view's cleanup function.

- [ ] **Step 2:** Verify lint.

---

#### Task 4.4: Booking Panel & DateRangePicker CSS

**Files:**

- Modify: `src/style.css` (append)

- [ ] **Step 1:** Append CSS sections:
  - `.booking-panel` — sticky position on desktop (`position: sticky; top: calc(var(--nav-height) + 1rem)`), border, radius, padding, shadow.
  - `.booking-deposit-display` — large text, accent color.
  - `.date-picker` — calendar grid styles.
  - `.date-picker-header` — flex between prev/next buttons and month label.
  - `.date-picker-grid` — 7-column CSS grid.
  - `.day-btn` — square cells, centered text, hover state.
  - `.day-past`, `.day-booked` — greyed out, reduced opacity, strikethrough text or crossed icon.
  - `.day-selected-start`, `.day-selected-end` — accent background.
  - `.day-in-range` — lighter accent background.
  - `.booking-summary` — bordered box with labeled rows.
  - `.booking-confirm-btn` — full-width primary button. Disabled state.
  - `.booking-success` — green-tinted confirmation message.
  - Mobile: booking panel becomes full-width stacked below item info.

- [ ] **Step 2:** Verify Prettier.

---

#### Task 4.5: Phase 4 Verification

- [ ] **Step 1:** `npm run lint` — zero errors.
- [ ] **Step 2:** `npm run format:check` — clean.
- [ ] **Step 3:** `npm run build` — succeeds.
- [ ] **Step 4:** Manual test:
  - Navigate to `#/item/item-101` as Alex (borrower).
  - Verify deposit amount displayed.
  - Open calendar, verify past dates are greyed/disabled.
  - Select start date Nov 1, then end date Nov 4.
  - Verify "4 days selected" and summary appears.
  - Click "Confirm Request" → success message.
  - Check localStorage `borrowbox_requests` — request exists with correct fields.
  - Navigate away and back → calendar shows Nov 1–4 as booked.
  - Try to select overlapping dates → blocked.
  - Switch to Sarah (owner) on item-101 → "You own this item" shown.
  - Switch to Elena (new member) → booking panel shown (she can borrow).
  - Test at 320px, 768px, 1024px.
  - Keyboard: Tab into calendar, arrow keys navigate, Enter selects, disabled days not selectable.

---

### Phase 5: Final Integration & Polish

> Cross-cutting concerns: accessibility audit, responsive polish, and full verification.

#### Task 5.1: Accessibility Audit

**Files:**

- Potentially modify: any component or view file

- [ ] **Step 1:** Verify all `<select>` and `<input>` elements have associated `<label for="...">`.
- [ ] **Step 2:** Verify focus outlines are visible on all interactive elements (buttons, links, selects, calendar days).
- [ ] **Step 3:** Verify `aria-live="polite"` region announces duration changes in the booking panel.
- [ ] **Step 4:** Verify disabled calendar days have `aria-disabled="true"` and descriptive `aria-label`.
- [ ] **Step 5:** Verify heading hierarchy: each view has one `<h1>`, subsequent headings are `<h2>`, `<h3>` in order.
- [ ] **Step 6:** Verify the image gallery main image has `alt` text.

---

#### Task 5.2: Responsive Polish

**Files:**

- Modify: `src/style.css` (adjustments only)

- [ ] **Step 1:** Test all pages at 320px, 768px, 1024px, 1440px.
- [ ] **Step 2:** Verify no horizontal overflow at any breakpoint.
- [ ] **Step 3:** Verify filter bar wraps gracefully on narrow screens.
- [ ] **Step 4:** Verify booking panel stacks below item info on mobile.
- [ ] **Step 5:** Verify calendar grid cells are touch-target sized (≥44px) on mobile.

---

#### Task 5.3: Full Verification

- [ ] **Step 1:** `npm run lint` — zero errors.
- [ ] **Step 2:** `npm run format:check` — clean.
- [ ] **Step 3:** `npm run build` — succeeds.
- [ ] **Step 4:** Full manual walkthrough of all routes:
  - Home → Catalog (via search, category click, "Explore All Items" link).
  - Catalog → filter by each dropdown → clear → item click.
  - Item Detail → gallery thumbnails → booking flow → confirm → verify localStorage.
  - Navigate back to Home → carousel restarts, no console errors.
  - Demo user switch on each page → UI updates correctly.
  - 404 route → shows fallback.
- [ ] **Step 5:** Verify no console errors or warnings on any page.
- [ ] **Step 6:** Commit.
  ```
  git add -A
  git commit -m "feat: catalog page, item detail page, and booking request flow"
  ```

---

## Summary: Phase → Files

| Phase                         | New Files                                                                                                                             | Modified Files                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **1 — Data Foundation**       | `src/store/storage.js`, `src/store/itemStore.js`, `src/store/requestStore.js`, `src/store/availability.js`, `src/store/expiration.js` | `src/store/seedData.js`, `src/store/demoUsers.js` |
| **2 — Catalog Page**          | `src/components/FilterBar.js`, `src/views/CatalogView.js`                                                                             | `src/main.js`, `src/style.css`                    |
| **3 — Item Detail (Info)**    | `src/components/ImageGallery.js`, `src/views/ItemDetailView.js`                                                                       | `src/main.js`, `src/style.css`                    |
| **4 — Date Picker & Booking** | `src/components/DateRangePicker.js`, `src/components/BookingPanel.js`                                                                 | `src/views/ItemDetailView.js`, `src/style.css`    |
| **5 — Polish & Verification** | —                                                                                                                                     | Any file needing a11y/CSS fixes                   |
