# Cream Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle BorrowBox with the full-page mockup's layout and type in a single cream theme, and rebuild the home page in the approved section order.

**Architecture:** Colours become role tokens in `src/style.css`. Shared chrome (Navbar, new Footer) changes first, so every page inherits it. The home page is rebuilt section by section in `HomeView.js`, with copy moved to `src/content/homeContent.js` and the carousel reduced to a hero background. Photos are swapped in last; until then the existing SVG illustrations are placeholders.

**Tech Stack:** Vite 8, vanilla ES modules, one `src/style.css`, Google Fonts. No new npm packages.

**Spec:** `docs/superpowers/specs/2026-11-01-cream-homepage-redesign-design.md` (v1.0.0). Product rules: `docs/superpowers/specs/2026-10-30-borrowbox-design.md` (v1.4.0).

## Global Constraints

- No new npm packages (AGENTS.md §1, §5). No frameworks.
- Colour values exactly as spec §3.1. `--color-accent-fill` (`#B8F35C`) is never a text colour on cream.
- Lime buttons on cream: `border: 1px solid var(--color-accent-text)`.
- Focus ring: `outline: 3px solid var(--color-accent-text); outline-offset: 2px` on `:focus-visible`.
- Every `:hover` rule inside `@media (hover: hover)`; transitions name properties, never `all`.
- All movement off under `@media (prefers-reduced-motion: reduce)`.
- Mobile-first CSS with `min-width` queries at `768px` and `1024px`; logical properties (`margin-inline-*`, `padding-inline-*`) for anything that mirrors.
- Untrusted text never goes into `innerHTML` unescaped (AGENTS.md §4a). Home copy is static and trusted.
- `npm run lint`, `npm run format:check` and `npm run build` pass after every task.
- **Commits:** the user has deferred committing. Each task ends with a "Commit" step listing the files that belong together; run it only after the user says to commit.

## Review Focus

1. **Text over a busy photo:** hero text must stay readable over the darkest and lightest parts of every real photo. Measured in Task 8.
2. **"How it works" from another page:** clicking it on `#/dashboard` must go home and then scroll, not show the 404 view. Checked in Task 6.
3. **Narrow screens:** 320px with the new 84px heading, the two hero buttons and the lime nav button must not overflow. Checked in Tasks 3, 4 and 9.
4. **Keyboard through the new header:** Tab reaches every link, "List an item" and the persona dropdown, with a visible ring on cream. Checked in Task 2.
5. **Old tokens left behind:** any `var(--color-text-charcoal)` or other removed token left in the CSS silently falls back to the browser default. Checked in Task 1.

---

### Task 1: Tokens and fonts

**Files:**

- Modify: `src/style.css` (`:root` block at the top, then every `var(--color-…)` use)
- Modify: `index.html` (Google Fonts `<link>`)

**Interfaces:**

- Produces: tokens `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent-fill`, `--color-on-accent`, `--color-accent-text`, `--color-border`, `--color-border-strong`, `--color-panel`, `--color-panel-text`, `--color-panel-muted` (values in spec §3.1); `--font-heading: "Space Grotesk", "Tajawal", system-ui, sans-serif`; `--font-body: "DM Sans", "Tajawal", system-ui, sans-serif`; `--radius-pill: 999px`, `--radius-card: 24px`, `--radius-panel: 32px`.

- [ ] **Step 1: Replace the colour tokens** with the spec §3.1 set. Map old to new:

  | Old token                                     | New token                                                         |
  | --------------------------------------------- | ----------------------------------------------------------------- |
  | `--color-text-charcoal`                       | `--color-text`                                                    |
  | `--color-surface-sage`                        | `--color-surface`                                                 |
  | `--color-white`                               | `--color-surface`                                                 |
  | `--color-accent-solid`                        | `--color-accent-fill` (backgrounds), `--color-accent-text` (text) |
  | `--color-on-accent`                           | `--color-on-accent`                                               |
  | `--color-accent-soft`, `--color-accent-hover` | `--color-border-strong`                                           |
  | `--color-success-bg`, `--color-success-text`  | keep, values `#E4F2D3` and `#2F5317`                              |
  | `--color-focus`                               | `--color-accent-text`                                             |

  Keep the existing spacing, radius and shadow tokens and add the three radius tokens above.

