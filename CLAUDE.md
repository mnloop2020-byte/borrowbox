# Project Rules — BorrowBox

## 1. Technology Stack

- Next.js 16 (App Router), React 19 and TypeScript in strict mode (see `tsconfig.json`), with the existing plain CSS in `src/style.css`. Tailwind CSS v4 adds only its theme and utilities, for the small shadcn/ui-style `Button` and `Input`; never add its Preflight (global reset).
- Zustand for shared state in the browser. React Hook Form and Zod for forms with their own logic.
- The API is a separate Node server in `server/` (no packages). The app reaches it from the server only, at `API_BASE_URL` (`.env.local`, see `.env.example`).
- Use Next.js, React and native browser APIs before adding a package.
- **This Next.js version is newer than most training data.** Before using a Next.js API, read its page in `node_modules/next/dist/docs/` (see rule 10, "Read the docs of the installed version").

## Architecture

Files are grouped by feature. To fix a bug, open the folder of the feature it is in.

- `src/app/`: **routes only** (Next.js decides the file names). Each `page.tsx` reads the URL (`params`, `searchParams`), sets the tab title in `generateMetadata()`, and draws the feature's component.
  - `layout.tsx`: the frame of every page: `<html lang dir>` from the language cookie, the fonts (`next/font`), Navbar, `<main>`, Footer, `Toasts` and `BorrowListHydration`. It starts `getItemIds()` without waiting, for the Navbar count.
  - `loading.tsx` (Suspense fallback for a page), `error.tsx` (error boundary of every page, with `retry()`), `not-found.tsx` (any unknown address).
  - `catalog/`, `items/[id]/` (with its own `not-found.tsx`), `borrow-list/`, `register/`, `dashboard/`, `list-item/`.
