# Catalog Search & Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `#/catalog` placeholder with a working catalog. Users can search items by keyword and filter them by category and availability status.

**Architecture:** Pure filtering functions live in their own file with no DOM access, so Node can test them directly. A `FilterBar` component renders the form, and a `CatalogView` connects the URL, the filters, and the item grid. Filter state lives in the hash query string (`#/catalog?q=&category=&status=`). The links that already exist on the home page and in the hero search keep working unchanged.

**Tech Stack:** Vite 8, vanilla ES modules, CSS in `src/style.css`, Node 22's built-in `node:test` (no new dependencies).

**Spec:** `docs/superpowers/specs/2026-10-30-borrowbox-design.md`, §1 item 1 ("Filter and search items by category, keyword, and availability status") and the `#/catalog` route row.

## Relationship to the existing plan

`docs/superpowers/plans/2026-10-30-catalog-itemdetail.md`, Phase 2 (Tasks 2.1–2.4), covers the same page, but it depends on Phase 1 stores that don't exist yet (`itemStore.getItemsByFilter`, `availability.js`). This plan is a smaller, standalone version that works on `SEED_ITEMS` as they are today. **If this plan is executed, Phase 2 of the older plan is replaced by it.** Phase 1 can later swap `SEED_ITEMS` for `itemStore.getAllItems()` without changing `filterItems`.

## Assumptions (please check)

1. **Filters match the spec only:** keyword, category, and status. The older plan's extra filters (condition, deposit range, sort) are left out because the spec doesn't ask for them.
2. **Status values** are `Available`, `Reserved`, `Unavailable`, taken from the spec. All seed items are currently `Available`.
3. **The keyword search** matches `title`, `description`, and `category`, ignoring case. Every word must match, in any order: `"drill bosch"` matches "Bosch Professional Hammer Drill".
4. **Category options** come from the items themselves, so no third copy of the category list is created. A category in the URL that has no items, such as "Home Improvement" from the home page, still filters and shows the empty state.
5. **Testing:** the project has no test runner. The plan adds only a `"test": "node --test"` script (Node 22 is installed), because AGENTS.md says to avoid new packages. UI tasks are checked by hand in the browser.

## Global Constraints

- Vanilla JavaScript only. No new npm packages (AGENTS.md §1, §5).
- Every form control has an associated `<label>`, and the result count is announced with `aria-live="polite"` (AGENTS.md §2).
- CSS is mobile-first, uses `min-width` media queries, has no `!important`, and is appended to `src/style.css` using the existing custom properties.
- **Any text from the URL must be HTML-escaped before it is inserted into `innerHTML`.**
- Filter changes update the URL with `history.replaceState`, not `location.hash =`. Setting the hash fires `hashchange`, which makes `main.js` remount the view, and the search box would lose focus while the user is typing.
- `npm run lint` and `npm run format:check` pass after every task.

## Review Focus

1. **XSS through the URL:** `#/catalog?q=<img src=x onerror=alert(1)>` must show as plain text. Today's placeholder in `main.js` (around lines 51–63) inserts `query` and `category` without escaping. That is an existing bug this plan fixes (Tasks 1 and 3).
2. **Focus while typing:** typing "dri" must keep focus in the search box and keep the cursor where it was (Task 3, manual check).
3. **An unknown `status` in the URL:** `?status=bogus` is treated as "any status", not as a filter that returns no items (Task 1).
4. **A whitespace-only keyword:** `?q=%20%20` returns all items (Task 1).
5. **Back-button behavior:** typing must not fill the browser history with one entry per letter. `replaceState` handles this (Task 3, manual check).

---

### Task 1: Pure filter logic + test script

**Files:**

- Create: `src/logic/catalogFilter.js`
- Create: `tests/catalogFilter.test.js`
- Modify: `package.json`: add `"test": "node --test"` to `scripts`

**Interfaces:**

- Produces:
  - `STATUSES = ["Available", "Reserved", "Unavailable"]`
  - `parseCatalogParams(queryString: string) -> { q: string, category: string, status: string }`: trims `q`. Unknown `status` values become `""`.
  - `buildCatalogQuery(filters) -> string`: for example `"q=drill&status=Available"`, with empty fields left out.
  - `filterItems(items: Item[], filters) -> Item[]`: keeps the input order and never changes `items`.
  - `escapeHtml(text: string) -> string`: escapes `& < > " '`.
- This file must not import `seedData.js`, because its SVG imports fail in Node. Tests use small item objects written inline.

