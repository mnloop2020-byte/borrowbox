# BorrowBox

A peer-to-peer tool-sharing web app. Neighbors borrow tools from each other for free, and each borrow is backed by a **simulated** refundable deposit.

This is an MVP with a small JSON API (`server/`) for borrow requests. Other data lives in the browser (`localStorage`), and three demo personas let you try both the owner and the borrower side in one browser.

## Features

- **Home page:** a search-first hero with category shortcuts, tool categories, featured items, "how it works" in four steps, and sections that rise into view as you scroll.
- **Item page** (`#/item/item-103`): the photo, condition notes, owner, the refundable deposit, and a working **borrow request**. Requests are checked for valid dates, date overlaps, owners borrowing their own item, and duplicate pending requests.
- **Registration page** (`#/register`): a sign-up form checked by the browser's own validation (required fields, email format, minimum length).
- **Arabic and English:** switch from the header without reloading. The layout mirrors for right-to-left, Arabic uses the Tajawal font, and the choice is remembered.
- **Demo personas:** switch between Sarah (owner), Alex (borrower) and Elena (new member) from the profile menu.
- **Accessibility:** semantic HTML, keyboard support, visible focus, colour contrast measured against WCAG AA, and reduced-motion support.
- **Design:** a warm cream and orange design based on the visual language of [Nomu](https://en.nomu.store), adapted to pass contrast checks. See [DESIGN.md](DESIGN.md).
- **Security:** text from the URL or from item data is escaped or set with `textContent`, so it is never treated as HTML.

## Tech stack

- [Vite](https://vite.dev/) with vanilla TypeScript (strict mode, ES modules), HTML and CSS. No framework.
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

In a second terminal, start the API, which the borrow form needs:

```bash
npm run api
```

Then open http://localhost:5173.

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

```text
src/
├── main.ts            # App shell and hash router (#/, #/catalog, #/item/:id, ...)
├── types.ts           # Shared data shapes (Item, User, BorrowRequest, Lang)
├── views/             # One module per page; mountXView(container) returns a cleanup
├── components/        # Reusable UI that returns HTML strings (Navbar, Footer, ItemCard, icons)
├── content/           # Page structure and the list of categories
├── i18n/              # en.ts and ar.ts dictionaries, and t() / setLang() / formatMoney()
├── logic/             # Pure functions with no DOM access (escaping, validation, dates, requests)
├── store/             # Seed data, demo users and localStorage access
├── utils/             # Small browser helpers (element lookup, scrolling, scroll reveal)
├── assets/            # Photos and illustrations
└── style.css          # All styles, mobile-first, built on colour tokens
tests/                 # node:test unit tests
```

Logic that can be tested without a browser lives in `src/logic/` and `src/i18n/`. Views only render and wire events.

## Translations

All interface text is in `src/i18n/en.ts` and `src/i18n/ar.ts`. Both files must have exactly the same keys; `npm test` fails if they differ, if an Arabic entry is empty, or if a component contains hard-coded English text.

To change wording, edit the dictionary only. Category names, statuses and other stored values stay in English in the data and in URLs; only their displayed text is translated.

## Documentation

- [Project rules](CLAUDE.md): conventions for contributors and AI coding tools, and where a new feature goes.
- [Design system](DESIGN.md): colours, type, spacing, components and motion, with measured contrast.

## Status

Built: home page, item detail page with borrow requests, registration page, Arabic/English support.

Planned: the catalog search page (`#/catalog`), the "My activity" dashboard where owners approve requests, and the "List an item" form. These routes show placeholder pages for now.
