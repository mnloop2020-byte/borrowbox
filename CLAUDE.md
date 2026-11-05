# Project Rules — BorrowBox

## 1. Technology Stack

- Vite, React 19 and TypeScript in strict mode (see `tsconfig.json`), with plain CSS.
- No other framework, router or state library unless explicitly requested. The router is a small hash router in `src/app/App.tsx`.
- Use React and native browser APIs before adding a package.

## Architecture

Files are grouped by feature. To fix a bug, open the folder of the feature it is in.

- `src/main.tsx`: starts React and draws `<App />` into `<div id="app">` (in `StrictMode`).
- `src/react-css.d.ts`: lets a `style` object set CSS variables (`style={{ "--i": 2 }}`).
- `src/app/`: the frame around every page.
  - `App.tsx`: the shell and the hash router (`#/`, `#/catalog`, `#/item/:id`, `#/borrow-list`, `#/list-item`, `#/dashboard`, `#/register`). `renderRoute()` picks the page; on a route change focus moves to `<main>`.
  - `Navbar.tsx` (menu, language and persona switch), `Footer.tsx`, `NotFoundView.tsx`.
- `src/features/<feature>/`: everything for one feature: its types (`types.ts`), rules, store and UI. A page is `XView.tsx`: it exports the component `XView` and sets the tab title with `usePageTitle()`.
  - `home/`: `HomeView.tsx`, `homeContent.ts` (the home sections).
  - `cards/`: the tools people lend (the data type is still `Item`, and links stay `#/item/:id`). `itemRecords.ts` (**the one list of items**, no photos, so the server reads it too), `cardsData.ts` (adds each item's photo: `SEED_CARDS`), `listCards.ts` (`listCards()`: all items with today's status), `categories.ts` (`CATEGORIES`, the `Category` union type built from it, and `isCategory()` for text from outside), `types.ts` (`Item`, `ItemStatus`), `ItemCard.tsx`, `itemCardData.ts` (pure: the checked image, id and status a card shows), `ItemDetailView.tsx`, `itemId.ts` (the id check, also used by the router and the server).
  - `requests/`: borrow requests. `types.ts` (`BorrowRequest`), `requestRules.ts` (pure rules: dates, overlap, duplicates), `requestStore.ts` (saving in `localStorage`), `requestsApi.ts` (sending to the API), `BorrowForm.tsx` (the dates form on the item page).
  - `users/`: `types.ts` (`User`, `UserRole`), `demoUsers.ts`, `userStore.ts` (the persona in use) and `useCurrentUser.ts` (its hook).
  - `catalog/`: `CatalogView.tsx` (search, category chips, sort, item grid), `catalogFilter.ts` (pure: which items match the name search and category, the categories from the data, and `sortItems()`, which sorts a copy) and `catalogParams.ts` (the allowed URL filters: `q`, `category`, `sort`).
  - `borrow-list/`: the borrow list (works like a cart). `types.ts` (`BorrowListEntry`), `borrowListRules.ts` (pure: add, more/fewer days, remove, the saved-data check), `borrowListStore.ts` (saving in `localStorage`, `subscribe()`), `useBorrowList.ts` (its hook), `AddToListButton.tsx` (passed to `ItemCard` as `action`) and `BorrowListView.tsx` (`#/borrow-list`). The Navbar shows the count.
  - `register/`, `dashboard/`, `list-item/`: one page each (dashboard and list item are placeholders).
- `src/shared/`: code many features use. **It never imports from `features/` or `app/`.**
  - `api/client.ts`: **the one API client** and the only place that calls `fetch`. `postJson()` sends JSON and returns `{ ok: true, data }` or `{ ok: false, status }`. Every failure is logged to the Console as one line, e.g. `[api] POST /api/requests failed: 500` (never the body). A new request type is added here, not with `fetch` in a page.
  - `ui/`: `toast.ts` (the toast list: `showToast()`), `Toasts.tsx` (draws it), `ScrollLink.tsx` (links to a home section such as "How it works"), `PlaceholderCard.tsx`, and the icons `BackIcon.tsx`, `ArrowIcon.tsx`, `SearchIcon.tsx`.
  - `i18n/`: `en.ts` and `ar.ts` dictionaries with the same keys; `i18n.ts` with `t()`, `setLang()`, `formatMoney()`; `useLang.ts` (its hook).
  - `lib/`: pure functions (`imageUrl.ts`, `dates.ts`). No DOM and no `localStorage`, so Node can test them.
  - `browser/`: helpers that use browser features: `storage.ts`, `reveal.ts` (scroll reveal), `scrollToSection.ts`, `usePageTitle.ts`.
  - `types.ts`: only `Lang`, the one shape `shared/` itself needs. Every other type lives in its feature's `types.ts`. Types only, no runtime code.
