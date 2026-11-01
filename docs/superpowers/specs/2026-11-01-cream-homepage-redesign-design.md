# BorrowBox Cream Home Page Redesign: Design Specification

**Version:** 1.0.0
**Date:** 2026-11-01
**Status:** Draft (awaiting user review)
**Builds on:** `docs/superpowers/specs/2026-10-30-borrowbox-design.md` v1.4.0 (product spec). Where the two differ, this document governs visual design and home page structure only. Product rules (categories, borrowing, security) stay in v1.4.0.
**Design reference:** "BorrowBox - full page" mockup (dark), re-coloured to a single cream theme.

---

## 1. Goal

Replace the current sage-green look with the full-page mockup's layout and type, in **one warm cream theme**, while keeping the app's existing content, routes and accessibility fixes.

**Success means:**

- The home page follows the section order in §4 and matches the mockup's spacing, radii and type scale.
- Every text pair meets WCAG 2.2 AA (4.5:1 text, 3:1 large text and UI boundaries), measured.
- No horizontal scroll or clipped control at 320px, 768px and 1280px.
- Earlier fixes still hold: Search button visible at 320px, carousel Pause/Play, correct active nav link, focus moves to `<main>` on route change, hover styles only on hover-capable devices.

## 2. Decisions (approved in brainstorming)

| #   | Decision                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Apply the mockup's look to the whole site and keep existing content (not a literal copy).                                                                                                                                                               |
| D2  | **Cream theme only.** No dark theme and no theme toggle. Colours are tokens, so a dark theme can be added later.                                                                                                                                        |
| D3  | Navbar keeps app links: **Explore**, **How it works**, **My activity**, plus a lime **List an item** button and the existing profile button with the demo persona switcher. Mockup links About, Help center, Contact and the Arabic button are dropped. |
| D4  | Categories show as **3 groups** linking to the **6 spec categories** (§4.4). No sub-category level is added.                                                                                                                                            |
| D5  | Sections without real content are dropped: Communities, Partners, the floating chat button. The footer shows real content only.                                                                                                                         |
| D6  | The rotating carousel images become the **Hero background**. Arrows, dots and slide captions are removed; Pause/Play stays.                                                                                                                             |
| D7  | Real photos supplied by the user (§6). Until they arrive, the existing SVG illustrations are used as placeholders.                                                                                                                                      |

## 3. Visual system

### 3.1 Colour tokens (all measured)

| Token                   | Value     | Role                                                                 | Contrast                    |
| ----------------------- | --------- | -------------------------------------------------------------------- | --------------------------- |
| `--color-bg`            | `#F6F1E4` | Page background                                                      | n/a                         |
| `--color-surface`       | `#FFFBF2` | Cards, search bar, group panels                                      | n/a                         |
| `--color-text`          | `#14211A` | Body text and headings                                               | 14.75 on bg                 |
| `--color-text-muted`    | `#4A5A4F` | Secondary text                                                       | 6.50 on bg, 7.09 on surface |
| `--color-accent-fill`   | `#B8F35C` | Button, logo and step-number **backgrounds** only                    | n/a                         |
| `--color-on-accent`     | `#14211A` | Text on accent fill                                                  | 12.69                       |
| `--color-accent-text`   | `#3E6B1F` | Coloured text, links, eyebrow labels, focus ring, lime-button border | 5.60 on bg, 6.11 on surface |
| `--color-border`        | `#E2DACA` | Decorative dividers only                                             | n/a (decorative)            |
| `--color-border-strong` | `#7C8576` | Input and search-bar borders                                         | 3.40 on bg, 3.71 on surface |
| `--color-panel`         | `#14211A` | Dark cards inside the "Why BorrowBox?" box                           | n/a                         |
| `--color-panel-text`    | `#EAF3EC` | Text on panel                                                        | 14.68                       |
| `--color-panel-muted`   | `#C3D3C7` | Secondary text on panel                                              | 10.67                       |

Rules:

- `--color-accent-fill` is never used for text on cream (1.16:1).
- Lime buttons on cream get `border: 1px solid var(--color-accent-text)` so their shape is visible.
- Focus ring: `outline: 3px solid var(--color-accent-text); outline-offset: 2px`.
- The old tokens (`--color-text-charcoal`, `--color-surface-sage`, `--color-accent-solid`, and so on) are replaced by these role names across `src/style.css`.

### 3.2 Typography

| Font          | Use              | Weights loaded     |
| ------------- | ---------------- | ------------------ |
| Space Grotesk | h1, h2, h3, logo | 500, 600, 700      |
| DM Sans       | All other text   | 400, 500, 600, 700 |
| Tajawal       | Arabic fallback  | 400, 500, 700      |

Inter is removed. Sizes from the mockup: h1 `clamp(2.75rem, 7vw, 5.25rem)` with line-height 1 and letter-spacing -0.035em; h2 `clamp(2rem, 4vw, 2.625rem)`; h3 2rem; body 1.0625–1.25rem with line-height 1.6–1.8.

### 3.3 Shape and motion

- Radii: buttons `999px`; tool links `18px`; cards and photos `22–28px`; large panels `32–36px`.
- Hover lift: `translateY(-2px)` and border colour change, inside `@media (hover: hover)`, with `transition` on the named properties only.
- All movement is disabled under `prefers-reduced-motion: reduce`.

## 4. Home page structure (top to bottom)

### 4.1 Header (`Navbar.js`, all pages)

Lime logo square plus "BorrowBox" in Space Grotesk. Links: Explore (`#/catalog`), How it works (scrolls to §4.6 on the home page), My activity (`#/dashboard`). Then the lime "List an item" link (`#/list-item`) and the existing profile button and persona dropdown. The mobile menu behaviour is unchanged.