- [ ] **Step 2: Fonts.** In `index.html` load `Space Grotesk:wght@500;600;700`, `DM Sans:wght@400;500;600;700` and `Tajawal:wght@400;500;700` in one URL with `display=swap`. Set `body { font-family: var(--font-body) }` and `h1, h2, h3, .nav-brand { font-family: var(--font-heading) }`.
- [ ] **Step 3: Check for removed tokens.** Run `grep -rnE "charcoal|surface-sage|accent-solid|accent-soft|color-white|color-focus" src`. Expected: no matches.
- [ ] **Step 4: Measure** the 12 pairs from spec §3.1 with the scratchpad contrast script, plus `--color-success-text` on `--color-success-bg`. Expected: every text pair ≥ 4.5, every border/focus pair ≥ 3.
- [ ] **Step 5: Run** `npm run lint && npm run format:check && npm run build`. Expected: all pass. Open `npm run dev`: the page is cream with dark text, and nothing shows in browser-default black or white.
- [ ] **Step 6: Commit:** `style: switch to cream theme tokens and new fonts` (`src/style.css`, `index.html`).

### Task 2: Header

**Files:**

- Modify: `src/components/Navbar.js` (`renderNavbar` markup, lines 39–50)
- Modify: `src/style.css` (Header & Navbar section)

**Interfaces:**

- Consumes: Task 1 tokens.
- Produces: link `<a href="#/" class="nav-link" data-scroll-target="how-it-works">How it works</a>` (handled in Task 6); `<a href="#/list-item" class="btn btn-accent nav-cta">List an item</a>`; CSS classes `.btn-accent` (lime fill, `--color-on-accent` text, accent-text border) and `.btn-outline` (transparent, 2px `--color-text` border), both used by later tasks.

- [ ] **Step 1: Markup.** Links in this order: Explore (`#/catalog`, `data-route="#/catalog"`), How it works (above, no `data-route`), My activity (`#/dashboard`, `data-route="#/dashboard"`). After the nav, the "List an item" link, then the existing profile button unchanged. Logo: a lime 40px rounded square holding the mockup's box icon, plus "BorrowBox".
- [ ] **Step 2: Styles.** Header background `--color-bg`, bottom border `--color-border`; nav links pill-shaped, `min-height: 44px`, active link `background: var(--color-surface)`; `.btn-accent` and `.btn-outline` with pill radius, height 44px in the header and 56px in the hero.
- [ ] **Step 3: Check keyboard and width.** Run `npm run dev`. Tab from the skip link: brand → Explore → How it works → My activity → List an item → profile button. The focus ring is visible on each. Open the persona dropdown with Enter and close it with Escape. At 320px the mobile menu opens and nothing overflows (`document.documentElement.scrollWidth === 320`).
- [ ] **Step 4: Regression.** `#/catalog?q=x` marks Explore active; `#/` marks no link active.
- [ ] **Step 5: Run** lint, format check and build. Expected: pass.
- [ ] **Step 6: Commit:** `feat: restyle header with cream theme and list-an-item button`.

### Task 3: Footer on every page

**Files:**

- Create: `src/content/categories.js`
- Create: `src/components/Footer.js`
- Modify: `src/main.js` (app shell markup)
- Modify: `src/style.css` (new Footer section)

**Interfaces:**

- Consumes: `.btn-accent` (Task 2).
- Produces:
  - `CATEGORIES: string[]` in `src/content/categories.js`, exactly `["Power Tools", "Hand Tools", "Gardening", "Cleaning", "Camping", "Outdoor Equipment"]` (spec v1.4.0 §1.2). This is the only list of category names. Task 4's `CATEGORY_GROUPS` takes its names from it.
  - `renderFooter(): string`, which returns a `<footer class="site-footer">` element.

