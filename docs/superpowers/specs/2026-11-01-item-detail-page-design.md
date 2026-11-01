# BorrowBox Item Detail Page: Design Specification

**Version:** 1.0.0
**Date:** 2026-11-01
**Status:** Approved in chat (2026-11-01)
**Builds on:** product spec `docs/superpowers/specs/2026-10-30-borrowbox-design.md` v1.4.0 (§1.2 items 1–2, §5.2, §5.3, §6.2, §8.1, §8.3). Replaces Phase 3 and a simplified part of Phases 1 and 4 of `docs/superpowers/plans/2026-10-30-catalog-itemdetail.md`.

## 1. Decisions

| #   | Decision                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | "Price" means the **refundable deposit**. Borrowing stays free; no rental price.                                                                                                                           |
| D2  | The page includes a **working borrow request**: two native `<input type="date">` fields and a submit button. The request is saved to `localStorage` with status `Pending Approval` and deposit `Not Held`. |
| D3  | No custom calendar. Owner approve/reject belongs to the later My Activity page.                                                                                                                            |

## 2. Page (`#/item/:id`)

- Back link "← Back to catalog" (`#/catalog`).
- Image (`item.imageUrl`, `alt` = item title), category, h1 title, availability badge (derived, §4), description.
- Condition section: condition level and `conditionNotes`.
- Owner card: owner name, "Verified" when `ownerVerified`, rating when present.
- Booking panel: "Refundable deposit" with the amount; the line "Free to borrow. Your deposit comes back when the item is returned in good condition."; From and To date fields; "Request to borrow" button; message area.
- Wide screens (≥ 1024px): two columns, booking panel sticky on the right. Small screens: one column, booking panel after the title block.
- Unknown valid id (e.g. `item-999`): h1 "We couldn't find this item" with a link to the catalog. Invalid id format: existing 404 view.
- Current user is the owner: the form is replaced by "This is your listing."

All item text is escaped (`escapeHtml`) or set with `textContent`; images pass `isSafeImageUrl` (product spec §8.3).

## 3. Request rules and messages

Checked in this order on submit; the first failure is shown next to its field.

| Rule                                                                                      | Field         | Message                                                          |
| ----------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| Both dates present                                                                        | the empty one | Choose a start date and an end date.                             |
| Start ≥ today (local date)                                                                | From          | Choose a start date from today onwards.                          |
| End ≥ start                                                                               | To            | Choose an end date on or after the start date.                   |
| No pending request by this borrower for this item                                         | form          | You already have a pending request for this item.                |
| No overlap with an `Active` or `Pending Approval` request for this item (inclusive dates) | form          | These dates overlap an existing booking. Choose different dates. |
| Success                                                                                   | form          | Request sent. The owner has 48 hours to respond.                 |

Field errors use `aria-invalid="true"` and `aria-describedby`; focus moves to the first invalid field. Form-level messages use `role="status"` (success) or `role="alert"` (error). The date inputs have `min` set to today.

## 4. Logic (pure, unit-tested)

- `todayISO(now: Date): string` → local `YYYY-MM-DD`.
- `rangesOverlap(aStart, aEnd, bStart, bEnd): boolean` → inclusive: `aStart <= bEnd && aEnd >= bStart` (ISO strings compare as dates).
- `validateRequest({ item, borrowerId, startDate, endDate, requests, today }): { ok: true } | { ok: false, field: "start" | "end" | "form", code: string }`.
- `createRequestRecord({ item, borrower, startDate, endDate, now, id }): Request` → product spec §5.3 shape, status `Pending Approval`, deposit `Not Held`, every timestamp null except `createdAt`.
- `deriveItemStatus(item, requests, today): "Available" | "Reserved" | "Unavailable"` → product spec §5.2 rules.

Storage: `getJSON(key, fallback)` and `setJSON(key, value)` wrap `localStorage` in try/catch. Requests live under `borrowbox_requests`. Corrupt or non-array data reads as `[]`.

## 5. Out of scope

Custom calendar, owner approval, 48-hour expiry sweep, dashboard, editing or cancelling requests, multiple images per item.

## 6. Verification

`npm test` covers every rule in §3 and §4, including: a range ending on the day another starts overlaps; `Rejected`, `Expired` and `Cancelled` requests do not block dates; corrupt storage reads as empty. In the browser: 320/768/1280px without horizontal scroll, a real request saved and visible in `localStorage`, a duplicate request blocked, the owner view as Sarah, keyboard-only submission with errors announced. Lint, format and build pass.