- `src/style.css`: all styles, organized in commented sections. Colours, sizes and motion come from the tokens in `DESIGN.md`.
- `server/`: the JSON API (Node's `http` module, no packages), started with `npm run api`. During `npm run dev`, Vite forwards `/api` requests to it (`vite.config.ts`). Data is kept in memory.
- `tests/`: `node:test` unit tests for the API client (with a fake `fetch`), requests, the catalog filter, sort and item list, the borrow list, security (URL checks, no HTML strings), storage, toasts and translations. `fakes.ts` builds complete test objects.

## Where a New Feature Goes

Make one folder for it: `src/features/<feature>/`. Example: the "List an item" form (`#/list-item`), whose folder already exists.

1. **Data shape:** add the types in the feature's own `types.ts` (like `cards/types.ts`). A fixed list of values is a union type built from the list with `as const`, like `Category` in `cards/categories.ts`, so a typo is a TypeScript error. Another feature imports them with `import type`.
2. **Rules:** pure logic goes in a `.ts` file in the feature folder, like `catalog/catalogFilter.ts`, with its tests in `tests/`. No React and no DOM in rule files.
3. **Data access:** saving or loading goes in a store file (like `requests/requestStore.ts`); calls to the server go in an API file (like `requests/requestsApi.ts`) that uses `shared/api/client.ts`. If components must redraw when the data changes, give the store a `subscribe()` and read it with a hook built on `useSyncExternalStore` (like `users/useCurrentUser.ts`).
4. **Page:** `ListItemView.tsx` is a placeholder component, so replace its content. A brand new page gets a new `XView.tsx` in its folder and one route in `renderRoute()` in `src/app/App.tsx`. Split a large page into small components; a form with its own logic gets its own file (like `requests/BorrowForm.tsx`).
5. **Reuse:** use other features through their exports (the catalog reuses `cards/ItemCard.tsx` and `cards/listCards.ts`). A new item is added once, in `cards/itemRecords.ts`, with its photo in `cards/cardsData.ts` (photos in `src/assets/photos/cards/`). Move code to `src/shared/` only when it is not about one feature.
6. **Text:** add every visible string to both `src/shared/i18n/en.ts` and `src/shared/i18n/ar.ts`. `npm test` fails if the keys differ or a component has hard-coded English.
7. **Styles:** add a commented section in `src/style.css` that uses the existing tokens and follows `DESIGN.md`.
8. **Check:** run `npm test`, `npm run lint`, `npm run typecheck` and `npm run build`, then check the page in the browser at 320px, 768px and 1280px, in English and Arabic.

## 2. HTML

- Use semantic HTML elements such as `header`, `nav`, `main`, `section`, `article`, and `footer`.
- One `h1` per page and a logical heading order.
- Every form input has a `label` (`htmlFor` in JSX).
- Use native form validation attributes such as `required`, `type`, and `minLength`.
- Use accessible names for interactive elements.

## 3. React

- **Components:** one component per job, typed props in an `interface`, and a `ReactElement` return type.
- **State:** keep what changes on screen in `useState`. Do not change the DOM by hand (no `classList`, `setAttribute` or `textContent` from code): change state and let React draw it. The one exception is `shared/browser/reveal.ts`, which only adds the animation class `is-visible` to elements React already drew.
- **Forms:** a controlled input (`value` plus `onChange`) when the value is needed while typing; an uncontrolled one read with `FormData` on submit when the browser's own validation is enough (like `RegisterView.tsx`).
- **Lists:** every `.map()` result has a stable `key` from the data (an id, never the index when the list can change).
- **`key` to reset:** give a page a `key` when a new URL must start it fresh (the router uses `key={itemId}` and `key={query}`).
- **Effects:** `useEffect` only for things outside React (listeners, timers, observers). Always return a cleanup, because `StrictMode` runs every effect twice in development to find missing ones.
- **Refs:** `useRef` only for what state cannot do, such as moving focus.
- **Stores outside React** (language, persona, toasts): read them with `useSyncExternalStore`, not with custom events. A store returns the same value until it changes and a new array or object when it does.
- **Errors in state:** keep error codes, not translated text, so a language switch translates them.
- **Navigation:** `window.location.assign("#/...")`, not `location.hash = ...` (the React lint rules forbid changing it directly).

## 4. CSS

- Follow a mobile-first approach.
- Write base styles for mobile screens first, then use `min-width` media queries for larger screens.
- Do not use `!important`.
- Use clear, consistent class names (`className` in JSX).
- Keep styles organized and avoid unnecessary duplication.

## 5. TypeScript

- `.tsx` for files with JSX, `.ts` for everything else. Import with the extension (`from "./dates.ts"`), so Node can run the tests directly.
- Use only erasable syntax (no `enum` or `namespace`); `tsconfig.json` enforces this.
- Type function parameters and return values. Use `unknown` for untrusted input, never `any`.
- Use `import type` for imports that are only types.
- Prefer `const`, use `let` only when reassignment is necessary, and avoid global variables.
- Keep functions small and focused.

## 6. Security

- Treat URL parameters, `localStorage` data and form input as untrusted.
- Show untrusted text with `{value}` in JSX: React escapes it. Never use `dangerouslySetInnerHTML`, `innerHTML` or `insertAdjacentHTML`; `npm test` fails if any appears in `src/`.
- Validate URL parameters against an allowlist (known categories and statuses, a pattern for item IDs).
- Only allow image URLs that are relative or use `https:` (`isSafeImageUrl()`).

## 7. Code Quality

- Follow ESLint rules, including the React hooks rules (`eslint-plugin-react-hooks`).
- Use Prettier to format code.
- Avoid unnecessary packages and configuration changes.
- Pure logic (rule files, stores without React, `src/shared/lib/`) has tests run with `npm test` (Node's built-in `node:test`; no test packages).
- `npm run typecheck` (`tsc --noEmit`) must pass. The pre-commit hook runs it.

## 8. Development Workflow

- Inspect the existing files before making changes.
- Explain the purpose of each change in simple English.
- Do not delete or rewrite existing files unnecessarily.
- After significant changes, run ESLint and Prettier checks.
- Fix errors introduced by your changes.

## 9. Project Goal

Build BorrowBox, an accessible peer-to-peer tool-sharing web app.

Implement only the features explicitly requested. Keep the solution simple and suitable for a beginner-level university assignment.

## 10. Rules From Mistakes

### Check text color where the text actually sits

**The mistake:** The footer logo "BorrowBox" was dark text on the dark navy footer (contrast 1.3:1). The footer changed its color variable, but the logo had no color of its own, so it kept the dark color from `body`. The tests passed and the code looked right. Only Lighthouse found it.

**The rule:** After any color change, check the contrast of every text element against the background it sits on, including inside the dark footer and the dark "Why BorrowBox" panel. Text must reach 4.5:1 (3:1 for large text). Run Lighthouse accessibility before saying a page is done.

### Make sure a check can fail before trusting it

**The mistake:** The AI wrote a script to measure colour contrast, and it reported 0 failures on every page. A bug turned every ratio into `NaN`, and any comparison with `NaN` is false, so the script could never report a failure. Later, a search for Arabic text outside the dictionary also found nothing, but the README had an Arabic line.

**The rule:** Before trusting a check that says "all passed", break something on purpose and confirm that the check catches it. A check that cannot fail proves nothing.

### Fix type errors instead of hiding them

**The mistake:** To make TypeScript errors go away, the AI used `as` casts and `!` (for example `e.target as Node`). The code compiled, but the casts only told the compiler to trust us. If the value was wrong at runtime, the app would still break.

**The rule:** Do not use `any`, `as` or `!` (`as const` is fine). Check the value instead, for example `if (!(target instanceof Node)) return;`, or use a typed `useRef<HTMLInputElement>(null)` with a null check. In tests, build complete objects with a factory such as `makeItem()` instead of casting partial objects.

### Use the id as the key, not the index

**The mistake:** In the debug lab I saved a bag with the heart, then sorted by price, and the heart jumped to another product. The list used `key={index}`. React keeps a component's state by its key, so the heart stayed in the first position instead of staying with the bag.

**The rule:** In every `.map()`, the key comes from the data and never changes, like `item.id`. Never the index when the list can be sorted, filtered or changed.

### Make a copy, never change the original

**The mistake:** In the lab, the + button in the cart did nothing on screen. The code did `item.qty = item.qty + 1`, then `setCart(cart)` with the same array, so React saw no change and did not draw again. "Featured" broke the same way: `.sort()` changed the original list, so the first order was gone.

**The rule:** Do not change state, props or a list you were given. Make a new one: `[...list].sort()`, and `list.map()` with `{ ...item, qty: item.qty + 1 }` for the changed item. `sortItems()` and `borrowListRules.ts` already work like this.