- [ ] **Step 1: Implement `renderFooter(): string`** with: brand and tagline "Borrow what you need. Share what you have."; `.btn-accent` "List an item" (`#/list-item`); "Quick links" (Explore `#/catalog`, How it works with `data-scroll-target="how-it-works"`, My activity `#/dashboard`); "Categories", the 6 names linking to `#/catalog?category=<encodeURIComponent(name)>`; bottom line `© 2026 BorrowBox. Deposits are simulated.` Column headings use `--color-accent-text`.
- [ ] **Step 2: Mount it** in `main.js`: add `<div id="footer-mount"></div>` after `<main>` in the shell and set its `innerHTML = renderFooter()` once.
- [ ] **Step 3: Check.** `npm run dev`: the footer shows on `#/`, `#/catalog` and `#/dashboard`. At 320px the columns stack with no horizontal scroll. Each category link opens `#/catalog?category=…` with the right name.
- [ ] **Step 4: Run** lint, format check and build. Expected: pass.
- [ ] **Step 5: Commit:** `feat: add site footer`.

### Task 4: Home content module and hero

**Files:**

- Create: `src/content/homeContent.js`
- Modify: `src/components/Carousel.js`
- Modify: `src/views/HomeView.js` (hero section, lines 43–84)
- Modify: `src/style.css` (Hero section; delete the `.carousel-indicators`, `.carousel-dot`, `.carousel-controls`, `.carousel-caption*` and `.hero-left`/`.hero-right` rules)

**Interfaces:**

- Produces from `homeContent.js`:
  - `HERO_BULLETS: string[]` (the 3 mockup bullets)
  - `HERO_SLIDES: { image: string }[]` (3 entries: drill, gardening, camping images)
  - `CATEGORY_GROUPS: { id: string, title: string, description: string, image: string, imageAlt: string, categories: string[] }[]` (spec §4.4 table; descriptions from the mockup with "Home and events" → "Home and cleaning")
  - `HOW_STEPS: string[]` (4 mockup steps)
  - `IDLE_POINTS: string[]` (3 mockup points)
  - `WHY_ITEMS: { title: string, description: string }[]` (5 mockup items)
- Produces from `Carousel.js`: `createHeroBackground(mountElement: HTMLElement, slides: { image: string }[]): { cleanup(): void }`. It replaces `createCarousel` and keeps its timer, `isUserPaused` and reduced-motion logic, with these changes:
  - the interval is 6000 ms
  - only stacked `<img alt="" class="hero-bg-slide">` elements inside an `aria-hidden="true"` wrapper, plus the Pause/Play button
  - no arrows, dots, captions or `aria-live`

- [ ] **Step 1: Write `homeContent.js`** with the six exports and the exact copy from the mockup (spec §4.2–§4.8). Category names in `CATEGORY_GROUPS` come from `CATEGORIES` (Task 3), never typed again. Images are imported from `src/assets/images/carousel-*.svg` for now.
- [ ] **Step 2: Rewrite `Carousel.js`** to `createHeroBackground` as specified. Remove the `CAROUSEL_SLIDES` export.
- [ ] **Step 3: Hero markup** in `HomeView.js`:
  - `<section class="hero" aria-labelledby="hero-heading">` containing the background mount, the cream overlay (spec §4.2 gradient) and left-aligned content
  - eyebrow "Used tools, shared nearby"
  - h1 with `<span class="hero-title-accent">Share what you have.</span>`
  - `HERO_BULLETS` as a `<ul>`
  - the existing search form (keep `id="hero-search-form"`, `id="hero-search-input"` and the submit handler)
  - `.btn-accent` "Explore all items" (`#/catalog`) and `.btn-outline` "List an item" (`#/list-item`)
- [ ] **Step 4: Styles.**
  - h1 `font-size: clamp(2.75rem, 7vw, 5.25rem); line-height: 1; letter-spacing: -0.035em`
  - `.hero-title-accent { color: var(--color-accent-text) }`
  - bullet dots `--color-accent-fill` with a 1px `--color-accent-text` ring
  - search bar `--color-surface` with a `--color-border-strong` border
  - slides `position: absolute; inset: 0; object-fit: cover; opacity: 0; transition: opacity 1s ease`, with `.is-active` at opacity 1
  - Pause/Play at the top end corner
