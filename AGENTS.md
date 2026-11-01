# Project Rules —BorrowBox

## 1. Technology Stack

- Use Vite with vanilla JavaScript, HTML, and CSS.
- Do not use React, Vue, TypeScript, or other frameworks unless explicitly requested.
- Use native browser APIs whenever practical.

## Architecture

- `src/main.js`: app shell and hash router (`#/`, `#/catalog`, `#/item/:id`, `#/list-item`, `#/dashboard`, `#/register`).
- `src/views/`: one module per route. Each exports `mountXView(container, ...)` and returns a cleanup function.
- `src/components/`: reusable UI. Functions return HTML strings, plus `bindX()` functions for events.
- `src/store/`: data and `localStorage` persistence (seed data, demo users, item and request stores).
- `src/logic/`: pure functions only (filtering, availability, date rules). No DOM and no `localStorage`, so they can be tested with Node.
- `src/style.css`: all styles, organized in commented sections.
- `docs/superpowers/specs/` holds the approved design spec. `docs/superpowers/plans/` holds implementation plans.

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

## 4. JavaScript

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

## 6. Development Workflow

- Inspect the existing files before making changes.
- Explain the purpose of each change in simple English.
- Do not delete or rewrite existing files unnecessarily.
- After significant changes, run ESLint and Prettier checks.
- Fix errors introduced by your changes.

## 7. Project Goal

Build BorrowBox, an accessible peer-to-peer tool-sharing web app, as defined in
`docs/superpowers/specs/2026-10-30-borrowbox-design.md`.

Implement only the features explicitly requested. Keep the solution simple and suitable for a beginner-level university assignment.
