# BorrowBox

A peer-to-peer tool-sharing web app. Neighbors borrow tools from each other for free, and each borrow is backed by a **simulated** refundable deposit.

This is an MVP with a small JSON API (`server/`): the catalog loads from `GET /api/items`, item pages load one record from `GET /api/items/:id`, and borrow requests go to `POST /api/requests`. The borrow list, successful local request records, and demo persona live in the browser (`localStorage`), and three demo personas let you try both the owner and the borrower side in one browser.

## Features

- **Home page:** a search-first hero with category shortcuts, tool categories, featured items, "how it works" in four steps, and sections that rise into view as you scroll.
- **Catalog** (`#/catalog`): all 14 items in a grid, with a name search (upper/lower case does not matter), category chips built from the data, and a sort (name, deposit low/high, or the default order). Search, category and sort work together and live in the URL (`#/catalog?category=Camping&q=stove&sort=name`), so a filtered list can be shared.
- **Borrow list** (`#/borrow-list`): works like a cart. "Add to list" on a card adds the item (again: one more day). On the list page, − and + change the days (− from 1 removes the item), and items can be removed one by one or all at once. The count in the header is always up to date, and the list is saved in `localStorage`, so it is still there after a refresh.
- **Item page** (`#/item/item-103`): loads that item by id from `GET /api/items/:id`, then shows its photo, condition notes, owner, refundable deposit, and a working **borrow request**. Requests are checked for valid dates, date overlaps, owners borrowing their own item, and duplicate pending requests.
- **Registration page** (`#/register`): a sign-up form checked by the browser's own validation (required fields, email format, minimum length).
- **Arabic and English:** switch from the header without reloading. The layout mirrors for right-to-left, Arabic uses the Tajawal font, and the choice is remembered.
- **Demo personas:** switch between Sarah (owner), Alex (borrower) and Elena (new member) from the profile menu.
- **Accessibility:** semantic HTML, keyboard support, visible focus, colour contrast measured against WCAG AA, and reduced-motion support.
- **Design:** a warm cream and orange design based on the visual language of [Nomu](https://en.nomu.store), adapted to pass contrast checks. See [DESIGN.md](DESIGN.md).
- **Security:** text from the URL or from item data is shown through React, which escapes it, so it is never treated as HTML. Image URLs and item ids are checked first.

## Tech stack

- [Vite](https://vite.dev/), [React 19](https://react.dev/) and TypeScript in strict mode, with a hash-based router implemented in `src/app/App.tsx`.
- Zustand for the shared borrowing list; a small custom external store for shared item data state; React Hook Form and Zod for the borrow form.
- Limited shadcn/ui-style integration: `src/shared/ui/Button.tsx` and `src/shared/ui/Input.tsx`, using `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, and `@hookform/resolvers` for Zod integration. Tailwind CSS v4 through `@tailwindcss/vite` provides theme and utility layers only; the app keeps its existing CSS and does not import Preflight.
- ESLint, Prettier, Husky and lint-staged for code quality. The pre-commit hook runs all four required project checks; see [Scripts](#scripts).
- Fonts: Inter (Latin) and Tajawal (Arabic) from Google Fonts.
- Node's built-in test runner (`node:test`) with jsdom for the React Error Boundary tests.

## Getting started

Requirements: Node.js 22 (the project is developed and tested on Node 22.22).

```bash
npm install
```

```bash
npm run dev
```

In a second terminal, start the API. The app gets every item from it, so without it the pages show "We couldn't load the tools" with a **Try again** button:

```bash
npm run api
```

Then open http://localhost:5173.

### See data loading, error, empty and no-match states

The server supports test switches on `GET /api/items`. The frontend's default `ITEMS_PATH` is `/items`; to see the list's API states, temporarily change it in `src/features/cards/itemsApi.ts` and restore it afterward:

| State    | `ITEMS_PATH`              | What you see                                   |
| -------- | ------------------------- | ---------------------------------------------- |
| Loading  | `"/items?delay=3000"`     | "Loading tools…" for 3 seconds                 |
| Error    | `"/items?fail=500"`       | "We couldn't load the tools" and **Try again** |
| Empty    | `"/items?empty=1"`        | "No tools listed yet"                          |
| No match | (normal) search for `zzz` | "No items match" and **Clear filters**         |

Stopping `npm run api` also shows the error: "The server did not answer".

The catalog distinguishes an API failure from a successful empty collection and from a search with no matches. Route-level code loading uses the translated `page.loading` Suspense fallback. API list loading uses `items.loading`; API failures keep their own error state and a retry that requests the data again. Error Boundaries cover page render and lazy-import failures, with retry behavior. The Featured section has its own boundary so other home content stays visible.

## Scripts

| Command                | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start the development server                    |
| `npm run api`          | Start the API server on port 3000               |
| `npm run build`        | Build for production into `dist/`               |
| `npm run preview`      | Serve the production build locally              |
| `npm test`             | Run the unit tests                              |
| `npm run lint`         | Check the full project with ESLint (0 warnings) |
| `npm run typecheck`    | Check types with the TypeScript compiler        |
| `npm run format`       | Format all files with Prettier                  |
| `npm run format:check` | Check formatting without changing files         |

The Husky pre-commit hook runs these commands in order: `npx lint-staged`, `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run build`. It uses `set -e`, so any failed command blocks the commit. `lint-staged` first applies ESLint/Prettier to staged files according to the patterns in `package.json`.

## Project structure

Files are grouped by feature: everything about one feature is in one folder.

```text
src/
├── main.tsx              # Starts React and draws the app
├── app/                  # App hash router/shell, useRetryableLazy, Navbar, Footer, NotFoundView
├── features/             # One folder per feature
│   ├── home/             # Home page and its content
│   ├── cards/            # Item API/store/mapper, categories, cards, item details and status
│   ├── requests/         # Borrow rules/schema/form, local request storage and API submission
│   ├── users/            # Demo users and the current user
│   ├── catalog/          # Catalog page: search, category chips, sort, item grid
│   ├── borrow-list/      # The borrow list (cart): rules, saving, the list page
│   ├── register/         # Registration page
│   ├── dashboard/        # "My activity" page (placeholder)
│   └── list-item/        # "List an item" page (placeholder)
├── shared/               # Used by many features; never imports from features/
│   ├── api/              # The one API client: getJson(), postJson(), BASE_URL
│   ├── ui/               # Loading/error/empty states, ErrorBoundary, toasts, icons, Button/Input
│   ├── i18n/             # en.ts and ar.ts dictionaries, t(), setLang(), formatMoney()
│   ├── lib/              # Pure functions (image URL check, dates), tested with Node
│   ├── browser/          # Helpers that use browser features (DOM, storage, scrolling)
│   └── types.ts          # Only Lang; each feature keeps its own types.ts
├── assets/               # Photos and illustrations
└── style.css             # All styles, mobile-first, built on colour tokens
server/                   # The JSON API (npm run api)
tests/                    # node:test unit tests
```

Rules (`requestRules.ts`, `itemId.ts`, `catalogFilter.ts`, `catalogParams.ts`) and everything in `shared/lib/` are pure functions with no DOM, so Node tests them directly. `borrowRequestSchema.ts` adapts form values to `validateRequest()`; it does not replace or duplicate the borrowing domain rules.

## Component tree

Components live in files named for their exported component (`npm test` checks the `.tsx` component convention). This is the current routing and page composition from `src/app/App.tsx` and the page modules:

```text
App (hash and lazy-page retry counters)
├── Navbar (local menu state; user, language and borrow-list hooks)
├── main
│   └── ErrorBoundary (current route)
│       └── Suspense (LoadingState: "Loading page...")
│           └── One React.lazy page selected by renderRoute(hash)
│               ├── #/             HomeView
│               │   ├── Hero, About, Categories
│               │   ├── ErrorBoundary → Featured (useItems, ItemsStatus, ItemCard)
│               │   ├── HowItWorks, IdleTools, Why
│               ├── #/catalog      CatalogView → ItemsStatus or CatalogResults
│               │   └── CatalogResults → FilterChips, SortSelect,
│               │       EmptyState (empty/no-match), ItemCard
│               ├── #/item/:id     ItemDetailView → ItemPageStatus,
│               │   │               ItemNotFound, or ItemDetail
│               │   └── ItemDetail → OwnerCard, BorrowForm
│               ├── #/borrow-list  BorrowListView → ItemsStatus,
│               │                   EmptyState, BorrowListRow
│               ├── #/register     RegisterView
│               ├── #/dashboard    DashboardView (placeholder)
│               ├── #/list-item    ListItemView (placeholder)
│               └── other hashes   NotFoundView
├── Footer
└── Toasts
```

`ErrorBoundary` is outside `Suspense` for the route page; the shared Navbar, Footer and Toasts are outside that boundary. `HomeView` wraps only `Featured` in a separate boundary. `useRetryableLazy()` keeps each lazy component stable during normal renders and creates a fresh lazy component after an explicit retry.

`ItemsStatus` draws `LoadingState` or the API `ErrorState` with a real data retry. `CatalogResults` distinguishes a successful empty collection from no matches after filtering. Item details use the individual item endpoint and their own item-id-scoped request state; the catalog and borrow list consume the shared items store.

### Who owns the state

| State                             | Owner                                                  | Why there                                                                                       |
| --------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Current page and page retry count | `App` (`useState`)                                     | The hash picks the page; retry counters recreate a lazy page only after explicit retry.         |
| Menu open, profile open, scrolled | `Navbar` (`useState`)                                  | Only the header uses them.                                                                      |
| Search text while typing          | `CatalogView` (`useState`)                             | A controlled input; the URL holds the search after submit.                                      |
| Filters and sort                  | The URL (`#/catalog?q=&category=&sort=`)               | Read with `parseCatalogParams()` and passed down as `filters`, so a link or refresh keeps them. |
| Borrow form fields/errors/sending | `BorrowForm` (`react-hook-form`)                       | RHF owns field state; Zod adapts errors from the centralized domain rules.                      |
| Account just created              | `RegisterView` (`useState`)                            | Only the page uses it.                                                                          |
| Catalog/home/list items           | Custom `itemsStore`, read with `useItems()`            | One shared list request with loading, error or success state.                                   |
| Item details                      | `ItemDetailView`                                       | Loads `/api/items/:id`; request state is tied to the current id to avoid stale responses.       |
| Borrow list (the cart)            | Zustand `borrowListStore`, read with `useBorrowList()` | One shared source of truth, persisted with Zustand under `borrowbox_borrow_list`.               |
| Language                          | `i18n.ts`, read with `useLang()`                       | `App` reads it, so every page draws again after a switch.                                       |
| Current persona                   | `userStore`, read with `useCurrentUser()`              | Used by the Navbar, the item page (owner check) and the dashboard.                              |
| Toasts                            | `toast.ts`, read in `Toasts`                           | Any feature can call `showToast()`.                                                             |

The items store is a small custom external store read with `useSyncExternalStore`; it deduplicates the shared list request and exposes loading/error/success plus retry. The borrow list is Zustand, using its vanilla store API and `persist` middleware; `parseBorrowList()` validates restored data and the migration retains valid entries from the old raw-array format. Do not mirror either store's data in component state.

## Translations

All interface text is in `src/shared/i18n/en.ts` and `src/shared/i18n/ar.ts`. Both files must have exactly the same keys; `npm test` fails if they differ, if an Arabic entry is empty, or if a page contains hard-coded English text.

To change wording, edit the dictionary only. Category names, statuses and other stored values stay in English in the data and in URLs; only their displayed text is translated.

## Documentation

- [Project rules](CLAUDE.md): conventions for contributors and AI coding tools, and where a new feature goes.
- [Design system](DESIGN.md): colours, type, spacing, components and motion, with measured contrast.
- [Debug lab log](debug-lab-log.md) and [debugging log](debugging-log.md): real bugs, how they were found and fixed.
- Claude Code skills in `.claude/skills/`: `vercel-react-best-practices` and `vercel-composition-patterns`, from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills).

## Status

Built: home page, catalog with search, category filter and sort, borrow list, item detail page with borrow requests, registration page, Arabic/English support.

Planned: the "My activity" dashboard where owners approve requests, and the "List an item" form. These routes show placeholder pages for now.
