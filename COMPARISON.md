# BorrowBox compared with ShopBoard

Reference project: [yaman3bd/shopboard-reference](https://github.com/yaman3bd/shopboard-reference)

How I studied it: I ran it first and tried every page, the cart after a refresh, a "spam" review, and the `/delay/3000`, `/fail/500` and `/empty` states. Then I read the README, CLAUDE.md, `package.json` and `modules/`, followed the cart from the button to the store, and read `git log`.

## Structure

- What I did: A folder per feature in `src/features/`, routes only in `src/app/`, shared code in `src/shared/`. PascalCase and camelCase file names.
- What the reference does: A folder per feature in `modules/`, each with its own `components/` folder. kebab-case names, and files named for their job (`types.ts`, `api.ts`, `store.ts`).
- What I will take, and why: Nothing for now. It's the same idea as mine, and renaming every file wouldn't make the app better.

## API client

- What I did: One server-only client that returns `{ ok, data }` or `{ ok, status }` and logs failures. The API is a separate Node server.
- What the reference does: One `api<T>()` function that throws `ApiError`. The API is inside the app (`app/api/[...path]/route.ts`).
- What I will take, and why: I'll keep mine, because a returned error can't be forgotten like a thrown one. I may add the API's error message to my log, like `readMessage()` does.

## Types and schemas

- What I did: `types.ts` per feature, and `itemMapper.ts` checks every field the API sends. Zod for the forms, checked again on the server.
- What the reference does: Plain types for the API with no check, because it's its own API. Zod only for forms.
- What I will take, and why: I'll keep checking the API, since my API is a separate server. I'll add the reference's simple rule to my CLAUDE.md: Zod for user input, a check for any API you don't control.

## State

- What I did: Zustand store for the borrow list with `persist`, `partialize`, `version` and `migrate`. Filters in the URL.
- What the reference does: The same for the cart, plus a small `useHydrated()` hook, and `useOptimistic` for reviews.
- What I will take, and why: `useOptimistic` for sending a borrow request, so it shows at once and rolls back if the API says no.

## Forms

- What I did: React Hook Form + Zod. Errors are codes, translated into English or Arabic.
- What the reference does: React Hook Form + Zod, a `TextField` component for every field, and the text goes back into the form when sending fails.
- What I will take, and why: Giving the text back when sending fails, in my borrow request form, so the user doesn't type again.

## Loading, error and not-found

- What I did: One root `loading.tsx` and `error.tsx`, with `Suspense` and `RetryBoundary` inside the pages. Different messages for "API error", "no items" and "no match".
- What the reference does: A `loading.tsx` and `error.tsx` for every route, and parallel routes on the product page.
- What I will take, and why: A `loading.tsx` for `catalog` and `items/[id]`, so the skeleton looks like the page that's coming. Not parallel routes, because my item page loads only one part.

## UI kit and tokens

- What I did: Plain CSS in one long file, built on the tokens in `DESIGN.md`. Tailwind only for `Button` and `Input`. Arabic and RTL.
- What the reference does: Tailwind and about 15 shadcn components, tokens as CSS variables, and dark mode.
- What I will take, and why: Not now, because moving to Tailwind means rewriting the whole look. I'll split my CSS file by feature if it keeps growing.

## Tooling

- What I did: ESLint, Prettier, a pre-commit hook and 129 tests. The ban on `any`, `as` and `!` is only written in CLAUDE.md.
- What the reference does: ESLint, Prettier and a pre-commit hook, and ESLint itself blocks `any`, `as` and `!`. No tests.
- What I will take, and why: The three ESLint rules. I made the `as` mistake before (`e.target as Node`, fixed later with an `instanceof` check), and a rule in ESLint stops the commit, while a line in CLAUDE.md doesn't.

## CLAUDE.md

- What I did: Long, with the architecture file by file and "Rules From Mistakes" with the story of each one.
- What the reference does: Shorter, grouped by topic, one line per mistake.
- What I will take, and why: A short Commands section at the top. I'll keep my longer mistakes section, because the story is what helps me remember.

## What I did better

- 129 tests. The reference has none.
- "No items" and "no match" are different messages. When I tried `/empty` on the reference, it showed "No products match" even though I hadn't searched for anything.
- Arabic and RTL. The reference only lists it as an idea.
- I check the API answer, so a broken answer becomes an error message, not a crash.
- No Console warnings. The reference has an LCP warning and uses the deprecated `priority`.

## My grade

Grade: 89 / 100

Why: The app does everything the course asked, and goes further with 129 tests, Arabic and English, a checked API answer and a clean Console. The comparison also showed me my next steps: the type rules in ESLint, a `loading.tsx` for each page, splitting the CSS file, finishing the two placeholder pages, and a real 404 status for an unknown item. I had exams last week, and they made it hard for me to give my best.
