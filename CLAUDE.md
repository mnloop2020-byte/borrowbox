# Project Rules — BorrowBox

## 1. Technology Stack

- Use Vite with React, TypeScript, HTML, and CSS (sةct mode, see `tsconfig.json`).
- The app is moving to React one page at a time. Pages not moved yet are old `mountXView()` functions that `src/app/LegacyView.tsx` runs inside React. A moved page is a component; when no page uses `LegacyView`, delete it.
- Do not add other frameworks or a router package unless explicitly requested.
- Use native browser APIs whenever practical.

## Architecture

Files are grouped by feature. To fix a bug, open the folder of the feature it is in.

- `src/main.tsx`: starts React and draws `<App />` into `#app`.
- `src/app/`: the frame around every page. `App.tsx` is the shell and the hash router (`#/`, `#/catalog`, `#/item/:id`, `#/list-item`, `#/dashboard`, `#/register`): it picks a page in `renderRoute()` and handles app-wide events. `LegacyView.tsx` (the temporary bridge), `Navbar.ts` (with the language and persona switch), `Footer.tsx`, `NotFoundView.tsx`.
- `src/features/<feature>/`: everything for one feature. A React page is `XView.tsx`: it exports the component `XView` and sets the tab title with `usePageTitle()`. A page not moved yet is `XView.ts`: it exports `mountXView(container, ...)` and returns a `MountedView` (`{ title, cleanup }`).
  - `home/`: `HomeView.ts`, `homeContent.ts` (the home sections).
  - `items/`: `itemRecords.ts` (**the one list of items**, no photos, so the server reads it too), `itemsData.ts` (adds each item's photo), `listItems.ts` (all items with today's status), `categories.ts`, `ItemCard.tsx` (the card), `itemCardData.ts` (pure: the checked image, id and status a card shows), `itemCardHtml.ts` (the old string card, kept until the home page moves to React), `ItemDetailView.tsx` (the item page), `itemId.ts` (the id check, also used by the router and the server).
  - `requests/`: borrow requests. `requestRules.ts` (pure rules: dates, overlap, duplicates), `requestStore.ts` (saving in `localStorage`), `requestsApi.ts` (sending to the API), `BorrowForm.tsx` (the dates form on the item page).
  - `users/`: `demoUsers.ts` and `userStore.ts` (the current user).
  - `catalog/`: `CatalogView.tsx` (search, category chips, item grid), `catalogFilter.ts` (pure: which items match) and `catalogParams.ts` (the allowed URL filters).
  - `register/`, `dashboard/`, `list-item/`: one page each (dashboard and list item are placeholders).
- `src/shared/`: code many features use. **It never imports from `features/` or `app/`.**
  - `api/client.ts`: `postJson()` sends JSON with `fetch` and returns `{ ok: true, data }` or `{ ok: false, status }`.
  - `ui/`: `toast.ts` (`showToast()`), `PlaceholderCard.tsx` (the card of placeholder and "not found" pages) and `BackIcon.tsx`. `icons.ts` is the old string arrow, kept until the home page moves to React.
  - `i18n/`: `en.ts` and `ar.ts` dictionaries with the same keys, and `t()`, `setLang()`, `formatMoney()`.
  - `lib/`: pure functions (`html.ts` escaping, `dates.ts`). No DOM and no `localStorage`, so Node can test them.
  - `browser/`: helpers that use browser features: `dom.ts` (`getElement()`), `storage.ts`, `formFields.ts`, `reveal.ts`, `scrollToSection.ts`, `usePageTitle.ts` (a React hook that sets the tab title).
  - `types.ts`: shared data shapes (`Item`, `User`, `BorrowRequest`, `Lang`, `MountedView`). Types only, no runtime code.