- [ ] **Step 5: Check.** `npm run dev`:
  - Slides fade every 6 s.
  - Pause stops them, and they stay stopped after the mouse leaves.
  - With reduced motion emulated, one static image shows and the button is hidden.
  - At 320px the hero has no horizontal scroll and the Search button is fully visible.
- [ ] **Step 6: Run** lint, format check and build. Expected: pass.
- [ ] **Step 7: Commit:** `feat: rebuild hero with rotating photo background`.

### Task 5: About and category groups

**Files:**

- Modify: `src/views/HomeView.js` (replace the old categories section, lines 87–107; remove the local `CATEGORIES` constant)
- Modify: `src/style.css` (replace the categories rules)

**Interfaces:**

- Consumes: `CATEGORY_GROUPS` (Task 4), `.btn-outline` (Task 2).

- [ ] **Step 1: About section.**
  - `<section class="about-section" aria-labelledby="about-heading">`
  - eyebrow "About BorrowBox" (uppercase by CSS `text-transform`, colour `--color-accent-text`)
  - h2 "Why buy a tool you'll use twice?"
  - the mockup paragraph
  - a "See how it works" link with `href="#/"` and `data-scroll-target="how-it-works"`
- [ ] **Step 2: Groups section.**
  - `<section id="categories" aria-labelledby="categories-heading">` with h2 "Browse tools by category"
  - one `<article class="category-group">` per `CATEGORY_GROUPS` entry, alternating image side by index (odd index: `flex-direction: row-reverse` at ≥ 1024px only)
  - image with `alt={imageAlt}`
  - h3, description, and one `<a class="tool-link">` per category to `#/catalog?category=<encodeURIComponent(name)>`, each with the arrow icon
  - then a `.btn-outline` "View all items" link to `#/catalog`
- [ ] **Step 3: Styles.**
  - group panel `--color-surface`, `--color-border` border, radius `--radius-panel`, padding 24px
  - tool links `--color-bg` background, 18px radius, `min-height: 76px`
  - hover lift 2px plus a `--color-accent-text` border inside `@media (hover: hover)`
  - stacked single column below 1024px
- [ ] **Step 4: Check.** Each of the 6 links opens the catalog with its category in the URL. At 320px and 768px the panels stack with no overflow. Image order in the DOM is the same for every group, since only CSS reverses it.
- [ ] **Step 5: Run** lint, format check and build. Expected: pass.
- [ ] **Step 6: Commit:** `feat: add about section and category groups`.

### Task 6: Featured items, How it works, Got tools idle, Why BorrowBox, and scroll links

**Files:**

- Modify: `src/views/HomeView.js` (featured, how-it-works and CTA sections, lines 110–end of markup)
- Create: `src/utils/scrollToSection.js`
- Modify: `src/main.js` (one delegated click listener)
- Modify: `src/style.css`

**Interfaces:**

- Consumes: `HOW_STEPS`, `IDLE_POINTS`, `WHY_ITEMS` (Task 4); `renderItemCard`; `.btn-accent`.
- Produces: `scrollToSection(id: string): void`, which calls `document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })`. A delegated listener in `main.js` on `[data-scroll-target]` clicks: `preventDefault`; if `location.hash` is not `#/` or empty, set `location.hash = "#/"` and call `scrollToSection` after the route renders (`requestAnimationFrame`); otherwise call it directly.

- [ ] **Step 1: Featured items.** Keep the grid and `renderItemCard`. Restyle cards to `--color-surface`, `--color-border` and `--radius-card`. Keep the heading "Featured items in your area" and the `.view-all-link` in `--color-accent-text`.
- [ ] **Step 2: How it works.**
  - `<section id="how-it-works" aria-labelledby="how-heading">` with h2 "How BorrowBox works" and the intro line
  - `<ol>` of `HOW_STEPS` with 42px lime number circles (`--color-accent-fill` with `--color-on-accent` digits)
  - the sharing photo with `alt="One neighbour handing a cordless drill to another"`
