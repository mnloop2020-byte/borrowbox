# Project Rules — ShopBoard

## 1. Technology Stack

- Use Vite with vanilla JavaScript, HTML, and CSS.
- Do not use React, Vue, TypeScript, or other frameworks unless explicitly requested.
- Use native browser APIs whenever practical.

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

## 5. Code Quality

- Follow ESLint rules.
- Use Prettier to format code.
- Avoid unnecessary packages and configuration changes.
- Keep the project compatible with the existing Vite setup.

## 6. Development Workflow

- Inspect the existing files before making changes.
- Explain the purpose of each change in simple English.
- Do not delete or rewrite existing files unnecessarily.
- After significant changes, run ESLint and Prettier checks.
- Fix errors introduced by your changes.

## 7. Project Goal

Build ShopBoard, a small and accessible shop website with:

- A header containing navigation.
- A hero section.
- A products section using article cards.
- A registration form with labels and native HTML validation.

Implement only the features explicitly requested. Keep the solution simple and suitable for a beginner-level university assignment.
