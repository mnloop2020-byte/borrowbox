# BorrowBox

A peer-to-peer tool-sharing web app. Neighbors borrow tools from each other for free, and each borrow is backed by a **simulated** refundable deposit.

This is an MVP with a small JSON API (`server/`): the items come from `GET /api/items`, and borrow requests go to `POST /api/requests`. The borrow list and the demo persona live in the browser (`localStorage`), and three demo personas let you try both the owner and the borrower side in one browser.

## Features

- **Home page:** a search-first hero with category shortcuts, tool categories, featured items, "how it works" in four steps, and sections that rise into view as you scroll.
- **Catalog** (`#/catalog`): all 14 items in a grid, with a name search (upper/lower case does not matter), category chips built from the data, and a sort (name, deposit low/high, or the default order). Search, category and sort work together and live in the URL (`#/catalog?category=Camping&q=stove&sort=name`), so a filtered list can be shared.
- **Borrow list** (`#/borrow-list`): works like a cart. "Add to list" on a card adds the item (again: one more day). On the list page, − and + change the days (− from 1 removes the item), and items can be removed one by one or all at once. The count in the header is always up to date, and the list is saved in `localStorage`, so it is still there after a refresh.
- **Item page** (`#/item/item-103`): the photo, condition notes, owner, the refundable deposit, and a working **borrow request**. Requests are checked for valid dates, date overlaps, owners borrowing their own item, and duplicate pending requests.
- **Registration page** (`#/register`): a sign-up form checked by the browser's own validation (required fields, email format, minimum length).
- **Arabic and English:** switch from the header without reloading. The layout mirrors for right-to-left, Arabic uses the Tajawal font, and the choice is remembered.
- **Demo personas:** switch between Sarah (owner), Alex (borrower) and Elena (new member) from the profile menu.
- **Accessibility:** semantic HTML, keyboard support, visible focus, colour contrast measured against WCAG AA, and reduced-motion support.
- **Design:** a warm cream and orange design based on the visual language of [Nomu](https://en.nomu.store), adapted to pass contrast checks. See [DESIGN.md](DESIGN.md).
- **Security:** text from the URL or from item data is shown through React, which escapes it, so it is never treated as HTML. Image URLs and item ids are checked first.

## Tech stack

- [Vite](https://vite.dev/) with [React](https://react.dev/) and TypeScript (strict mode, ES modules), HTML and CSS.
- ESLint and Prettier for code quality, run on every commit by husky and lint-staged.
- Fonts: Inter (Latin) and Tajawal (Arabic) from Google Fonts.
- Node's built-in test runner (`node:test`) for unit tests. No test libraries.

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

### See every state

The pages show a message for each state of the items. To see one, change `ITEMS_PATH` in `src/features/cards/itemsApi.ts` for a moment:

| State    | `ITEMS_PATH`              | What you see                                   |
| -------- | ------------------------- | ---------------------------------------------- |
| Loading  | `"/items?delay=3000"`     | "Loading tools…" for 3 seconds                 |
| Error    | `"/items?fail=500"`       | "We couldn't load the tools" and **Try again** |
| Empty    | `"/items?empty=1"`        | "No tools listed yet"                          |
| No match | (normal) search for `zzz` | "No items match" and **Clear filters**         |

Stopping `npm run api` also shows the error: "The server did not answer".

## Scripts

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the development server             |
| `npm run api`          | Start the API server on port 3000        |
| `npm run build`        | Build for production into `dist/`        |
| `npm run preview`      | Serve the production build locally       |
| `npm test`             | Run the unit tests                       |
| `npm run lint`         | Check the code with ESLint               |
| `npm run typecheck`    | Check types with the TypeScript compiler |
| `npm run format`       | Format all files with Prettier           |
| `npm run format:check` | Check formatting without changing files  |

A pre-commit hook (husky and lint-staged) runs ESLint and Prettier on staged files and then `npm run typecheck`; a lint or type error blocks the commit.

## Project structure

Files are grouped by feature: everything about one feature is in one folder.

```text
src/
├── main.tsx              # Starts React and draws the app
├── app/                  # The frame around every page: App (shell and router), Navbar, Footer, NotFoundView
├── features/             # One folder per feature
│   ├── home/             # Home page and its content
│   ├── cards/            # Item data, categories, item card, item page, item id check
│   ├── requests/         # Borrow requests: rules, saving, sending to the API
│   ├── users/            # Demo users and the current user
│   ├── catalog/          # Catalog page: search, category chips, sort, item grid
│   ├── borrow-list/      # The borrow list (cart): rules, saving, the list page
│   ├── register/         # Registration page
│   ├── dashboard/        # "My activity" page (placeholder)
│   └── list-item/        # "List an item" page (placeholder)
├── shared/               # Used by many features; never imports from features/
│   ├── api/              # The one API client: getJson(), postJson(), BASE_URL
│   ├── ui/               # Loading, error and empty states, toasts, icons
│   ├── i18n/             # en.ts and ar.ts dictionaries, t(), setLang(), formatMoney()
│   ├── lib/              # Pure functions (image URL check, dates), tested with Node
│   ├── browser/          # Helpers that use browser features (DOM, storage, scrolling)
│   └── types.ts          # Only Lang; each feature keeps its own types.ts
├── assets/               # Photos and illustrations
└── style.css             # All styles, mobile-first, built on colour tokens
server/                   # The JSON API (npm run api)
tests/                    # node:test unit tests
```

Rules (`requestRules.ts`, `itemId.ts`, `catalogFilter.ts`, `catalogParams.ts`) and everything in `shared/lib/` are pure functions with no DOM, so Node tests them directly. Pages only render and wire events.

## Component tree

Every component is in its own file, named like the component (`npm test` checks this). Next to each component: the props it gets. **State** marks the components that own state.

The tree was checked against the running app with the Components tab of React DevTools, page by page.

```text
App                                    state: hash (useState) · language (store)
├── Navbar { hash }                    state: menuOpen, profileOpen, scrolled (useState)
│   │                                         · user, language, borrow list, items (stores)
│   ├── NavLink { hash, route, label, onNavigate }      ×3
│   └── ScrollLink { targetId, className, onClick }
├── <main>: one page, picked by renderRoute(hash)
│   │
│   ├── #/             HomeView
│   │   ├── Hero                       (the search reads the form on submit: no state)
│   │   │   ├── CheckIcon              ×3
│   │   │   └── SearchIcon
│   │   ├── About
│   │   │   └── ScrollLink { targetId, className }
│   │   ├── Categories
│   │   ├── Featured                   state: items (store)
│   │   │   ├── ItemsStatus { state }                    while loading or on error
│   │   │   └── ItemCard { item, action }   key=item.id   ×8
│   │   │       └── AddToListButton { item }
│   │   ├── HowItWorks
│   │   ├── IdleTools
│   │   │   └── CheckIcon              ×3
│   │   └── Why
│   │
│   ├── #/catalog      CatalogView { queryString }   key=queryString
│   │   │                              state: search (useState) · items (store)
│   │   ├── SearchIcon
│   │   ├── ItemsStatus { state }                        while loading or on error
│   │   └── CatalogResults { items, filters }
│   │       ├── EmptyState { title, text }               no items at all
│   │       ├── FilterChips { filters, categories }
│   │       ├── SortSelect { filters }
│   │       ├── EmptyState { title, text, action }       no match
│   │       └── ItemCard { item, action }   key=item.id   ×14
│   │           └── AddToListButton { item }
│   │
│   ├── #/item/:id     ItemDetailView { itemId }   key=itemId
│   │   │                              state: items (store)
│   │   ├── ItemPageStatus { state }                     while loading or on error
│   │   │   └── ItemsStatus { state }
│   │   ├── ItemNotFound                                 unknown id
│   │   │   └── PlaceholderCard { title, text, action }
│   │   └── ItemDetail { item }        state: user (store)
│   │       ├── BackIcon
│   │       ├── OwnerCard { item }
│   │       └── BorrowForm { item }    state: startDate, endDate, errors, isSending (useState)
│   │
│   ├── #/borrow-list  BorrowListView  state: borrow list, items (stores)
│   │   ├── ItemsStatus { state }                        while loading or on error
│   │   ├── EmptyState { title, text, action }           empty list
│   │   └── BorrowListRow { entry, item, onRowRemoved }   key=entry.itemId
│   │
│   ├── #/register     RegisterView    state: createdName (useState)
│   ├── #/dashboard    DashboardView   state: user (store)
│   │   └── PlaceholderCard { title, text }
│   │       └── BackIcon
│   ├── #/list-item    ListItemView
│   │   └── PlaceholderCard { title, text }
│   │       └── BackIcon
│   └── anything else  NotFoundView
│       └── PlaceholderCard { title, text }
│           └── BackIcon
├── Footer
│   └── ScrollLink { targetId, className }
└── Toasts                             state: toasts (store)
```

`ItemsStatus { state }` draws `LoadingState { label }` or `ErrorState { title, text, onRetry }`.

### Who owns the state

| State                             | Owner                                                        | Why there                                                                                                  |
| --------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| The current page (`hash`)         | `App` (`useState`)                                           | It picks the page and is passed to `Navbar` for the active link.                                           |
| Menu open, profile open, scrolled | `Navbar` (`useState`)                                        | Only the header uses them.                                                                                 |
| Search text while typing          | `CatalogView` (`useState`)                                   | A controlled input; the URL holds the search after submit.                                                 |
| Filters and sort                  | The URL (`#/catalog?q=&category=&sort=`)                     | Read with `parseCatalogParams()` and passed down as `filters`, so a link or refresh keeps them.            |
| Dates, errors, sending            | `BorrowForm` (`useState`)                                    | Only the form uses them.                                                                                   |
| Account just created              | `RegisterView` (`useState`)                                  | Only the page uses it.                                                                                     |
| Items from the API                | `itemsStore` (`cards/itemsStore.ts`), read with `useItems()` | One request shared by every page. Loading, error or success.                                               |
| Borrow list (the cart)            | `borrowListStore`, read with `useBorrowList()`               | Saved in `localStorage`, so it survives a refresh; the Navbar count and the list page read the same store. |
| Language                          | `i18n.ts`, read with `useLang()`                             | `App` reads it, so every page draws again after a switch.                                                  |
| Current persona                   | `userStore`, read with `useCurrentUser()`                    | Used by the Navbar, the item page (owner check) and the dashboard.                                         |
| Toasts                            | `toast.ts`, read in `Toasts`                                 | Any feature can call `showToast()`.                                                                        |

A "store" is a small module outside React: one function returns the current value (such as `itemsStore.getState()` or `getLang()`) and a `subscribe` function tells React when it changes. Components read it with `useSyncExternalStore`, so every component that reads the same store draws again when it changes.

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
