# Catalog Search & Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `#/catalog` placeholder with a working catalog. Users can search items by keyword and filter them by category and availability status.

**Architecture:** Pure filtering functions live in `src/logic/`, with no DOM access, so Node can test them directly. A `FilterBar` component renders the form, and a `CatalogView` connects the URL, the filters, and the item grid. Filter state lives in the hash query string (`#/catalog?q=&category=&status=`). The existing home page links and hero search keep working unchanged.

**Tech Stack:** Vite 8, vanilla ES modules, CSS in `src/style.css`, Node 22's built-in `node:test` (no new dependencies).

**Spec:** `docs/superpowers/specs/2026-10-30-borrowbox-design.md` v1.4.0: §1.2 item 1 (catalog and the six categories), §5.2 (derived item status), §8.3 (security rules).

## Prerequisite

The **XSS fix** (`fix/xss-escaping`) must be merged first. This plan relies on what it adds:

- `npm test` script (`node --test`)
- `src/logic/html.js`: `escapeHtml(value: unknown) -> string` and `isSafeImageUrl(url: string) -> boolean`
- `src/logic/constants.js`: `CATEGORIES` (the six category names from spec §1.2, in that order) and `STATUSES = ["Available", "Reserved", "Unavailable"]`
- an escaped `renderItemCard`

## Relationship to the existing plan

`docs/superpowers/plans/2026-10-30-catalog-itemdetail.md`, Phase 2 (Tasks 2.1–2.4), covers the same page. **This plan replaces that Phase 2.** It works on `SEED_ITEMS` as they are today. When Phase 1 builds `itemStore` and `availability.js`:

- `itemStore` reuses `filterItems` instead of adding its own `getItemsByFilter`.
- `CatalogView` passes `deriveItemStatus` in place of this plan's interim `getItemStatus`.

## Decisions taken from the spec

1. **Filters:** keyword, category, and status only (spec §1.2). No condition, deposit or sort filters.
2. **Keyword search** matches `title`, `description`, and `category`, ignoring case. Every word must match, in any order: `"drill bosch"` matches "Bosch Professional Hammer Drill".
3. **Categories** come from the shared `CATEGORIES` list. A category in the URL that is not in the list is ignored, so all items show.
4. **Status is derived, not stored** (spec §5.2). Until Phase 1 exists, `getItemStatus(item)` returns `"Unavailable"` when `item.isManuallyPaused` is true and `"Available"` otherwise. `filterItems` takes the status function as a parameter, so Phase 1 can swap it without changing the filter.

## Global Constraints

- Vanilla JavaScript only. No new npm packages (CLAUDE.md §1, §5).
- Every form control has an associated `<label>`, and the result count is announced with `aria-live="polite"` (CLAUDE.md §2).
- CSS is mobile-first, uses `min-width` media queries, has no `!important`, and is appended to `src/style.css` using the existing custom properties.
- Text from the URL is validated against allowlists and escaped or set with `textContent` (spec §8.3).
- Filter changes update the URL with `history.replaceState`, not `location.hash =`. Setting the hash fires `hashchange`, which makes `main.js` remount the view, and the search box would lose focus while typing.
- `npm test`, `npm run lint` and `npm run format:check` pass after every task.

## Review Focus

1. **XSS through the URL:** `#/catalog?q=<img src=x onerror=alert(1)>` shows as plain text in the search box and the page (Tasks 2 and 4).
2. **Focus while typing:** typing "dri" keeps focus in the search box and keeps the cursor where it was (Task 4, manual check).
3. **Unknown `status` or `category` in the URL:** `?status=bogus` and `?category=Home%20Improvement` are ignored, and all items show (Task 2).
4. **A whitespace-only keyword:** `?q=%20%20` returns all items (Task 2).
5. **Back-button behavior:** typing must not add one history entry per letter. `replaceState` prevents this (Task 4, manual check).

---

### Task 1: Shared categories in the home page and seed data

**Files:**

- Modify: `src/views/HomeView.js`: the `CATEGORIES` constant
- Modify: `src/store/seedData.js`: add 2 items
- Create: `src/assets/images/item-hand-tools.svg`, `src/assets/images/item-outdoor.svg`

**Interfaces:**

- Consumes: `CATEGORIES` from `src/logic/constants.js`.

