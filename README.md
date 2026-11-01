# BorrowBox

A peer-to-peer tool-sharing web app. Neighbors borrow tools from each other for free, and each borrow is backed by a **simulated** refundable deposit.

> **ملخص بالعربية:** BorrowBox منصة لمشاركة الأدوات بين الجيران. الاستعارة مجانية، ومحمية بتأمين مسترد (تجريبي). الواجهة متاحة بالعربية والإنجليزية، وتدعم الاتجاه من اليمين إلى اليسار.

This is a front-end MVP: there is no server. Data lives in the browser (`localStorage`), and three demo personas let you try both the owner and the borrower side in one browser.

## Features

- **Home page:** hero with a rotating photo background (with Pause/Play), tool categories, featured items, and a "how it works" section.
- **Item page** (`#/item/item-101`): photos, condition notes, owner, the refundable deposit, and a working **borrow request**. Requests are checked for valid dates, date overlaps, owners borrowing their own item, and duplicate pending requests.
- **Arabic and English:** switch from the header without reloading. The layout mirrors for right-to-left, Arabic uses the Tajawal font, and the choice is remembered.
- **Demo personas:** switch between Sarah (owner), Alex (borrower) and Elena (new member) from the profile menu.
- **Accessibility:** semantic HTML, keyboard support, visible focus, colour contrast measured against WCAG AA, and reduced-motion support.
- **Security:** text from the URL or from item data is escaped or set with `textContent`, so it is never treated as HTML.

## Tech stack

- [Vite](https://vite.dev/) with vanilla JavaScript (ES modules), HTML and CSS. No framework.
- ESLint and Prettier for code quality.
- Node's built-in test runner (`node:test`) for unit tests. No test libraries.

## Getting started

Requirements: Node.js 22 (the project is developed and tested on Node 22.22).

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the development server            |
| `npm run build`        | Build for production into `dist/`       |
| `npm run preview`      | Serve the production build locally      |
| `npm test`             | Run the unit tests                      |
| `npm run lint`         | Check the code with ESLint              |
| `npm run format`       | Format all files with Prettier          |
| `npm run format:check` | Check formatting without changing files |

Run `npm test`, `npm run lint` and `npm run format:check` before committing. There is no pre-commit hook yet.

## Project structure

```text
src/
├── main.js            # App shell and hash router (#/, #/catalog, #/item/:id, ...)
├── views/             # One module per page; mountXView(container) returns a cleanup
├── components/        # Reusable UI that returns HTML strings (Navbar, Footer, ItemCard, ...)
├── content/           # Page structure and the list of categories
├── i18n/              # en.js and ar.js dictionaries, and t() / setLang() / formatMoney()
├── logic/             # Pure functions with no DOM access (escaping, validation, dates, requests)
├── store/             # Seed data, demo users and localStorage access
├── utils/             # Small browser helpers
├── assets/            # Photos and illustrations
└── style.css          # All styles, mobile-first, built on colour tokens
tests/                 # node:test unit tests
docs/superpowers/      # Design specifications and implementation plans
```

Logic that can be tested without a browser lives in `src/logic/` and `src/i18n/`. Views only render and wire events.

## Translations

All interface text is in `src/i18n/en.js` and `src/i18n/ar.js`. Both files must have exactly the same keys; `npm test` fails if they differ, if an Arabic entry is empty, or if a component contains hard-coded English text.

To change wording, edit the dictionary only. Category names, statuses and other stored values stay in English in the data and in URLs; only their displayed text is translated.

## Documentation

- [Product design specification](docs/superpowers/specs/2026-10-30-borrowbox-design.md): the approved product rules, data models, borrowing lifecycle, security and language support.
- [Project rules](AGENTS.md): conventions for contributors and coding agents.
- `docs/superpowers/plans/`: implementation plans for each feature.

## Status

Built: home page, item detail page with borrow requests, Arabic/English support.

Planned: the catalog search page (`#/catalog`), the "My activity" dashboard where owners approve requests, and the "List an item" form. These routes show placeholder pages for now.
