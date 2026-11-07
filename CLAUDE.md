# Project Rules — BorrowBox

## 1. Technology Stack

- Vite, React 19 and TypeScript in strict mode (see `tsconfig.json`), with the existing custom CSS and Tailwind CSS v4 theme/utilities for the limited shadcn/ui-style form components. Do not import Tailwind Preflight or add a global reset.
- The router is the small hash router in `src/app/App.tsx`; do not add a routing library. Zustand is used for the shared borrow list only. The items, user, language and toast state use their existing custom stores; do not replace those architectures without an explicit requirement.
- Use React and native browser APIs before adding a package.

## Architecture

Files are grouped by feature. To fix a bug, open the folder of the feature it is in.

- `src/main.tsx`: starts React and draws `<App />` into `<div id="app">` (in `StrictMode`).
- `src/react-css.d.ts`: lets a `style` object set CSS variables (`style={{ "--i": 2 }}`).
- `src/app/`: the frame around every page.
  - `App.tsx`: shell and hash router (`#/`, `#/catalog`, `#/item/:id`, `#/borrow-list`, `#/list-item`, `#/dashboard`, `#/register`; other hashes show `NotFoundView`). Route pages use `React.lazy` inside `Suspense`; `useRetryableLazy.ts` recreates a lazy type only after explicit retry because React caches rejected lazy promises. A route-level `ErrorBoundary` wraps Suspense, and a hash change moves focus to `<main>`.
  - `Navbar.tsx` (menu, language and persona switch), `NavLink.tsx` (a menu link marked when its page is open), `isCurrentRoute.ts`, `Footer.tsx`, `NotFoundView.tsx`.
- `src/features/<feature>/`: everything for one feature: its types (`types.ts`), rules, store and UI. A page is `XView.tsx`: it exports the component `XView` and sets the tab title with `usePageTitle()`.
  - `home/`: `HomeView.tsx` (the page and the scroll reveal), one file per section (`Hero.tsx`, `About.tsx`, `Categories.tsx`, `Featured.tsx`, `HowItWorks.tsx`, `IdleTools.tsx`, `Why.tsx`) and `homeContent.ts` (their texts, images and the featured ids).
  - `cards/`: the tools people lend (the data type is `Item`, and links stay `#/item/:id`). The catalog uses `GET /api/items`: `itemsApi.ts` (`fetchItems()`), `itemMapper.ts` (`toItems()` checks API data), `itemsStore.ts` (custom external store with loading/error/success, one shared list request and `retry()`), and `useItems.ts` (`useSyncExternalStore` hook). `ItemDetailView.tsx` independently loads one item through `fetchItem()` (`GET /api/items/:id`), maps it with `toItem()`, and guards against stale responses when the id changes. Other card, item, status, category and id files retain their existing responsibilities.
  - `requests/`: borrow requests. `types.ts` (`BorrowRequest`), `requestRules.ts` (pure source of domain rules: dates, overlaps, duplicates, owner checks), `borrowRequestSchema.ts` (Zod adapter that calls `validateRequest()` and maps errors to form fields), `requestStore.ts` (successful local request records in `borrowbox_requests`), `requestsApi.ts` (POST through the shared client), and `BorrowForm.tsx` (React Hook Form form on the item page).
  - `users/`: `types.ts` (`User`, `UserRole`), `demoUsers.ts`, `userStore.ts` (the persona in use) and `useCurrentUser.ts` (its hook).
  - `catalog/`: `CatalogView.tsx` (title and search), `CatalogResults.tsx` (chips, count, sort, cards, "no items" and "no match"), `FilterChips.tsx`, `SortSelect.tsx`, `catalogFilter.ts` (pure: which items match the name search and category, the categories from the data, and `sortItems()`, which sorts a copy) and `catalogParams.ts` (the allowed URL filters: `q`, `category`, `sort`, and `catalogHref()`, the other way round).
  - `borrow-list/`: the borrowing list. `types.ts` (`BorrowListEntry`), `borrowListRules.ts` (pure add, increase/decrease days, remove and `parseBorrowList()` validation), `borrowListStore.ts` (the one vanilla Zustand store with `persist`), `useBorrowList.ts` (`useStore` selector hook), `AddToListButton.tsx` and `BorrowListView.tsx`. The existing localStorage key is `borrowbox_borrow_list`; persistence keeps the list as the single source of truth, validates restored data with `parseBorrowList()`, and migrates valid entries from the previous raw-array format. Tests can create isolated stores with `createBorrowListStore()`.
  - `register/`, `dashboard/`, `list-item/`: one page each (dashboard and list item are placeholders).