- `src/features/<feature>/`: everything for one feature: its types (`types.ts`), rules, store, API calls and UI.
  - `site/`: `Navbar.tsx` (client: menus, language and persona switch), `NavLink.tsx`, `isCurrentRoute.ts`, `Footer.tsx`, `NotFoundView.tsx`.
  - `home/`: `HomeView.tsx` and one file per section. `Featured.tsx` draws its heading at once and `FeaturedGrid.tsx` (the cards) inside its own `Suspense` and `RetryBoundary`. `homeContent.ts` holds the texts' keys, the images and the featured ids.
  - `cards/`: the items. `itemsApi.ts` (**server only**: `getItems()`, `getItem(id)`, `getItemIds()`, each wrapped in React `cache()`), `itemMapper.ts` (pure: `toItems()` checks every field of the API answer and turns `ApiItem` into `Item`), `listCards.ts` (today's status), `cardPhotos.ts`, `categories.ts` (`CATEGORIES`, the `Category` union, `isCategory()`), `itemId.ts`, `itemStatus.ts`, `itemCardData.ts` (pure: the checked values a card shows), `types.ts`, and the components `ItemCard`, `ItemDetail`, `OwnerCard`, `ItemNotFound`.
  - `catalog/`: `CatalogView.tsx` (title and the search form), `CatalogResults.tsx` (fetches the items; chips, count, sort, cards, "no items" and "no match"), `FilterChips.tsx`, `SortSelect.tsx` (client), `catalogFilter.ts` (pure: search, category, `sortItems()` on a copy) and `catalogParams.ts` (the allowed URL filters and `catalogHref()`).
  - `borrow-list/`: the cart. `borrowListRules.ts` (pure: add, more/fewer days, remove, `parseBorrowList()`), `borrowListStore.ts` (the Zustand store with `persist` under `borrowbox_borrow_list`), `useBorrowList.ts` (`useBorrowList()`, `useBorrowListReady()`), `BorrowListHydration.tsx`, `BorrowListCount.tsx`, `AddToListButton.tsx`, `BorrowListView.tsx`, `BorrowListRow.tsx`.
  - `requests/`: borrow requests. `requestRules.ts` (pure: dates, overlaps, duplicates, owner check), `borrowRequestSchema.ts` (Zod: calls `validateRequest()`), `BorrowForm.tsx` (client: React Hook Form), `actions.ts` (**server action** `requestBorrow()`: checks the input again and posts it), `requestsApi.ts` (server only), `requestStore.ts` (the local copy of sent requests).
  - `users/`: `demoUsers.ts`, `currentUser.ts` (server: the persona cookie), `actions.ts` (server action `switchPersona()`), `types.ts`.
  - `register/`, `dashboard/`, `list-item/`: one page each (dashboard and list item are placeholders).
- `src/shared/`: code many features use. **It never imports from `features/` or `app/`.**
  - `api/client.ts`: **the one API client** (server only) and the only place that calls `fetch`. It joins every path to `API_BASE_URL`, returns `{ ok: true, data }` or `{ ok: false, status }`, and logs each failure as one line (never the body). A 404 is returned but not logged.
  - `i18n/`: `en.ts` and `ar.ts` (same keys), `i18n.ts` (pure: `createI18n(lang)` gives `t`, `tValue`, `formatMoney`), `serverI18n.ts` (`getI18n()` for server components: reads the cookie once per request), `actions.ts` (server action `switchLanguage()`), `useDocumentLang.ts` (only for `error.tsx`).
  - `ui/`: `LoadingState`, `ErrorState`, `EmptyState`, `RetryBoundary` (Next.js `catchError`), `Toasts` with `toastStore.ts` (Zustand), `ScrollLink`, `RevealOnScroll`, `PlaceholderCard`, `Button`, `Input` and the icons.
  - `lib/`: pure functions (`imageUrl.ts`, `dates.ts`, `cn.ts`). `browser/`: helpers that use browser features (`storage.ts`, `reveal.ts`, `scrollToSection.ts`).
  - `types.ts`: only `Lang`. Every other type lives in its feature's `types.ts`.
- `src/style.css`: all styles, in commented sections, built on the tokens in `DESIGN.md`.
- `server/`: the JSON API on port 4000 (`npm run api`). `itemRecords.ts` is **the one list of items**; `tests/architecture.test.ts` fails if `src/` imports anything from `server/`. Test switches go right after `/api` and work on every endpoint (`testSwitches.ts`): `/api/delay/3000`, `/api/fail/500`, `/api/empty`.
- `.claude/skills/`: `vercel-react-best-practices` and `vercel-composition-patterns`, copied unchanged from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (commit `1a2c79d`). Use them when writing or reviewing React code.
- `tests/`: `node:test` tests, run with `tsx` and the `react-server` condition (so files that import `server-only` can be tested). `fakes.ts` builds complete test objects.

## Where a New Feature Goes

Make one folder for it: `src/features/<feature>/`. Example: the "List an item" form (`/list-item`), whose folder already exists.

1. **Data shape:** the types in the feature's own `types.ts`. A fixed list of values is a union type built from the list with `as const`, like `Category`.
2. **Rules:** pure logic in a `.ts` file in the feature folder, with its tests in `tests/`. No React, no DOM, no Next.js.
3. **Data from the API:** a server-only file like `cards/itemsApi.ts` that uses `shared/api/client.ts`, wrapped in `cache()`. Server components call it. A change from a form goes through a server action (`"use server"`) that checks its input again.
4. **Page:** a route folder in `src/app/` with a thin `page.tsx` and `generateMetadata()`. The page's content is a component in the feature folder.
5. **Shared browser state:** a Zustand store, changed only through its actions. State that one component needs stays in that component.
6. **Text:** every visible string in both `en.ts` and `ar.ts`. `npm test` fails if the keys differ or a component has hard-coded English.
7. **Styles:** a commented section in `src/style.css` with the existing tokens.
8. **Check:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, then the page in the browser at 320px, 768px and 1280px, in English and Arabic, with the Console open, and with `API_BASE_URL` set to `/delay/3000`, `/fail/500` and `/empty`.

## 2. HTML

- Use semantic HTML elements such as `header`, `nav`, `main`, `section`, `article`, and `footer`.
- One `h1` per page and a logical heading order.
- Every form input has a `label` (`htmlFor` in JSX).
- Use native form validation attributes such as `required`, `type`, and `minLength`.
- Use accessible names for interactive elements.

## 3. React and Next.js

- **Server or client:** a component is a Server Component unless it needs the browser: state, effects, event handlers, Zustand or browser APIs. Then it starts with `"use client"` and stays as small as possible. Server components fetch data; never `fetch` in a client component.
- **Language in components:** a server component calls `await getI18n()`. A client component gets `lang` from the server component that draws it and calls `createI18n(lang)`. Never keep the language in a module variable: on the server it would be shared by every visitor.
- **Components:** one component per job and **one component per file**, named like the file (`npm test` checks this; in `src/app` the one component is the default export). Typed props in an `interface`, and a `ReactElement` (or `Promise<ReactElement>`) return type. The tree is in the README; update it when a component is added or moved.
- **State ownership:** data from the API belongs to the server. Shareable filters belong to the URL. Shared browser state belongs to a Zustand store and changes only through its actions. State one component needs stays in that component (`useState`). Anything that can be calculated is not state. Do not pass props through components that do not use them.
- **Loading and errors:** a part that waits for data goes inside `Suspense` (or the route's `loading.tsx`), and a part that can fail inside `RetryBoundary` (or the route's `error.tsx`), so a slow or broken part never blocks the rest of the page. "Try again" must ask the server again (`retry()`), not only draw again. Keep "API error", "no items" and "no match" as different messages.
- **Hydration:** the first render in the browser must match the server's HTML. Data that only the browser has (`localStorage`) is read after hydration (`BorrowListHydration`, `useBorrowListReady()`), and nothing may change HTML that React has not hydrated yet (see rule 10).
- **Lists:** every `.map()` result has a stable `key` from the data (an id, never the index when the list can change).
- **Effects:** `useEffect` only for things outside React (listeners, observers, `localStorage`). Always return a cleanup. Never fetch data in an effect.
- **Refs:** `useRef` only for what state cannot do, such as moving focus.
- **Errors in state:** keep error codes, not translated text, so the message follows the language.
- **Navigation:** `next/link` for links, `next/form` for search forms, `router.push()` from `useRouter()` in event handlers.

## 4. CSS

- Follow a mobile-first approach: base styles for small screens, then `min-width` media queries.
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

- Treat URL parameters, cookies, `localStorage` data, form input and server action arguments as untrusted.
- Show untrusted text with `{value}` in JSX: React escapes it. Never use `dangerouslySetInnerHTML`, `innerHTML` or `insertAdjacentHTML`; `npm test` fails if any appears in `src/`.
- Validate URL parameters against an allowlist (known categories and statuses, a pattern for item IDs).
- Only allow image URLs that are relative or use `https:` (`isSafeImageUrl()`).
- Files that must never reach the browser (the API client, API calls, cookie reads) start with `import "server-only"`.

## 7. Code Quality

- Follow ESLint rules, including the Next.js and React hooks rules. `npm run lint` fails on any warning.
- Use Prettier to format code.
- Avoid unnecessary packages and configuration changes.
- Pure logic and stores have tests run with `npm test`.
- The pre-commit hook runs `lint-staged`, `typecheck`, `lint`, `format:check` and `build`. Any failure stops the commit.

## 8. Development Workflow

- Inspect the existing files before making changes.
- Explain the purpose of each change in simple English.
- Do not delete or rewrite existing files unnecessarily.
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

**The rule:** When a page cannot load data, check the setup first: is the API running (`npm run api`), does `API_BASE_URL` in `.env.local` point to it, and does it answer JSON? After stopping a server, confirm that its port is really free. Only then look for the bug in the code.

### Read the docs of the installed version

**The mistake:** While moving to Next.js, the AI started writing its own error boundary class with `router.refresh()` for "Try again", and used `priority` on the item photo. Next.js 16 already has `catchError()` and a `retry()` that asks the server again, and `priority` is deprecated there. Both were in the documentation that comes with the package, in `node_modules/next/dist/docs/`.

**The rule:** Before using a Next.js API, read its page in `node_modules/next/dist/docs/`, which matches the installed version. Prefer the framework's own tool (`catchError`, `loading.tsx`, `error.tsx`, `next/form`) to custom code, and fix every deprecation warning.

### Do not change HTML that React has not hydrated yet

**The mistake:** After the move to Next.js, the home page showed a hydration error in the Console. The scroll reveal (`reveal.ts`) adds attributes to the children of every `[data-reveal-group]`. The featured cards arrive later, inside `Suspense`, so the script changed their HTML before React hydrated them, and React found HTML that did not match the server's.

**The rule:** Code that changes the DOM (like `reveal.ts`) must only touch elements that React has already hydrated: never content inside a `Suspense` boundary that may still be streaming. After any change, open each page with the Console visible: a hydration warning is a bug, not noise.