- [ ] **Step 1: Update the home page categories.** Replace the local name list with the six shared names, keeping one icon per name. Replace "Home Improvement" with "Hand Tools" and keep "Outdoor Equipment". Look up icons by name so the names come only from `CATEGORIES`.
- [ ] **Step 2: Add two seed items** following the spec §5.2 item model:
  - `item-105`, category `Hand Tools`, owner `user-1`
  - `item-106`, category `Outdoor Equipment`, owner `user-2`
  - Each uses one of the new local SVG images, `isManuallyPaused: false`, and a stored `status: "Available"`. The stored field stays for now because `ItemCard` reads it; Phase 1 removes it.
- [ ] **Step 3: Run** `npm test`, `npm run lint`, `npm run format:check`, and `npm run build`. Expected: all pass.
- [ ] **Step 4: Manual check** with `npm run dev`:
  - The home page shows six category cards.
  - The featured grid shows six items.
- [ ] **Step 5: Commit:** `feat: align categories with spec and add seed items`

### Task 2: Pure filter logic

**Files:**

- Create: `src/logic/catalogFilter.js`
- Create: `tests/catalogFilter.test.js`

**Interfaces:**

- Consumes: `CATEGORIES` and `STATUSES` from `src/logic/constants.js`.
- Produces:
  - `parseCatalogParams(queryString: string) -> { q: string, category: string, status: string }`: trims `q` and cuts it to 100 characters. A `category` not in `CATEGORIES` or a `status` not in `STATUSES` becomes `""`.
  - `buildCatalogQuery(filters) -> string`: for example `"q=drill&status=Available"`, with empty fields left out.
  - `getItemStatus(item) -> "Available" | "Unavailable"`: the interim status rule.
  - `filterItems(items, filters, statusOf = getItemStatus) -> Item[]`: keeps the input order and never changes `items`.
- This file must not import `seedData.js`, because its SVG imports fail in Node. Tests use small item objects written inline.

- [ ] **Step 1: Write the tests** in `tests/catalogFilter.test.js` using `node:test` and `node:assert/strict`:
  - `parseCatalogParams("q=%20Drill%20&category=Gardening")` → `{ q: "Drill", category: "Gardening", status: "" }`
  - `parseCatalogParams("status=bogus").status === ""`
  - `parseCatalogParams("category=Home%20Improvement").category === ""`
  - `parseCatalogParams("q=" + "a".repeat(150)).q.length === 100`
  - `parseCatalogParams("q=%20%20").q === ""`
  - `filterItems(items, { q: "", category: "", status: "" })` returns every item.
  - `q: "DRILL"` matches the title "Bosch Professional Hammer Drill".
  - `q: "drill bosch"` matches it. `q: "drill tent"` does not.
  - `q: "stainless"` matches through `description`.
  - `category: "Gardening"` with `status: "Available"` combines with AND.
  - `getItemStatus({ isManuallyPaused: true }) === "Unavailable"`
  - A custom `statusOf` that returns `"Reserved"` makes `status: "Reserved"` match every item.
  - `buildCatalogQuery({ q: "a b", category: "", status: "Available" }) === "q=a+b&status=Available"`
- [ ] **Step 2: Run** `npm test`. Expected: the new tests FAIL with `Cannot find module .../catalogFilter.js`.
- [ ] **Step 3: Implement** the four exports. Use `URLSearchParams` for parsing and building. For the keyword, lowercase it, split on `/\s+/`, and require every word to appear in the joined `title description category` text.
- [ ] **Step 4: Run** `npm test`. Expected: all tests pass. Then run `npm run lint`. Expected: no errors.
- [ ] **Step 5: Commit:** `feat: add catalog filter logic with node tests`

### Task 3: FilterBar component

**Files:**

- Create: `src/components/FilterBar.js`

**Interfaces:**

- Consumes: `CATEGORIES`, `STATUSES` (constants) and `escapeHtml` (`src/logic/html.js`).
- Produces:
  - `renderFilterBar(filters) -> string`: a `<form class="filter-bar" role="search">` with:
    - `<input type="search" id="filter-q" maxlength="100">`
    - `<select id="filter-category">`, whose first option is "All categories" with value `""`
    - `<select id="filter-status">`, whose first option is "Any status"
    - a "Clear filters" `<button type="reset">`
    - one `<label>` for each control. Current values are pre-selected and every value is escaped.
  - `bindFilterBar(form: HTMLFormElement, onChange: (filters) => void) -> cleanup()`:
    - Typing in the search box calls `onChange` 250 ms after the last keystroke.
    - Changing a select calls it right away.
    - Reset calls `onChange({ q: "", category: "", status: "" })`.
    - Submit is cancelled with `preventDefault`.
    - `cleanup` clears the pending timer.

