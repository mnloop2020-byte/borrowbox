# BorrowBox

A peer-to-peer tool-sharing web app. Neighbors borrow tools from each other for free, and each borrow is backed by a **simulated** refundable deposit.

The app is built with Next.js (App Router) and gets its data from a small JSON API (`server/`): the catalog from `GET /api/items`, one item from `GET /api/items/:id`, and borrow requests go to `POST /api/requests`. The borrow list and the local copy of sent requests live in the browser (`localStorage`); the language and the demo persona are cookies, so the server draws every page in the right language for the right person.

## Features

- **Home page:** a search-first hero with category shortcuts, tool categories, featured items, "how it works" in four steps, and sections that rise into view as you scroll.
- **Catalog** (`/catalog`): all 14 items, with a name search (upper/lower case does not matter), category chips built from the data, and a sort (name, deposit low/high, or the default order). Search, category and sort work together and live in the URL (`/catalog?category=Camping&q=stove&sort=name`), so a filtered list can be shared.
- **Borrow list** (`/borrow-list`): works like a cart. "Add to list" on a card adds the item (again: one more day). On the list page, − and + change the days (− from 1 removes the item), and items can be removed one by one or all at once. The count in the header is always up to date, and the list survives a refresh.
- **Item page** (`/items/item-103`): one item loaded by its id, with its photo, condition notes, owner, refundable deposit and a **borrow request** form. Requests are checked for valid dates, date overlaps, owners borrowing their own item, and duplicate pending requests.
- **Registration page** (`/register`): a sign-up form checked by the browser's own validation.
- **Arabic and English:** switch from the header. The layout mirrors for right-to-left and Arabic uses the Tajawal font. The server knows the language, so an Arabic page arrives already in Arabic and right-to-left.
- **Demo personas:** switch between Sarah (owner), Alex (borrower) and Elena (new member) from the profile menu.
- **Accessibility:** semantic HTML, keyboard support, visible focus, colour contrast measured against WCAG AA, and reduced-motion support.
- **Design:** a warm cream and orange design based on the visual language of [Nomu](https://en.nomu.store), adapted to pass contrast checks. See [DESIGN.md](DESIGN.md).
- **Security:** text from the URL, the API or storage is shown through React, which escapes it. Image URLs and item ids are checked first, and the server action checks every request again.

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router, [React 19](https://react.dev/) and TypeScript in strict mode.
- Server Components fetch the data; Client Components only where the page reacts in the browser (menus, the list, forms).
- Zustand for the shared browser state (the borrow list and the toasts).
- React Hook Form and Zod for the borrow form, with small shadcn/ui-style `Button` and `Input` components (Tailwind CSS v4 theme and utilities only, no global reset; the existing CSS keeps the look).
- `next/image`, `next/font` (Inter and Tajawal), `next/link` and `next/form`.
- ESLint (with the Next.js rules), Prettier, Husky and lint-staged. Node's built-in test runner (`node:test`) with `tsx`.

## Getting started

Requirements: Node.js 22.

```bash
npm install
cp .env.example .env.local
```

Start the API, then the app, in two terminals:

```bash
npm run api   # http://localhost:4000
npm run dev   # http://localhost:3000
```

Open http://localhost:3000. Without the API, the parts that need data show "We couldn't load the tools" with a **Try again** button; the rest of the page still works.

### See every state

`API_BASE_URL` in `.env.local` is where the app finds the API. Add a test switch after `/api`, restart `npm run dev`, and every request changes:

| State    | `API_BASE_URL`                         | What you see                                                               |
| -------- | -------------------------------------- | -------------------------------------------------------------------------- |
| Normal   | `http://localhost:4000/api`            | Everything                                                                 |
| Loading  | `http://localhost:4000/api/delay/3000` | The page frame at once, "Loading tools…" where the data goes               |
| Error    | `http://localhost:4000/api/fail/500`   | "We couldn't load the tools" and **Try again**; the rest of the page stays |
| Empty    | `http://localhost:4000/api/empty`      | "No tools listed yet"                                                      |
| No match | (normal) search for `zzz`              | "No items match" and **Clear filters**                                     |

The switches combine, e.g. `/api/delay/2000/fail/503`.

## Scripts

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Start the Next.js development server (port 3000)        |
| `npm run api`          | Start the API (port 4000)                               |
| `npm run build`        | Build for production                                    |
| `npm start`            | Serve the production build                              |
| `npm test`             | Run the unit tests                                      |
| `npm run lint`         | Check the project with ESLint (fails on any warning)    |
| `npm run typecheck`    | Generate the Next.js types, then check types with `tsc` |
| `npm run format`       | Format all files with Prettier                          |
| `npm run format:check` | Check formatting without changing files                 |

The pre-commit hook runs `lint-staged`, then `typecheck`, `lint`, `format:check` and `build`. Any failure stops the commit, so code with `any` never gets in.

## Routes

Each folder in `src/app/` is a route. A route file only reads the URL and draws the feature's component; the feature folders hold the real code.

| Route          | File                       | Data                                                  | While loading             | On error                       |
| -------------- | -------------------------- | ----------------------------------------------------- | ------------------------- | ------------------------------ |
| `/`            | `app/page.tsx`             | Featured items (`getItems()`)                         | Featured only: `Suspense` | Featured only: `RetryBoundary` |
| `/catalog`     | `app/catalog/page.tsx`     | All items, filtered by `?q=&category=&sort=`          | Results only: `Suspense`  | Results only: `RetryBoundary`  |
| `/items/[id]`  | `app/items/[id]/page.tsx`  | One item (`getItem(id)`); unknown id: `not-found.tsx` | `app/loading.tsx`         | `app/error.tsx`                |
| `/borrow-list` | `app/borrow-list/page.tsx` | All items (details of the list rows)                  | `app/loading.tsx`         | `app/error.tsx`                |
| `/register`    | `app/register/page.tsx`    | None                                                  |                           |                                |
| `/dashboard`   | `app/dashboard/page.tsx`   | The current persona (cookie)                          |                           |                                |
| `/list-item`   | `app/list-item/page.tsx`   | None (placeholder)                                    |                           |                                |
| anything else  | `app/not-found.tsx`        |                                                       |                           |                                |

`app/layout.tsx` is the shared layout around every page: Navbar, `<main>`, Footer and the toasts. Next.js loads each page's code only when that page is opened.

## Component tree

Every component has its own file, named like the component (`npm test` checks this). Next to each one: its props. **(client)** marks Client Components; all others are Server Components. **state** marks who owns state. Components from Next.js itself (`Link`, `Image`, `Form`) are not drawn.

```text
RootLayout { children }                       app/layout.tsx
├── Navbar (client) { lang, currentUser, itemIds }
│   │                                         state: menuOpen, profileOpen, scrolled (useState)
│   ├── NavLink (client) { route, label, onNavigate }      ×3
│   ├── ScrollLink (client) { targetId, className, onClick }
│   └── Suspense
│       └── BorrowListCount (client) { itemIds, lang }      reads the list (Zustand); use(itemIds)
├── main: the page
│   ├── /               HomePage → HomeView
│   │   └── RevealOnScroll (client) { className }
│   │       ├── Hero                                 (search: next/form, no state)
│   │       │   ├── CheckIcon ×3
│   │       │   └── SearchIcon
│   │       ├── About
│   │       │   └── ScrollLink (client) { targetId, className }
│   │       │       └── ArrowIcon
│   │       ├── Categories
│   │       │   └── ArrowIcon ×6
│   │       ├── Featured
│   │       │   ├── ArrowIcon
│   │       │   └── RetryBoundary (client) { lang, title }
│   │       │       └── Suspense (LoadingState { label })
│   │       │           └── FeaturedGrid             getItems()
│   │       │               ├── EmptyState { title, text }          no items
│   │       │               └── ItemCard { item, action }  key=item.id  ×8
│   │       │                   └── AddToListButton (client) { item, lang }
│   │       ├── HowItWorks
│   │       ├── IdleTools
│   │       │   └── CheckIcon ×3
│   │       └── Why
│   │
│   ├── /catalog        CatalogPage { searchParams } → CatalogView { filters }
│   │   ├── SearchIcon                               (search: next/form, no state)
│   │   └── RetryBoundary (client) { lang, title }
│   │       └── Suspense (LoadingState { label })
│   │           └── CatalogResults { filters }       getItems()
│   │               ├── EmptyState { title, text }                   no items
│   │               ├── FilterChips { filters, categories }
│   │               ├── SortSelect (client) { filters, lang }
│   │               ├── EmptyState { title, text, action }           no match
│   │               └── ItemCard { item, action, eager }  key=item.id
│   │                   └── AddToListButton (client) { item, lang }
│   │
│   ├── /items/[id]     ItemPage { params } → ItemDetail { item }   getItem(id)
│   │   ├── BackIcon
│   │   ├── OwnerCard { item }
│   │   └── BorrowForm (client) { item, borrower, lang }
│   │       │                                 state: fields, errors, isSubmitting (react-hook-form)
│   │       ├── Input { ...input props }   ×2
│   │       └── Button { ...button props }
│   │   (unknown id: ItemNotFoundPage → ItemNotFound → PlaceholderCard { title, text, action })
│   │
│   ├── /borrow-list    BorrowListPage → BorrowListView (client) { items, lang }
│   │   │                                     reads the list (Zustand)
│   │   ├── LoadingState { label }                   until the saved list is read
│   │   ├── EmptyState { title, text, action }       empty list
│   │   └── BorrowListRow (client) { entry, item, lang, onRowRemoved }  key=entry.itemId
│   │
│   ├── /register       RegisterPage → RegisterView (client) { lang }
│   │                                         state: createdName (useState)
│   ├── /dashboard      DashboardPage → DashboardView → PlaceholderCard { title, text }
│   ├── /list-item      ListItemPage → ListItemView → PlaceholderCard { title, text }
│   └── not found       NotFound → NotFoundView → PlaceholderCard { title, text }
│       (every PlaceholderCard without an action shows BackIcon in its link)
├── Footer
│   └── ScrollLink (client) { targetId, className }
├── Toasts (client)                                 reads the toasts (Zustand)
└── BorrowListHydration (client)                    reads the saved list once, in the browser

Next.js special files: app/loading.tsx → LoadingState { label }
                       app/error.tsx (client) { error, retry } → ErrorState { title, text, retryLabel, onRetry }
RetryBoundary shows ErrorState { title, text, retryLabel, onRetry } when its children fail.
```

### Who owns the state

| State                               | Owner                                                             | Why there                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Items from the API                  | The server: `getItems()` and `getItem(id)` in `cards/itemsApi.ts` | Server Components fetch them. React `cache()` makes one API call per request, however many parts ask.         |
| Filters and sort                    | The URL (`/catalog?q=&category=&sort=`)                           | Read with `parseCatalogParams()` and passed down as `filters`, so a link or a refresh keeps them.             |
| Language                            | The `borrowbox_lang` cookie                                       | The server must know it before drawing (`<html lang dir>`). Switched with the `switchLanguage` server action. |
| Current persona                     | The `borrowbox_current_user_id` cookie                            | The server needs it for the Navbar, the owner check and the dashboard. Switched with `switchPersona`.         |
| Borrow list (the cart)              | Zustand `borrowListStore`, saved in `localStorage`                | Many components need it (Navbar count, cards, list page). Changed only through the store's actions.           |
| Toasts                              | Zustand `toastStore`                                              | Any component can call `showToast()`; `Toasts` draws them.                                                    |
| Menu open, profile open, scrolled   | `Navbar` (`useState`)                                             | Only the header uses them.                                                                                    |
| Borrow form fields, errors, sending | `BorrowForm` (react-hook-form)                                    | Only the form uses them. Zod checks them with the rules in `requestRules.ts`.                                 |
| Account just created                | `RegisterView` (`useState`)                                       | Only that page uses it.                                                                                       |

Values that can be calculated are not state: the Navbar count, the list totals, the filtered and sorted cards and each item's status are calculated while drawing.

**Why Zustand and not Context:** the borrow list is used in the Navbar, on every card and on the list page. With Zustand any component reads it with one hook, there is no provider to wrap around the app, and a component draws again only when the part it reads changes. Zustand's `persist` saves it in `localStorage`.

## Project structure

```text
src/
├── app/                  # Routes only (Next.js App Router): layout, pages, loading, error, not-found
├── features/             # One folder per feature
│   ├── site/             # Navbar, NavLink, Footer, the not-found view
│   ├── home/             # Home page sections and their content
│   ├── cards/            # Items: API calls (server), mapper, photos, cards, the item page
│   ├── catalog/          # Catalog page: search, chips, sort, results, URL filters
│   ├── borrow-list/      # The borrow list (cart): rules, Zustand store, list page, count
│   ├── requests/         # Borrow rules, Zod schema, the form, the server action
│   ├── users/            # Demo users, the current user (cookie), the persona action
│   ├── register/         # Registration page
│   ├── dashboard/        # "My activity" page (placeholder)
│   └── list-item/        # "List an item" page (placeholder)
├── shared/               # Used by many features; never imports from features/ or app/
│   ├── api/              # The one API client (server only): getJson(), postJson()
│   ├── ui/               # Loading, error and empty states, RetryBoundary, toasts, icons, Button, Input
│   ├── i18n/             # en.ts, ar.ts, createI18n(), getI18n() (server), switchLanguage (action)
│   ├── lib/              # Pure functions (image URL check, dates, cn), tested with Node
│   ├── browser/          # Helpers that use browser features (storage, scroll reveal, scrolling)
│   └── types.ts          # Only Lang; each feature keeps its own types.ts
├── assets/               # Photos
└── style.css             # All styles, mobile-first, built on colour tokens
server/                   # The JSON API (npm run api)
tests/                    # node:test unit tests
```

## Translations

All interface text is in `src/shared/i18n/en.ts` and `src/shared/i18n/ar.ts`. Both files must have exactly the same keys; `npm test` fails if they differ, if an Arabic entry is empty, or if a component contains hard-coded English text. Category names, statuses and other stored values stay in English in the data and in URLs; only their displayed text is translated.

## Documentation

- [Project rules](CLAUDE.md): conventions for contributors and AI coding tools, and rules from real mistakes.
- [Design system](DESIGN.md): colours, type, spacing, components and motion, with measured contrast.
- [Debug lab log](debug-lab-log.md) and [debugging log](debugging-log.md): real bugs, how they were found and fixed.
- Claude Code skills in `.claude/skills/`: `vercel-react-best-practices` and `vercel-composition-patterns`, from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills).

## Status

Built: home page, catalog with search, category filter and sort, borrow list, item page with borrow requests, registration page, Arabic/English support.

Planned: the "My activity" dashboard where owners approve requests, and the "List an item" form. These routes show placeholder pages for now.