- [ ] **Step 1: Write the tests** in `tests/catalogFilter.test.js` using `node:test` and `node:assert/strict`:
  - `parseCatalogParams("q=%20Drill%20&category=Gardening")` → `{ q: "Drill", category: "Gardening", status: "" }`
  - `parseCatalogParams("status=bogus").status === ""`
  - `parseCatalogParams("").q === ""`
  - `filterItems(items, { q: "", category: "", status: "" })` returns every item.
  - `q: "DRILL"` matches the title "Bosch Professional Hammer Drill".
  - `q: "drill bosch"` matches it (words in any order). `q: "drill tent"` does not.
  - `q: "stainless"` matches through `description`.
  - `category: "Gardening"` combined with `status: "Available"` combines with AND.
  - `category: "Home Improvement"` returns `[]`.
  - `buildCatalogQuery({ q: "a b", category: "", status: "Available" }) === "q=a+b&status=Available"`
  - `escapeHtml('<img src="x">') === "&lt;img src=&quot;x&quot;&gt;"`
- [ ] **Step 2: Run** `npm test`. Expected: FAIL with `Cannot find module .../catalogFilter.js`.
- [ ] **Step 3: Implement** the five exports. Use `URLSearchParams` for parsing and building. For the keyword, lowercase it, split on `/\s+/`, and require every word to appear in the joined `title description category` text.
- [ ] **Step 4: Run** `npm test`. Expected: all tests pass. Then run `npm run lint`. Expected: no errors.
- [ ] **Step 5: Commit:** `feat: add catalog filter logic with node tests`

### Task 2: FilterBar component

**Files:**

- Create: `src/components/FilterBar.js`

**Interfaces:**

- Consumes: `STATUSES` and `escapeHtml` from Task 1.
- Produces:
  - `renderFilterBar(filters, categories: string[]) -> string`: a `<form class="filter-bar" role="search">` with:
    - `<input type="search" id="filter-q">`
    - `<select id="filter-category">`, whose first option is "All categories" with value `""`
    - `<select id="filter-status">`, whose first option is "Any status"
    - a "Clear filters" `<button type="reset">`
    - one `<label>` for each control. The current values are pre-selected and escaped.
  - `bindFilterBar(form: HTMLFormElement, onChange: (filters) => void) -> cleanup()`:
    - Typing in the search box calls `onChange` 250 ms after the last keystroke.
    - Changing a select calls it right away.
    - Reset calls `onChange({ q: "", category: "", status: "" })`.
    - Submit is cancelled with `preventDefault` so the page doesn't reload.
    - `cleanup` clears the pending timer.

- [ ] **Step 1: Implement** both functions.
- [ ] **Step 2: Run** `npm run lint` and `npm run format:check`. Expected: no errors.
- [ ] **Step 3: Commit:** `feat: add accessible FilterBar component`

(This task has no automated test: the project has no DOM test environment, and adding jsdom would break the no-new-packages rule. Task 3's manual checks cover it.)

### Task 3: CatalogView + route wiring

**Files:**

- Create: `src/views/CatalogView.js`
- Modify: `src/main.js`: replace the inline catalog placeholder (around lines 46–67) with a call to `mountCatalogView`

**Interfaces:**

- Consumes: Task 1 functions, `renderFilterBar` and `bindFilterBar` (Task 2), `renderItemCard` (`src/components/ItemCard.js`), and `SEED_ITEMS`.
- Produces: `mountCatalogView(container: HTMLElement, queryString: string) -> cleanup()`

- [ ] **Step 1: Implement** `mountCatalogView`. It renders:
  - `<h1 id="page-title">Explore Catalog</h1>`
  - the filter bar
  - `<p class="catalog-count" aria-live="polite">` showing "N items" or "1 item"
  - `<div class="catalog-grid">`

  On `onChange`, it calls `history.replaceState(null, "", "#/catalog?" + buildCatalogQuery(f))` (just `#/catalog` when the query is empty) and re-renders only the count and the grid. When there are zero results, it shows "No items match your search." with a "Clear filters" link to `#/catalog`. It returns the FilterBar cleanup.

- [ ] **Step 2: Modify `main.js`.** The catalog branch becomes `activeViewCleanup = mountCatalogView(viewContainer, hash.split("?")[1] || "")`. Keep the `document.title` line. The unescaped HTML is removed with it.
- [ ] **Step 3: Run** `npm test`, `npm run lint`, `npm run format:check`, and `npm run build`. Expected: all succeed.
- [ ] **Step 4: Manual check** with `npm run dev`:
  - The hero search for "drill" lands on the catalog with 1 item.
  - The home category card "Camping" pre-selects Camping and shows 1 item.
  - Typing "tent" keeps focus in the input, and the URL updates.
  - The Back button goes back to the page before the catalog, not through each typed letter.
  - `#/catalog?q=<b>x</b>` shows the text `<b>x</b>` as it is, not bold.
  - `#/catalog?status=bogus` shows all 4 items.
  - "Home Improvement" shows the empty state.
  - Clear filters shows all 4 items again.
- [ ] **Step 5: Commit:** `feat: implement searchable catalog view`

### Task 4: Catalog styles

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
- Repeat the Task 3 Step 4 checklist once on the production build with `npm run preview`.