- [ ] **Step 1: Write a test** in `tests/filterBar.test.js` for `renderFilterBar` (it returns a string, so Node can test it):
  - `renderFilterBar({ q: '"><img src=x onerror=alert(1)>', category: "", status: "" })` contains no `<img` and contains `&quot;&gt;&lt;img`.
  - The output has exactly three `<label for=` entries.
  - `category: "Camping"` produces `value="Camping" selected`.
- [ ] **Step 2: Run** `npm test`. Expected: the new test FAILS.
- [ ] **Step 3: Implement** both functions. `bindFilterBar` uses the DOM, so it is checked by hand in Task 4.
- [ ] **Step 4: Run** `npm test`, `npm run lint` and `npm run format:check`. Expected: all pass.
- [ ] **Step 5: Commit:** `feat: add accessible FilterBar component`

### Task 4: CatalogView + route wiring

**Files:**

- Create: `src/views/CatalogView.js`
- Modify: `src/main.js`: replace the catalog route branch (the `if (hash.startsWith("#/catalog"))` block) with a call to `mountCatalogView`

**Interfaces:**

- Consumes: Task 2 functions, `renderFilterBar` and `bindFilterBar` (Task 3), `renderItemCard` (`src/components/ItemCard.js`), and `SEED_ITEMS`.
- Produces: `mountCatalogView(container: HTMLElement, queryString: string) -> cleanup()`

- [ ] **Step 1: Implement** `mountCatalogView`. It renders:
  - `<h1 id="page-title">Explore Catalog</h1>`
  - the filter bar
  - `<p class="catalog-count" aria-live="polite">` showing "N items" or "1 item"
  - `<div class="catalog-grid">`, rendering each item as `renderItemCard({ ...item, status: getItemStatus(item) })`

  On `onChange`, it calls `history.replaceState(null, "", "#/catalog?" + buildCatalogQuery(f))` (just `#/catalog` when the query is empty) and re-renders only the count and the grid. With zero results, it shows "No items match your search." and a "Clear filters" link to `#/catalog`. It returns the FilterBar cleanup.

- [ ] **Step 2: Modify `main.js`.** The catalog branch becomes `activeViewCleanup = mountCatalogView(viewContainer, hash.split("?")[1] || "")`. Keep the `document.title` line.
- [ ] **Step 3: Run** `npm test`, `npm run lint`, `npm run format:check`, and `npm run build`. Expected: all succeed.
- [ ] **Step 4: Manual check** with `npm run dev`:
  - The hero search for "drill" lands on the catalog with 1 item.
  - Each of the six home category cards pre-selects its category and shows at least 1 item.
  - Typing "tent" keeps focus in the input, and the URL updates.
  - The Back button goes to the page before the catalog, not through each typed letter.
  - `#/catalog?q=<img src=x onerror=alert(1)>` shows the text in the search box, and no alert appears.
  - `#/catalog?status=bogus` and `#/catalog?category=Home%20Improvement` show all 6 items.
  - `#/catalog?q=zzz` shows the empty state, and Clear filters shows all 6 items again.
- [ ] **Step 5: Commit:** `feat: implement searchable catalog view`

### Task 5: Catalog styles

**Files:**

- Modify: `src/style.css`: append a `/* Catalog */` section

- [ ] **Step 1: Add the styles.**
  - Mobile base: `.filter-bar` stacks its controls in one column, and `.catalog-grid` is a single column.
  - At `min-width: 768px`: the filter bar becomes one row, and the grid has 2 columns.
  - At `min-width: 1024px`: the grid has 3 columns.
  - Reuse the existing `:root` tokens. Match `.item-card` spacing from the featured grid.
  - Add a visible `:focus-visible` outline on the controls.
- [ ] **Step 2: Run** `npm run lint`, `npm run format:check`, and `npm run build`. Expected: no errors.
- [ ] **Step 3: Manual check** in the browser at widths of 375, 768, and 1280 px:
  - There is no horizontal scroll.
  - The labels are visible.
  - Tabbing through the controls shows the focus ring.
- [ ] **Step 4: Commit:** `style: add responsive catalog and filter bar styles`

---

## Final verification

- `npm test`, `npm run lint`, `npm run format:check`, and `npm run build` all pass.
- Repeat the Task 4 Step 4 checklist once on the production build with `npm run preview`.
