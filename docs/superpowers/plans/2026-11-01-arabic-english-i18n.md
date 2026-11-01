# Arabic and English Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users switch the whole BorrowBox interface between English and Arabic, with correct right-to-left layout, without a page reload.

**Architecture:** Interface text moves into two flat dictionaries read through `t()`. `setLang()` saves the choice, sets `lang`/`dir` on `<html>` and fires `borrowbox:langchange`. `main.js` re-renders the Header, Footer and current view, the same way it already handles `borrowbox:userchange`, while keeping form values, scroll and focus. CSS mirrors through logical properties and `[dir="rtl"]` rules.

**Tech Stack:** Vite 8, vanilla ES modules, `Intl.NumberFormat`, `node:test`. No new packages.

**Spec:** `docs/superpowers/specs/2026-10-30-borrowbox-design.md` §10 (v1.5.0). Also read §4.1, §5 and §8.3.

## Global Constraints

- Valid languages: `en` (default) and `ar` only. Storage key `borrowbox_lang`; the stored value is the plain string `en` or `ar` (not JSON).
- Every storage access is inside `try/catch`. A failure means English.
- `en.js` and `ar.js` have identical key sets, and no Arabic value is empty.
- Translated text goes in through `textContent`, or `escapeHtml(t(...))` inside HTML string templates. Translations never contain HTML.
- Data and URLs keep English category names, statuses, conditions and roles. Only their displayed text is translated.
- User-written text (item title, description, condition notes, owner name) is never translated.
- Digits are always Western (`numberingSystem: "latn"`).
- No new npm packages. No full-page reload to switch languages.
- Arabic copy is clear Modern Standard Arabic, natural interface wording (glossary below). All Arabic lives in `ar.js`.
- `npm test`, `npm run lint`, `npm run format:check` and `npm run build` pass after every phase.
- No commits until the user says so.

## Arabic glossary (keep these consistent)

| English                                                                       | Arabic                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Explore                                                                       | استكشف                                                                    |
| How it works                                                                  | كيف يعمل                                                                  |
| My activity                                                                   | نشاطي                                                                     |
| List an item                                                                  | اعرض أداة                                                                 |
| Search                                                                        | بحث                                                                       |
| Refundable deposit                                                            | تأمين مسترد                                                               |
| Free to borrow                                                                | استعارة مجانية                                                            |
| Request to borrow                                                             | اطلب الاستعارة                                                            |
| Available / Reserved / Unavailable                                            | متاح / محجوز / غير متاح                                                   |
| Like New / Excellent / Good / Fair                                            | كالجديد / ممتازة / جيدة / مقبولة                                          |
| Owner / Borrower / New Member                                                 | مالك / مستعير / عضو جديد                                                  |
| Power Tools · Hand Tools · Gardening · Cleaning · Camping · Outdoor Equipment | أدوات كهربائية · أدوات يدوية · البستنة · التنظيف · التخييم · معدات خارجية |

## Review Focus

1. **Blocked storage:** `localStorage` throws in some private modes. Both the inline script and `i18n.js` must still render English, and switching must still work for the visit. Tests in Phases 1–2.
2. **Typed dates lost on switch:** a user who filled in From/To on an item page and then switches language must keep both values. Browser check in Phase 3.
3. **Focus lost on switch:** re-rendering the Header destroys the button the user just pressed. Focus must land on the new language button. Browser check in Phase 3.
4. **Category links broken by translation:** an Arabic page must still link to `?category=Power%20Tools`, and `parseCatalogParams` must still accept it. Test in Phase 5.
5. **Arrows pointing the wrong way, or Play flipped:** in RTL the back and "see how it works" arrows point left-to-right reversed, while Play/Pause and the search icon do not flip. Browser check in Phase 6.

---

### Phase 1: Language initialization and no-flash behavior

**Files:** Modify `index.html`. Create `src/i18n/i18n.js` (storage functions only in this phase). Create `tests/i18n.test.js`.

**What changes:**

- `index.html`: `<html lang="en" dir="ltr">`, plus a short inline `<script>` in `<head>`, before the stylesheet link. Inside `try/catch` it reads `localStorage.getItem("borrowbox_lang")` and, if it is exactly `"ar"`, sets `document.documentElement.lang = "ar"` and `.dir = "rtl"`. Otherwise it does nothing.
- `i18n.js`: `readStoredLang(storage = globalThis.localStorage): "en" | "ar"` and `saveLang(lang, storage = globalThis.localStorage): boolean`, both in `try/catch`.