- `src/style.css`: all styles, organized in commented sections. Colours, sizes and motion come from the tokens in `DESIGN.md`.
- `server/`: the JSON API (Node's `http` module, no packages), started with `npm run api`. During `npm run dev`, Vite forwards `/api` requests to it (`vite.config.ts`). Data is kept in memory.
- `tests/`: `node:test` unit tests for requests, the catalog filter and item list, security (escaping and URL checks), storage and translations. `fakes.ts` builds complete test objects.

## Where a New Feature Goes

Make one folder for it: `src/features/<feature>/`. Example: the "List an item" form (`#/list-item`), whose folder already exists.

1. **Data shape:** add or extend the types in `src/shared/types.ts`.
2. **Rules:** pure logic goes in the feature folder, like `src/features/catalog/catalogFilter.ts` with its tests in `tests/catalog.test.ts`. No DOM in rule files.
3. **Data access:** saving or loading goes in a store file in the feature (like `requests/requestStore.ts`); calls to the server go in an API file (like `requests/requestsApi.ts`) that uses `shared/api/client.ts`.
4. **Page:** `ListItemView.tsx` is a placeholder component, so replace its content. A brand new page gets a new `XView.tsx` component in its folder and one route in `renderRoute()` in `src/app/App.tsx`.
5. **Reuse:** use other features through their exports (the catalog reuses `items/ItemCard.tsx` and `items/listItems.ts`). A new item is added once, in `items/itemRecords.ts`, with its photo in `items/itemsData.ts`. Move code to `src/shared/` only when it is not about one feature.
6. **Text:** add every visible string to both `src/shared/i18n/en.ts` and `src/shared/i18n/ar.ts`. `npm test` fails if the keys differ.
7. **Styles:** add a commented section in `src/style.css` that uses the existing tokens and follows `DESIGN.md`.
8. **Check:** run `npm test`, `npm run lint` and `npm run typecheck`, then check the page in the browser at 320px, 768px and 1280px, in English and Arabic.

## 2. HTML

- Use semantic HTML elements such as `header`, `nav`, `main`, `section`, `article`, and `footer`.
- Every form input must have a properly associated `label`.
- Use native HTML form validation attributes such as `required`, `type`, and `minlength`.
- Maintain a logical heading hierarchy.
- Use accessible names for interactive elements.

## 3. CSS

- Follow a mobile-first approach.
- Write base styles for mobile screens first, then use `min-width` media queries for larger screens.
- Do not use `!important`.
- Use clear, consistent class names.
- Keep styles organized and avoid unnecessary duplication.

## 4. TypeScript

- Write `.ts` files, and `.tsx` only for files with JSX (components). Import with the extension (`from "./dates.ts"`), so Node can run the tests directly. Rule files and `src/shared/lib/` stay `.ts` with no React, so Node can test them.
- Use only erasable syntax (no `enum` or `namespace`); `tsconfig.json` enforces this.
- Type function parameters and return values. Use `unknown` for untrusted input, never `any`.
- Use `import type` for imports that are only types.
- Use `getElement<T>()` or `querySelector<T>()` with a null check instead of `!` or `as` on DOM lookups.

- Use ES modules with `import` and `export` when needed.
- Prefer `const` and use `let` when reassignment is necessary.
- Avoid global variables and unnecessary dependencies.
- Validate user input where appropriate.
- Keep functions small and focused.

## 4a. Security

- Treat URL parameters, `localStorage` data and form input as untrusted.
- Never put untrusted text into `innerHTML` without escaping it. Use `textContent` for single values and `escapeHtml()` inside HTML templates.
- Validate URL parameters against an allowlist (known categories and statuses, a pattern for item IDs).
- Only allow image URLs that are relative or use `https:`.

## 5. Code Quality

- Follow ESLint rules.
- Use Prettier to format code.
- Avoid unnecessary packages and configuration changes.
- Keep the project compatible with the existing Vite setup.
- Pure logic (rule files and `src/shared/lib/`) has tests run with `npm test` (Node's built-in `node:test`; no test packages).
- `npm run typecheck` (`tsc --noEmit`) must pass. The pre-commit hook runs it.

## 6. Development Workflow

- Inspect the existing files before making changes.
- Explain the purpose of each change in simple English.
- Do not delete or rewrite existing files unnecessarily.
- After significant changes, run ESLint and Prettier checks.
- Fix errors introduced by your changes.

## 7. Project Goal

Build BorrowBox, an accessible peer-to-peer tool-sharing web app.

Implement only the features explicitly requested. Keep the solution simple and suitable for a beginner-level university assignment.

## 8. Rules From Mistakes

### Check text color where the text actually sits

**The mistake:** The footer logo "BorrowBox" was dark text on the dark navy footer (contrast 1.3:1). The footer changed its color variable, but the logo had no color of its own, so it kept the dark color from `body`. The tests passed and the code looked right. Only Lighthouse found it.

**The rule:** After any color change, check the contrast of every text element against the background it sits on, including inside the dark footer and the dark "Why BorrowBox" panel. Text must reach 4.5:1 (3:1 for large text). Run Lighthouse accessibility before saying a page is done.

### Make sure a check can fail before trusting it

**The mistake:** The AI wrote a script to measure colour contrast, and it reported 0 failures on every page. A bug turned every ratio into `NaN`, and any comparison with `NaN` is false, so the script could never report a failure. Later, a search for Arabic text outside the dictionary also found nothing, but the README had an Arabic line.

**The rule:** Before trusting a check that says "all passed", break something on purpose and confirm that the check catches it. A check that cannot fail proves nothing.

### Fix type errors instead of hiding them

**The mistake:** To make TypeScript errors go away, the AI used `as` casts and `!` (for example `e.target as Node`). The code compiled, but the casts only told the compiler to trust us. If the value was wrong at runtime, the app would still break.

**The rule:** Do not use `any`, `as` or `!` (`as const` is fine). Check the value instead, for example `if (!(target instanceof Node)) return;`, or use `getElement<T>()`. In tests, build complete objects with a factory such as `makeItem()` instead of casting partial objects.
