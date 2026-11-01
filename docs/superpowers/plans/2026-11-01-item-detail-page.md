# Item Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `#/item/:id` placeholder with a full item page and a working borrow request.

**Architecture:** Rules live in pure modules (`src/logic/dates.js`, `src/logic/requests.js`) tested with `node --test`. A thin storage layer persists requests. `ItemDetailView.js` renders and wires the form only.

**Tech Stack:** Vite 8, vanilla ES modules, `node:test`. No new packages.

**Spec:** `docs/superpowers/specs/2026-11-01-item-detail-page-design.md`

## Global Constraints

- Signatures, rule order and message copy exactly as spec §3 and §4.
- Escape item text or set it with `textContent`; images through `isSafeImageUrl`.
- Colours from existing tokens only; hover inside `@media (hover: hover)`.
- `npm test`, `npm run lint`, `npm run format:check`, `npm run build` pass after every task.
- No commits until the user says so.

## Review Focus

1. Ranges that touch on one day (end = other start) must count as overlapping. Test in Task 1.
2. Ended requests (`Rejected`, `Expired`, `Cancelled`, `Completed`, `Returned`) must not block dates. Test in Task 1.
3. Corrupt `localStorage` must not crash the page. Test in Task 2.
4. The owner must never see the request form. Browser check in Task 3.
5. "Today" must be the local date, not UTC: a request at 01:00 local time must not count as "yesterday". Test in Task 1.

---

### Task 1: Date and request rules (TDD)

**Files:** Create `src/logic/dates.js`, `src/logic/requests.js`; Test `tests/requests.test.js`

- [ ] Write tests for `todayISO` (a local 01:00 date gives that local day), `rangesOverlap` (touching days overlap; separate ranges do not), every `validateRequest` code in spec §3 order (`missing-dates`, `start-in-past`, `end-before-start`, `duplicate-pending`, `overlap`), ended statuses not blocking, `createRequestRecord` shape, and `deriveItemStatus` (`isManuallyPaused` → Unavailable; `Disputed` → Unavailable; `Active` covering today → Reserved; `Pending Approval` covering today → Available).
- [ ] Run `npm test`. Expected: FAIL, module not found.
- [ ] Implement per spec §4.
- [ ] Run `npm test`. Expected: all pass.

### Task 2: Storage

**Files:** Create `src/store/storage.js`, `src/store/requestStore.js`; Test `tests/storage.test.js`

- [ ] Write tests with a fake `localStorage` object passed in: valid JSON round-trips; corrupt JSON returns the fallback; a non-array stored value makes `getRequests` return `[]`; a throwing storage (private mode) returns the fallback and does not throw on write.
- [ ] Run `npm test`. Expected: FAIL.
- [ ] Implement `getJSON(key, fallback, storage = globalThis.localStorage)`, `setJSON(key, value, storage = globalThis.localStorage): boolean`, `getRequests(storage?)`, `addRequest(record, storage?)`.
- [ ] Run `npm test`. Expected: all pass.

### Task 3: View, route and styles

**Files:** Create `src/views/ItemDetailView.js`; Modify `src/main.js` (item route), `src/style.css`

- [ ] `mountItemDetailView(container, itemId): () => void` per spec §2 and §3, reading `SEED_ITEMS`, `userStore.getCurrentUser()` and `getRequests()`.
- [ ] Route: valid id → `mountItemDetailView`; document title `<item title> — BorrowBox` or "Item not found — BorrowBox".
- [ ] Styles: two columns at ≥ 1024px with a sticky booking panel, one column below.
- [ ] Browser checks from spec §6. Lint, format and build pass.