**Why:** setting `lang`/`dir` before the first paint stops the page flashing English or LTR before switching (spec §10.2). The storage functions take a `storage` parameter so Node can test them with a fake, the same pattern as `src/store/storage.js`.

**Depends on:** nothing.

**Tests first (`tests/i18n.test.js`):**

- `readStoredLang` returns `"ar"` for a stored `"ar"`.
- It returns `"en"` for a missing value, `"fr"`, `"AR"`, `""` and `'"ar"'` (JSON-quoted).
- It returns `"en"` when `getItem` throws.
- `saveLang` returns `false`, without throwing, when `setItem` throws.

Run `npm test`: the tests fail (module missing), then pass after implementation.

**Browser:** with `borrowbox_lang=ar` set, a hard reload has `<html dir="rtl">` already in place at `DOMContentLoaded`. With storage blocked (simulated by overriding `localStorage.getItem` to throw before reload), the page loads in English.

### Phase 2: Translation dictionaries and i18n module

**Files:** Create `src/i18n/en.js`, `src/i18n/ar.js`. Complete `src/i18n/i18n.js`. Extend `tests/i18n.test.js`.

**What changes:**

- `en.js` / `ar.js`: `export default { "nav.explore": "Explore", ... }` with every interface string from Phase 4's inventory. Placeholders use `{name}`.
- `i18n.js` adds:
  - `getLang(): "en" | "ar"` (in-memory, initialized from `readStoredLang()`)
  - `setLang(lang): "en" | "ar"` (normalizes; saves; sets `document.documentElement.lang/dir` when `document` exists; dispatches `borrowbox:langchange`)
  - `t(key, values = {}): string` (current language → English → the key; replaces `{name}` with `String(values.name)`; unknown placeholders stay as written)
  - `formatMoney(amount): string` (Phase 8)
- `i18n.js` must not touch `document` or `window` at import time, so Node can import it.

**Why:** one place for all wording (spec §10.3). The user can edit Arabic copy without touching components.

**Depends on:** Phase 1.

**Tests first:**

- English and Arabic key sets are equal: same count, and no key missing on either side, with the missing keys listed in the failure message.
- Every Arabic value is a non-empty string after trimming.
- `t("x", { name: "Alex" })` with a test dictionary entry `"Hello {name}"` gives `"Hello Alex"`. A missing value leaves `{name}` in place.
- In Arabic, a key present only in English returns the English text, through an injected test dictionary.
- An unknown key returns the key itself, never `""`.
- `setLang("de")` results in `getLang() === "en"`.

### Phase 3: Language switcher and re-rendering

**Files:** Modify `src/components/Navbar.js`, `src/main.js`, `src/components/Carousel.js`, `src/style.css` (button style).

**What changes:**

- `Navbar.js`: a `<button type="button" class="lang-switch" lang="ar">العربية</button>` in `.nav-controls`, before the profile button. In Arabic it reads `English` with `lang="en"`. Clicking calls `setLang(other)`. It also shows in the mobile layout, without overflow at 320px.
- `main.js`:
  - `renderFooter()` moves into a function called at startup and on language change.
  - A `borrowbox:langchange` listener runs spec §10.7: `snapshotFields(viewContainer)` (a `Map` of `id → value` for `input`, `select` and `textarea` that have an `id`, skipping `type="password"` and `type="file"`), saves `window.scrollY`, re-renders the Header and Footer, calls `handleRoute()`, restores the fields and scroll, then focuses `.lang-switch`.
  - `handleRoute()` keeps calling the current view's cleanup before mounting, as it does today.
- `Carousel.js`: the user's paused state is kept in a module-level variable, so a paused slideshow stays paused after re-render.

**Why:** spec §10.1 and §10.7. Switching must keep route, persona, typed data, scroll and focus, without a reload.

**Depends on:** Phase 2.

**Tests:** browser.

- On `#/item/item-101` as Alex, type dates, switch to Arabic: the dates are still filled in, the URL is unchanged, the persona is still Alex, and focus is on the language button.
- Pause the hero slideshow, then switch: it stays paused.
- The network panel shows no document reload.