### 4.2 Hero

- Background: 3 photos (power tools, gardening, camping) stacked, cross-fading every 6 s using the existing `Carousel.js` timer logic.
- Overlay: `linear-gradient(90deg, rgba(246,241,228,.95) 0%, rgba(246,241,228,.82) 50%, rgba(246,241,228,.4) 100%)`.
- Content, left-aligned: eyebrow "Used tools, shared nearby"; h1 "Borrow what you need. **Share what you have.**" (second sentence in `--color-accent-text`); 3 bullet points; the existing search form; buttons "Explore all items" (lime) and "List an item" (outlined).
- Pause/Play button top-right. Images are decorative (`alt=""`, `aria-hidden="true"`).
- Text contrast over the overlay is re-measured against the real photos once they arrive. If any pair fails, the overlay opacity is raised.

### 4.3 About

Eyebrow "ABOUT BORROWBOX", h2 "Why buy a tool you'll use twice?", the mockup paragraph, and a "See how it works" link that scrolls to §4.6.

### 4.4 Browse tools by category

h2 plus 3 alternating panels (image left, image right, image left). Each panel has a photo, h3, description and category links to `#/catalog?category=<name>`:

| Group               | Photo             | Links                                 |
| ------------------- | ----------------- | ------------------------------------- |
| Tools               | power tools       | Power Tools, Hand Tools               |
| Garden and outdoors | outdoor equipment | Gardening, Camping, Outdoor Equipment |
| Home and cleaning   | cleaning          | Cleaning                              |

Then an outlined "View all items" link to `#/catalog`. Group copy lives in `src/content/homeContent.js`.

### 4.5 Featured items

The existing featured grid using `renderItemCard`, restyled to the new tokens and radii. (Not in the mockup; kept per D1.)

### 4.6 How it works

h2, intro line, 4 numbered steps (lime number circles), and the "neighbor tool sharing" photo.

### 4.7 Got tools sitting idle?

h2, line, 3 check-mark points, a lime "List an item" button, and the "garage tools" photo. The layout is mirrored relative to §4.6.

### 4.8 Why BorrowBox?

A lime panel (`--color-accent-fill`, radius 36px) with an h2 and 5 dark cards (`--color-panel`): Less waste, Refundable deposits, Verified neighbors, Ratings you can trust, Pickup nearby. Copy from the mockup.

### 4.9 Footer (`Footer.js`, all pages)

Brand, tagline, lime "List an item"; Quick links (Explore, How it works, My activity); Categories (the 6 spec categories, linking to the catalog); bottom line "© 2026 BorrowBox. Deposits are simulated." No address, phone, email or social links.

## 5. Code changes

| File                                 | Change                                                                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                         | New Google Fonts link (§3.2).                                                                                                          |
| `src/style.css`                      | New tokens; restyle header, buttons, item cards and search; new sections for §4.2–§4.9; remove carousel arrow, dot and caption styles. |
| `src/components/Navbar.js`           | Links per §4.1.                                                                                                                        |
| `src/components/Carousel.js`         | Becomes the Hero background: slides only, Pause/Play, reduced-motion handling, `aria-live` removed (images are decorative).            |
| `src/views/HomeView.js`              | Rebuilt to §4 order, reading copy from `homeContent.js`.                                                                               |
| `src/main.js`                        | Mounts `Footer.js` after `<main>`.                                                                                                     |
| **New** `src/components/Footer.js`   | §4.9.                                                                                                                                  |
| **New** `src/content/homeContent.js` | Groups, steps, why-cards and hero bullet text.                                                                                         |
| **New** `src/assets/photos/*.webp`   | 7 photos (§6).                                                                                                                         |

`ItemCard.js` markup is unchanged.

**"How it works" scrolling:** the app routes on the URL hash, so `#how` would be treated as an unknown route. The nav link and the "See how it works" link use `href="#/"` with a click handler that navigates home if needed and then calls `scrollIntoView` on `#how-it-works`, respecting reduced motion.

## 6. Photos

Supplied by the user as 1600×1000px landscape PNG or JPG, with no text, icons or borders. Main subject on the right for hero images.

| File                       | Used in                   |
| -------------------------- | ------------------------- |
| `01-power-tools`           | Hero, Tools group         |
| `02-gardening`             | Hero                      |
| `03-camping`               | Hero                      |
| `04-cleaning`              | Home and cleaning group   |
| `05-neighbor-tool-sharing` | How it works              |
| `06-garage-tools`          | Got tools sitting idle?   |
| `07-outdoor-equipment`     | Garden and outdoors group |

Converted to WebP, at most 1600px wide, target at most 200 KB each, stored in `src/assets/photos/` (local only, per product spec decision 3). Content photos (§4.4, §4.6, §4.7) get descriptive `alt` text; hero photos are decorative.

## 7. Out of scope

Dark theme and theme toggle; Arabic translation (now specified in the product spec §10, v1.5.0); Communities and Partners sections; chat; About, Help center and Contact pages; sub-categories; changes to the catalog, item detail or dashboard pages beyond inheriting the new tokens, header and footer.

## 8. Verification

1. `npm run lint`, `npm run format:check`, `npm run build` pass.
2. Contrast for every pair in §3.1, plus hero text over each real photo, measured and recorded.
3. 320px, 768px and 1280px: no horizontal scroll, nothing clipped.
4. Keyboard: Tab through header, hero, groups, footer; visible focus on every stop; persona dropdown still works.
5. Carousel: Pause stops rotation and stays paused after hover or focus leaves; reduced motion shows one static image and hides the button.
6. "How it works" links scroll correctly from the home page and from another route.
7. Regression: active nav link, focus to `<main>` after route change, no console errors.