- `src/shared/`: code many features use. **It never imports from `features/` or `app/`.**
  - `api/client.ts`: **the one API client** and the only place that calls `fetch`. `BASE_URL = "/api"` is the one place the address is written. `getJson("/items")` and `postJson("/requests", body)` return `{ ok: true, data }` or `{ ok: false, status }`. Every failure is logged to the Console as one line, e.g. `[api] POST /api/requests failed: 500` (never the body). A new request type is added here, not with `fetch` in a page.
  - `ui/`: `ErrorBoundary.tsx`, `LoadingState.tsx`, `ErrorState.tsx` (including the API retry action), `EmptyState.tsx`, toast UI/store, `ScrollLink.tsx`, `PlaceholderCard.tsx`, icons, plus the limited shadcn/ui-style `Button.tsx` and `Input.tsx` used by `BorrowForm`. Existing CSS classes own their appearance; do not migrate unrelated UI.
  - `i18n/`: `en.ts` and `ar.ts` dictionaries with the same keys; `i18n.ts` with `t()`, `setLang()`, `formatMoney()`; `useLang.ts` (its hook).
  - `lib/`: pure functions (`imageUrl.ts`, `dates.ts`). No DOM and no `localStorage`, so Node can test them.
  - `browser/`: helpers that use browser features: `storage.ts`, `reveal.ts` (scroll reveal), `scrollToSection.ts`, `usePageTitle.ts`.
  - `types.ts`: only `Lang`, the one shape `shared/` itself needs. Every other type lives in its feature's `types.ts`. Types only, no runtime code.