### Phase 4: Translate all interface text

**Files:** Modify `src/components/Navbar.js`, `src/components/Footer.js`, `src/components/ItemCard.js`, `src/components/Carousel.js` (button labels), `src/views/HomeView.js`, `src/content/homeContent.js`, `src/views/ItemDetailView.js`, `src/main.js` (placeholder views, 404, `document.title`), `src/i18n/en.js`, `src/i18n/ar.js`.

**What changes:**

- Every hard-coded interface string becomes `t("key")`: visible text, `aria-label`, `placeholder`, `alt` text of decorative-free content images, page titles, and the booking `MESSAGES` map.
- `homeContent.js` keeps data shape and images, but text fields become keys (for example `titleKey: "home.groups.tools.title"`), resolved by `HomeView` at render time.
- Values inside translations are escaped: `escapeHtml(t("nav.profileLabel", { name }))`.
- Placeholder pages (`#/catalog`, `#/list-item`, `#/dashboard`, 404) are translated, so the spec's "all pages" requirement holds for pages that exist today.

**Why:** spec §10.3–§10.4.

**Depends on:** Phase 2. Phase 3 is needed to see it switch live.

**Tests:**

- Dictionary parity from Phase 2 catches any key added to one file only.
- A grep check fails if a view or component still contains a capitalized English literal between tags or in an `aria-label`. Allowed exceptions (brand name "BorrowBox", data fields) are listed in the test.
- Browser: walk every page in Arabic and confirm no English interface text remains.

### Phase 5: Category and fixed-value display translation

**Files:** Modify `src/content/categories.js`, `src/components/Footer.js`, `src/views/HomeView.js`, `src/components/ItemCard.js`, `src/views/ItemDetailView.js`, `src/components/Navbar.js` (persona role), dictionaries.

**What changes:**

- `categories.js` adds `categoryLabel(name): string`, which returns `t("category." + name)`. `CATEGORIES` and `categoryHref(name)` are unchanged.
- Same pattern for status (`status.Available`), condition (`condition.Excellent`) and role (`role.Owner`). Class names such as `status-available` keep the English value.

**Why:** spec §10.4. URLs and stored data must not change with the language.

**Depends on:** Phases 2 and 4.

**Tests first:**

- `CATEGORIES` deep-equals the six English names.
- `categoryHref("Power Tools")` is `"#/catalog?category=Power%20Tools"` whatever the current language.
- `parseCatalogParams` still accepts each English name.
- In Arabic, `categoryLabel("Power Tools")` is `"أدوات كهربائية"`.
- `renderItemCard` in Arabic keeps `href="#/item/item-101"` and `status-available` in the markup.

### Phase 6: RTL CSS and directional icons

**Files:** Modify `src/style.css`, plus the components that render arrows (`HomeView.js`, `ItemDetailView.js`).

**What changes:**

- Replace the physical properties found in the inspection:
  - `.skip-link` `left` → `inset-inline-start`
  - `.profile-dropdown` `right: 0` → `inset-inline-end: 0`
  - `.persona-item-btn` `text-align: left` → `start`
  - `.item-card-badge` `right` → `inset-inline-end`
  - Symmetric `left: 0; right: 0` pairs stay.
- Directional arrow SVGs get a class `icon-directional`, with `[dir="rtl"] .icon-directional { transform: scaleX(-1); }`. The text arrow `←` in "Back to catalog" moves into the dictionary, so Arabic uses `→`.
- Pause/Play, search, check and logo icons get no class.

**Why:** spec §10.5.

**Depends on:** Phase 3, to switch and inspect.

**Tests:**

- `grep -nE "^\s*(left|right|margin-left|margin-right|padding-left|padding-right):|text-align: (left|right)" src/style.css` lists only the allowed symmetric pairs.
- Browser in Arabic: nav order mirrored, the profile dropdown opens toward the inside, the item page booking panel is on the left, and arrows point the reading direction.

### Phase 7: Arabic typography

**Files:** Modify `src/style.css`.

**What changes:**