- [ ] **Step 3: Got tools sitting idle?** h2, line, `IDLE_POINTS` with check icons in `--color-accent-text`, `.btn-accent` "List an item", and the garage photo with `alt="A tidy home garage with tools on a pegboard"`. Mirrored layout at ≥ 1024px.
- [ ] **Step 4: Why BorrowBox?** A lime panel (`--color-accent-fill`, radius 36px, `--color-on-accent` heading) with 5 cards (`--color-panel`, text `--color-panel-text`, descriptions `--color-panel-muted`, numbered lime squares).
- [ ] **Step 5: Scroll links.** Implement `scrollToSection` and the delegated listener.
  - From `#/`: clicking "How it works" in the header scrolls to the section.
  - From `#/dashboard`: it shows the home page and scrolls there, never the 404 view.
  - Focus moves to the section heading (`tabindex="-1"` on the h2).
- [ ] **Step 6: Check** at 320px, 768px and 1280px: no horizontal scroll. Tab order follows the visual order. `scrollToSection("missing")` does nothing and throws nothing.
- [ ] **Step 7: Run** lint, format check and build. Expected: pass.
- [ ] **Step 8: Commit:** `feat: add how-it-works, idle-tools and why sections`.

### Task 7: Remaining pages inherit the theme

**Files:**

- Modify: `src/style.css` (`.placeholder-view`, `.btn-primary` and any leftover rule)
- Modify: `src/main.js` (placeholder views: replace inline `style=` attributes with classes)

- [ ] **Step 1:** Replace `.btn-primary` uses in placeholder views with `.btn-accent`. Move the inline `style="margin-top…"` attributes into a `.placeholder-actions` class.
- [ ] **Step 2: Check** `#/catalog`, `#/list-item`, `#/dashboard`, `#/item/item-101` and an unknown route: cream background, new fonts, header and footer present, readable text.
- [ ] **Step 3: Run** lint, format check and build. Then `grep -n "style=" src/main.js`. Expected: no matches.
- [ ] **Step 4: Commit:** `style: apply cream theme to placeholder pages`.

### Task 8: Real photos (blocked until the user sends them)

**Files:**

- Create: `src/assets/photos/01-power-tools.<ext>` … `07-outdoor-equipment.<ext>`
- Modify: `src/content/homeContent.js` (image imports only)

- [ ] **Step 1: Inspect each file** in an isolated scratchpad folder first: no text, labels or border; at least 1600px wide; landscape. Reject and report any that fail.
- [ ] **Step 2: Format.** WebP conversion needs an encoder. The machine has none (Pillow is not installed), and adding one breaks the no-new-packages rule. **Ask the user** to choose before continuing:
  - (a) send JPGs exported at quality 80, at most 1600px wide and at most 250 KB each, used as they are; or
  - (b) approve installing Pillow for a one-off conversion outside the project.
- [ ] **Step 3: Copy** the approved files into `src/assets/photos/` and switch the imports in `homeContent.js`. Remove `src/assets/images/carousel-*.svg` and `src/assets/hero.png` only if nothing still imports them (`grep -rn "carousel-\|hero.png" src`).
- [ ] **Step 4: Measure hero contrast** over each hero photo: sample the darkest and lightest regions behind the text. Composite the overlay at that x-position and compute the ratio for h1, `.hero-title-accent`, bullets and the eyebrow. Expected: ≥ 4.5 for normal text and ≥ 3 for the h1. If not, raise the overlay alpha at that stop and re-measure.
- [ ] **Step 5: Check** total photo weight: `du -ch src/assets/photos/*`. Expected: at most 1.75 MB for all 7. Then `npm run build`, and the page loads with no broken image.
- [ ] **Step 6: Commit:** `feat: add real photos to home page`.

### Task 9: Final verification

- [ ] **Step 1:** Run `npm run lint && npm run format:check && npm run build`. Expected: all pass.
- [ ] **Step 2:** Spec §8 checklist in the browser at 320, 768 and 1280px. Record each result.
- [ ] **Step 3:** Regression: Search button visible at 320px; Pause/Play; active nav link; focus to `<main>` after a route change; hover rules gated; no console errors.
- [ ] **Step 4:** Run the `better-interface` review on the new home page. Fix any `HIGH` finding before calling the work done.