- `src/style.css`: all styles, organized in commented sections. Colours, sizes and motion come from the tokens in `DESIGN.md`.
- `server/`: the JSON API (Node's `http` module, no packages), started with `npm run api`. During `npm run dev`, Vite forwards `/api` requests to it (`vite.config.ts`). `itemRecords.ts` is **the one list of items**: only the server reads it, and `tests/architecture.test.ts` fails if a file in `src/` imports it. `GET /api/items` answers `{ items, total }`; `GET /api/items/:id` answers one item; `POST /api/requests` accepts the borrowing payload and keeps server records in memory. The list test switches `?delay=3000`, `?fail=500` and `?empty=1` (`testSwitches.ts`) show loading, API failure and empty states.
- `.claude/skills/`: two Claude Code skills, `vercel-react-best-practices` (React performance rules) and `vercel-composition-patterns` (component design), copied unchanged from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (commit `1a2c79d`). Use them when writing or reviewing React code.
- `tests/`: `node:test` tests for the API client, request rules/schema, catalog, item mapper/store, Zustand persistence/migration, security, storage, toasts, translations and architecture. `errorBoundary.test.tsx` uses the existing jsdom setup to test render fallback, isolation and retryable lazy loading. `fakes.ts` builds complete test objects.

## Where a New Feature Goes

Make one folder for it: `src/features/<feature>/`. Example: the "List an item" form (`#/list-item`), whose folder already exists.

1. **Data shape:** add the types in the feature's own `types.ts` (like `cards/types.ts`). A fixed list of values is a union type built from the list with `as const`, like `Category` in `cards/categories.ts`, so a typo is a TypeScript error. Another feature imports them with `import type`.
2. **Rules:** pure logic goes in a `.ts` file in the feature folder, like `catalog/catalogFilter.ts`, with its tests in `tests/`. No React and no DOM in rule files.
3. **Data access:** saving or loading goes in a store file; calls to the server go in a feature API file that uses `shared/api/client.ts`. Use the existing custom external-store pattern for data such as shared items state. Use Zustand for the borrowing list only unless the project architecture is explicitly approved to change. Do not duplicate a store's state locally.
4. **Page:** `ListItemView.tsx` and `DashboardView.tsx` are placeholders, not completed workflows. A new page gets an `XView.tsx` in its feature folder and a route in `renderRoute()` in `src/app/App.tsx`; add its stable lazy loader/retry counter there and keep it inside the route `ErrorBoundary` and `Suspense`.
5. **Reuse:** use other features through their exports (the catalog reuses `cards/ItemCard.tsx` and `cards/listCards.ts`). A new item is added once, in `server/itemRecords.ts`, with its photo in `cards/cardPhotos.ts` (photos in `src/assets/photos/cards/`). Move code to `src/shared/` only when it is not about one feature.
6. **Text:** add every visible string to both `src/shared/i18n/en.ts` and `src/shared/i18n/ar.ts`. `npm test` fails if the keys differ or a component has hard-coded English.
7. **Styles:** add a commented section in `src/style.css` that uses the existing tokens and follows `DESIGN.md`.
8. **Check:** run `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build`, then check the page in the browser at 320px, 768px and 1280px, in English and Arabic.

## 2. HTML

- Use semantic HTML elements such as `header`, `nav`, `main`, `section`, `article`, and `footer`.
- One `h1` per page and a logical heading order.
- Every form input has a `label` (`htmlFor` in JSX).
- Use native form validation attributes such as `required`, `type`, and `minLength`.
- Use accessible names for interactive elements.

## 3. React

- **Components:** one component per job and **one component per file** (the file has its name; `npm test` checks this), typed props in an `interface`, and a `ReactElement` return type. The tree is in the README; update it when a component is added or moved.
- **State ownership:** use local `useState` for state owned by one component; use the URL for shareable catalog filters; use the existing shared store when multiple components need the same data. Do not mirror derived values or shared store state in component state. Do not change the DOM by hand (no `classList`, `setAttribute` or `textContent` from code): change state and let React draw it. The one exception is `shared/browser/reveal.ts`, which only adds the animation class `is-visible` to elements React already drew.
- **Borrow-list Zustand:** `borrowListStore.ts` is the single source of truth. Keep its existing actions and `persist` middleware, storage key `borrowbox_borrow_list`, `parseBorrowList()` validation and legacy raw-array migration. Components read via `useBorrowList()`/`useStore`; actions stay on the store. Keep `createBorrowListStore()` so tests can make isolated persisted stores. Calculate counts and other derived values from the store state.
- **Other stores:** the shared items store is custom, not Zustand. It exposes stable state plus `subscribe()` and is consumed through `useSyncExternalStore` in `useItems()`. It deduplicates the list request and owns loading/error/success and retry. User, language and toast stores keep their current custom subscription APIs. Do not consolidate these into Zustand as part of unrelated work.
- **Forms:** `BorrowForm.tsx` uses React Hook Form and `zodResolver`; `borrowRequestSchema.ts` calls the pure `validateRequest()` in `requestRules.ts` and maps its field/form errors. Keep domain rules centralized there; schema context must read current item, borrower, requests and date. Keep the current API payload and only write a successful local request record after the API succeeds. `RegisterView.tsx` remains a native browser-validated form; do not migrate it without a requirement. Use the shared shadcn/ui-style `Button` and `Input` only where already needed, and preserve CSS ownership.
- **Lists:** every `.map()` result has a stable `key` from the data (an id, never the index when the list can change).
- **`key` to reset:** give a page a `key` when a new URL must start it fresh (the router uses `key={itemId}` and `key={query}`).
- **Effects:** `useEffect` only for things outside React (listeners, timers, observers). Always return a cleanup, because `StrictMode` runs every effect twice in development to find missing ones.
- **Refs:** `useRef` only for what state cannot do, such as moving focus.
- **Custom stores outside React** (items, language, persona, toasts): follow their existing subscription hooks and stable-snapshot behavior. Borrow-list components use Zustand's `useStore` hook, not `useSyncExternalStore` or a second local copy.
- **Errors in state:** keep error codes, not translated text, so a language switch translates them.
- **API errors and retries:** use `shared/api/client.ts` through the feature API module; it returns `{ ok, data/status }` and logs a concise failure. Do not throw API failures into a React Error Boundary or replace the existing API error states. List retry must make a new request. Item detail uses `GET /api/items/:id`, maps with `toItem()`, and ignores stale responses after the id changes or the component unmounts.
- **Suspense and render errors:** keep each page's stable lazy loader and retry token in `App.tsx`/`useRetryableLazy.ts`; React caches a rejected lazy promise, so only explicit retry changes the lazy component identity. Keep route structure `ErrorBoundary` → `Suspense` → lazy page. Shared Navbar, Footer and Toasts remain outside the page boundary. The homepage has a separate boundary around only `Featured`.
- **Loading, empty and no-match:** use translated `page.loading` for lazy page loading and `items.loading` for item data loading. Preserve distinct API error, successful empty collection, filtered no-match and empty borrow-list states; do not represent an API failure as empty data.
- **Navigation:** `window.location.assign("#/...")`, not `location.hash = ...` (the React lint rules forbid changing it directly).

## 4. CSS

- `src/style.css` imports Tailwind v4 theme and utilities only. Do not add Preflight, a global reset or unrelated Tailwind styling migrations.
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
- Pure logic and store behavior have tests run with `npm test` (Node's built-in `node:test`; React boundary tests use the existing jsdom setup).
- Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build` before completing a change.
- Husky's `.husky/pre-commit` runs `npx lint-staged`, then `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build`, in that order under `set -e`. Any failure blocks the commit. `package.json`'s `prepare: "husky"` initializes the hook after dependency installation; retain the existing lint-staged rules.

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

### Check the setup before blaming the code

**The mistake:** While checking the component tree, every page showed "We couldn't load the tools". The code was fine: an old `npm run dev` was still open and did not forward `/api` to the API, so `/api/items` sent back the HTML page instead of the items. Earlier the same day, a command to stop the API did not stop it, so a check of the "API is off" message tested the wrong thing.

**The rule:** When a page cannot load data, check the setup first: is the API running (`npm run api`), and does `/api/items` through the dev server return JSON, not HTML? If not, close the old servers and start `npm run dev` and `npm run api` again. After stopping a server, confirm that its port is really free. Only then look for the bug in the code.