- `:root[lang="ar"] { --font-body: "Tajawal", system-ui, sans-serif; --font-heading: "Tajawal", system-ui, sans-serif; }`
- `[lang="ar"]` rules reset every negative `letter-spacing` to `0`, set `text-transform: none` on eyebrow labels, and map `font-weight: 600` text to `700` (Tajawal is loaded at 400, 500 and 700).
- Arabic body line-height at least 1.7 where English uses 1.6.
- English rules are unchanged.

**Why:** spec §10.6. Negative tracking and uppercase break or mean nothing in Arabic, and Space Grotesk and DM Sans have no Arabic glyphs.

**Depends on:** Phase 3.

**Tests:**

- Browser: computed `font-family` of `h1` and `body` starts with Tajawal in Arabic and Space Grotesk / DM Sans in English.
- Computed `letter-spacing` of `.hero-title` and `.section-title` is `normal` or `0px` in Arabic.
- `document.fonts` shows Tajawal loaded.

### Phase 8: Currency formatting

**Files:** Modify `src/i18n/i18n.js`, `src/components/ItemCard.js`, `src/views/ItemDetailView.js`. Extend `tests/i18n.test.js`.

**What changes:**

- `formatMoney(amount)` uses `Intl.NumberFormat(lang === "ar" ? "ar" : "en-US", { style: "currency", currency: "USD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0, numberingSystem: "latn" })`. Non-finite input formats as 0.
- Replace both `"$" + deposit.toFixed(0)` sites with `formatMoney(deposit)`.

**Why:** spec §10.3. One formatter, Western digits in both languages, and the currency convention the project already uses (whole US dollars).

**Depends on:** Phase 2.

**Tests first:**

- `formatMoney(45)` in English is `"$45"`.
- In Arabic the result contains `45` and `$`, and matches no Arabic-Indic digit (`/[٠-٩]/` fails).
- `formatMoney("abc")` contains `0`.
- `formatMoney(1234)` in English is `"$1,234"`.

### Phase 9: Automated test suite completion

**Files:** `tests/i18n.test.js` (from Phases 1, 2, 5 and 8); existing `tests/security.test.js`, `tests/requests.test.js`, `tests/storage.test.js` unchanged.

**What changes:** confirm every required automated test exists and passes:

| Requirement                       | Test           |
| --------------------------------- | -------------- |
| Dictionaries have matching keys   | Phase 2        |
| No empty Arabic values            | Phase 2        |
| `t()` interpolation               | Phase 2        |
| Arabic falls back to English      | Phase 2        |
| Invalid language → English        | Phases 1 and 2 |
| `formatMoney` uses Western digits | Phase 8        |
| `localStorage` failures handled   | Phase 1        |
| Category data and URLs unchanged  | Phase 5        |

Plus the Phase 4 literal-text check.

**Depends on:** Phases 1–8.

**Tests:** `npm test` reports all suites passing, with the count recorded in the final report.

### Phase 10: Browser verification and responsive testing

**Files:** none changed unless a check fails. Each fix is tested first, in the phase it belongs to.

**Checks** (run at 320px, 768px and 1280px, recording each result):

1. Switch English → Arabic: text, `lang`, `dir` and the button label (`English`, `lang="en"`) change.
2. Switch Arabic → English: the reverse.
3. Reload in Arabic: still Arabic, and `<html dir="rtl">` is set before the first paint. Check with the Performance panel or by asserting the attribute in an inline `DOMContentLoaded` probe.
4. After switching on `#/catalog?category=Gardening`, `#/item/item-101` and `#/dashboard`: same hash, same persona.
5. RTL mirroring on every page: home, catalog placeholder, item detail, list-item placeholder, dashboard placeholder, 404, Header (desktop and mobile menu), profile dropdown, Footer.
6. Booking form in Arabic: each validation message from the item detail spec §3 appears in Arabic next to the right field, `aria-invalid` is set, and focus moves to the field.
7. No horizontal overflow at 320px in either language (`document.documentElement.scrollWidth === clientWidth`).
8. Keyboard: tab through the Header in Arabic; focus is visible and the order follows the mirrored layout.
9. No console errors in either language.
10. Regression: the earlier redesign and XSS checks still pass (Search button visible at 320px, Pause/Play, active nav link, URL injection shows as text).

**Depends on:** Phases 1–9.

## Out of scope

Translating item content written by users; more languages; translated URLs; server-side language detection; Arabic-Indic digits.
