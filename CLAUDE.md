# Project Rules —BorrowBox

## 1. Technology Stack

- Use Vite with vanilla TypeScript, HTML, and CSS (strict mode, see `tsconfig.json`).
- Do not use React, Vue, or other frameworks unless explicitly requested.
- Use native browser APIs whenever practical.

## Architecture

- `src/main.ts`: app shell and hash router (`#/`, `#/catalog`, `#/item/:id`, `#/list-item`, `#/dashboard`, `#/register`).
- `src/views/`: one module per route. Each exports `mountXView(container, ...)` and returns a cleanup function.
- `src/components/`: reusable UI. Functions return HTML strings, plus `bindX()` functions for events.
- `src/store/`: data and `localStorage` persistence (seed data, demo users, item and request stores).
- `src/logic/`: pure functions only (filtering, availability, date rules). No DOM and no `localStorage`, so they can be tested with Node.
- `src/types.ts`: shared data shapes (`Item`, `User`, `BorrowRequest`, `Lang`). Types only, no runtime code.
- `src/utils/dom.ts`: `getElement()` finds an element that must exist, with the right type.
- `src/style.css`: all styles, organized in commented sections.

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

- Write `.ts` files. Import with the `.ts` extension (`from "./dates.ts"`), so Node can run the tests directly.
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
- Pure logic in `src/logic/` has tests run with `npm test` (Node's built-in `node:test`; no test packages).
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

**The rule:** After any color change, check the contrast of every text element against the background it sits on, including inside the dark header, hero and footer. Text must reach 4.5:1 (3:1 for large text). Run Lighthouse accessibility before saying a page is done.
