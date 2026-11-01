# BorrowBox System Architecture & Design Specification (MVP)

**Document Version:** 1.5.0  
**Date:** 2026-11-01  
**Status:** Approved

**Changes in 1.5.0:** Added English and Arabic language support (§10): language switching and persistence, no-flash initialization, translation architecture, category and fixed-value display translation, RTL layout, Arabic typography, currency formatting and re-rendering rules. Supersedes the "Arabic translation" out-of-scope line in the redesign spec.

**Changes in 1.4.0:** Resolved 12 open decisions (categories, user fields, local images, derived item status, Reserved rule, pending-request limit, cancel deadline, overdue label, owner-marked returns, date release, borrowing eligibility, dispute scope). Added registration behavior, security rules (§8.3), and unit tests (§9). Aligned architecture (§4.1) and layout (§3.2) with the implemented code.

---

## 1. Product Overview & MVP Requirements

### 1.1 Mission & Value Proposition

BorrowBox is a community-driven, peer-to-peer (P2P) web platform that connects neighbors to share, lend, and borrow household tools and equipment. Instead of purchasing costly, infrequently used items (e.g., power drills, pressure washers, camping equipment), community members can borrow them for free, backed by a simulated refundable security deposit.

### 1.2 Core MVP Scope

1. **Catalog & Discovery:** Filter and search items by category, keyword, and availability status (`Available`, `Reserved`, `Unavailable`). Categories are one shared list of six: `Power Tools`, `Hand Tools`, `Gardening`, `Cleaning`, `Camping`, `Outdoor Equipment`. Every category has at least one seed item. Display detailed item cards with security deposit, condition notes, verified owner badge, and date-aware availability.
2. **Borrowing Request Workflow (Owner Approval First):**
   - Borrower submits borrow request with start and end dates.
   - **Eligibility:** Owners cannot request their own items. Unverified members may request; the owner sees an "Unverified" badge on the request.
   - **One pending request per borrower per item:** A borrower who already has a `Pending Approval` request for an item cannot submit another for the same item until it is resolved.
   - Status enters `Pending Approval` with deposit `Not Held`.
   - **48-Hour Expiration Rule:** Requests pending approval for $>48$ hours automatically expire upon application access, transitioning to `Expired` with deposit `Not Held`, immediately releasing the reserved interval.
   - Owner reviews the request to approve or reject.
   - If approved: status transitions to `Active`, deposit status becomes `Held`, and item availability is locked for conflicting date intervals.
   - If rejected: status becomes `Rejected`, deposit remains `Not Held`, and dates are released.
3. **Physical Handover Confirmation Protocol:**
   - Owner confirms the physical handover to the borrower, setting `handedOverAt = current timestamp`.
   - Before confirming handover, the modal/form requires logging `preHandoverNotes` and optional pre-handover condition photos to record item baseline state.
   - Prior to handover, `handedOverAt` remains `null`.
4. **Borrow Request Cancellation Protocol:**
   - **Pre-Approval:** Borrower can cancel anytime. Status becomes `Cancelled`, deposit remains `Not Held`, dates freed.
   - **Post-Approval (Pre-Handover):** Cancellation is strictly permitted **only when `handedOverAt === null` AND today (local date) is before `startDate`**: the last day to cancel is the day before the start date. Compare plain `YYYY-MM-DD` dates, not timestamps. Status becomes `Cancelled`, deposit reverts to `Not Held`, owner is notified via a dashboard alert badge, and dates are freed.
   - **Post-Handover (`handedOverAt !== null`):** Cancellation is strictly prohibited. The loan is legally/physically in progress; the borrower must use the return workflow, and the owner must use the inspection/dispute workflow.
5. **Owner Inspection & Return Workflow:**
   - Borrower **or owner** marks item returned (status transitions to `Returned`, deposit remains `Held`, sets `returnedAt`). The owner option prevents a loan being stuck when the borrower does not respond.
   - **Overdue:** If `handedOverAt !== null`, status is `Active`, and today is after `endDate`, the dashboard shows a derived "Overdue" label. This is display-only, not a new status; further overdue rules are out of MVP scope.
   - Owner inspects item condition and records `postReturnNotes`.
   - Owner approves return (status transitions to `Completed`, deposit status becomes `Refunded`, sets `inspectedAt`, item availability restored) OR reports an issue (status transitions to `Disputed`, deposit status becomes `Under Review`, sets `inspectedAt`, `issueDescription`, and `issueImages`).
6. **Unified "My Activity" Dashboard:**
   - Tabs for "My Borrowed Items" and "My Listings".
   - Status indicators for active loans, pending approvals, and deposits (`Not Held`, `Held`, `Refunded`, `Under Review`).
   - Actionable triggers:
     - Owners: Approve/Reject requests, Confirm Handover (capturing condition notes), Inspect & Approve returns, Report issues.
     - Borrowers: Cancel request (before the cancel deadline, pre-handover only), Mark returned.
     - Owners can also Mark returned.
7. **Item Listing & Registration:**
   - Semantic form to list tools (title, category, condition, condition notes, condition photo URLs, deposit amount, description, manual listing status). Photo URLs must pass the image URL rule in §8.3.
   - Member registration form with native HTML5 validation. Because all users are demo personas, submitting validates the form and shows a confirmation message; it does not create a new user.
8. **Persistence & Demo Persona Switcher:**
   - Client-side storage (`localStorage`) initialized with realistic seed mock data for immediate evaluation.
   - Navbar profile dropdown persona switcher (`Sarah Jenkins - Owner`, `Alex Mercer - Borrower`, `Elena Rostova - New Member`) to allow full testing of both roles in a single browser session.
   - Lazy evaluation hook on store initialization and queries to automatically detect and transition expired requests.

---

## 2. User Journeys & Application Routes

A client-side hash router (`window.location.hash`) manages view transitions without full-page reloads.

### 2.1 Route Map

| Route            | View Component   | Description                                                                                                               |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `#/` or `#/home` | `HomeView`       | Landing page featuring hero, value proposition, quick stats, and featured items.                                          |
| `#/catalog`      | `CatalogView`    | Full searchable and filterable directory with date availability badges (`Available`, `Reserved`, `Unavailable`).          |
| `#/item/:id`     | `ItemDetailView` | Item specifications, owner reputation, condition notes/photos, date availability checker, and "Request to Borrow" action. |
| `#/list-item`    | `ListItemView`   | Form for community members to list an item with deposit details, condition photos, and status.                            |
| `#/dashboard`    | `DashboardView`  | Dual-role "My Activity" hub managing borrowed items, listings, pending actions, handovers, and deposits.                  |
| `#/register`     | `RegisterView`   | Member sign-up and trust/safety verification profile form.                                                                |

### 2.2 User Flows

- **Borrower Flow:** `#/catalog` $\rightarrow$ Select Item $\rightarrow$ `#/item/:id` $\rightarrow$ Select valid dates $\rightarrow$ Submit Borrow Request $\rightarrow$ View in `#/dashboard` under "My Borrowed Items" (Status: `Pending Approval`, Deposit: `Not Held`).
  - _Scenario A (Borrower Cancels Pre-Approval):_ Click "Cancel Request" $\rightarrow$ Status: `Cancelled`, Deposit: `Not Held`, dates freed.
  - _Scenario B (Approved, Pre-Handover):_ Owner approves request $\rightarrow$ Status: `Active`, Deposit: `Held`, `handedOverAt: null`. Borrower may still cancel if before start date $\rightarrow$ Status: `Cancelled`, Deposit: `Not Held`, dates freed.
  - _Scenario C (Handover & Return):_ Owner confirms handover $\rightarrow$ `handedOverAt` recorded. Cancellation button disabled/hidden. When finished using item, borrower clicks "Mark Returned" $\rightarrow$ Status: `Returned`, Deposit: `Held`, `returnedAt` recorded $\rightarrow$ Awaits Owner Inspection.
- **Owner Flow:**
  - Receive request in `#/dashboard` under "My Listings" / "Pending Actions" $\rightarrow$ Click "Approve Request" (Status: `Active`, Deposit: `Held`, `handedOverAt: null`) or "Reject Request" (Status: `Rejected`, Deposit: `Not Held`).
  - On meetup day: Owner clicks "Confirm Physical Handover" $\rightarrow$ Handover modal opens $\rightarrow$ Owner records baseline `preHandoverNotes` and optional condition photos $\rightarrow$ Submits $\rightarrow$ `handedOverAt` set to timestamp.
  - Receive return notification $\rightarrow$ Inspect condition $\rightarrow$ Click "Approve Return & Release Deposit" (Status: `Completed`, Deposit: `Refunded`, sets `inspectedAt`, dates freed) OR "Report Issue" (Status: `Disputed`, Deposit: `Under Review`, sets `inspectedAt`, records `issueDescription` and `issueImages`).
- **Demo User Switching Flow:** The navbar profile dropdown lets the user switch between sample users (Sarah vs. Alex) to test approvals, handovers, cancellations, and returns end-to-end within the same browser.

---

## 3. UI/UX Direction & Responsive Design

### 3.1 Design Principles & Aesthetics

- **Warm & Trustworthy:** Friendly, community-oriented color palette (warm forest greens, earthy accents, clean neutral backgrounds, high-contrast readable text).
- **Accessible & Clean:** High contrast ratios (WCAG AA compliant), clear typographic hierarchy, recognizable status pills for request, handover, and deposit states.
- **Mobile-First Responsive Layout:**
  - Base CSS authored for single-column mobile viewport (320px–640px).
  - Progressive enhancement via `min-width` media queries (Tablet $\ge 768px$, Desktop $\ge 1024px$).
  - Zero framework dependencies; pure CSS custom properties (variables) for theme consistency.

### 3.2 Visual & Structural Layout

- **Header (Navbar):** Brand logo, primary navigation links with active route highlighting, quick-access "My Activity" badge count, and a profile dropdown that holds the demo persona switcher (shows the active persona and role).
- **Main Shell:** Dynamic `<main id="main-content">` where routed views render.
- **Footer:** Semantic footer with community guidelines, trust & safety disclaimer, and accessible navigation links.

---

## 4. Component & Module Architecture

### 4.1 Directory Structure

Files marked _(planned)_ do not exist yet.

```text
src/
├── assets/                  # Local images and icons (no external image hosts)
├── components/              # Reusable UI: functions returning HTML strings + bindX() event helpers
│   ├── Navbar.js            # Brand, nav links, profile dropdown with demo persona switcher
│   ├── Carousel.js          # Home hero carousel
│   ├── ItemCard.js
│   ├── Footer.js            # (planned)
│   ├── FilterBar.js         # (planned)
│   ├── StatusBadge.js       # (planned) request, deposit, handover, availability pills
│   ├── DatePicker.js        # (planned) date selection with overlap indication
│   ├── HandoverModal.js     # (planned)
│   ├── DisputeModal.js      # (planned)
│   └── Modal.js             # (planned) generic accessible modal base
├── logic/                   # (planned) pure functions: no DOM, no localStorage; tested with node:test
│   ├── html.js              # escapeHtml, isSafeImageUrl
│   ├── catalogFilter.js     # URL params parsing and item filtering
│   └── availability.js      # derived item status, date overlap
├── i18n/                    # (planned, §10) interface text in English and Arabic
│   ├── en.js                # English dictionary: key → text
│   ├── ar.js                # Arabic dictionary: same keys
│   └── i18n.js              # t, getLang, setLang, formatMoney
├── store/                   # Data & localStorage persistence
│   ├── seedData.js          # Seed items
│   ├── demoUsers.js         # Demo personas
│   ├── userStore.js         # Active persona
│   ├── storage.js           # (planned) safe localStorage wrapper with fallback
│   ├── itemStore.js         # (planned)
│   ├── requestStore.js      # (planned)
│   └── expiration.js        # (planned) lazy 48h expiration sweep
├── views/                   # One module per route; mountXView(container, ...) returns cleanup
│   ├── HomeView.js
│   ├── CatalogView.js       # (planned)
│   ├── ItemDetailView.js    # (planned)
│   ├── ListItemView.js      # (planned)
│   ├── DashboardView.js     # (planned)
│   └── RegisterView.js      # (planned)
├── style.css                # All styles, mobile-first, in commented sections
└── main.js                  # App shell and inline hash router
tests/                       # (planned) node:test files for src/logic
```

### 4.2 Module Contracts & Expiration Sweeper

- **Lazy Expiration Sweeper (`expiration.js`):**
  - Runs synchronously when the store initializes and whenever requests are queried or viewed.
  - Formula: For each request with `status === 'Pending Approval'`: if `(CurrentTime - new Date(createdAt).getTime()) > 48 * 60 * 60 * 1000`, update `status = 'Expired'`, `depositStatus = 'Not Held'`, `expiredAt = CurrentISOString()`.
  - Guarantees stale requests are cleaned up and dates released even without server cron jobs or background daemons.

---

## 5. Data Models & Application State

### 5.1 User Model (Demo Personas)

```javascript
{
  id: "user-1",
  name: "Sarah Jenkins",
  role: "Owner",               // Demo label: "Owner" | "Borrower" | "New Member"
  email: "sarah.jenkins@example.com",
  avatarInitial: "S",          // Shown in the avatar circle (no avatar images)
  isVerified: true,            // Simulated identity verification badge
  trustScore: 4.9,
  completedBorrowsCount: 14
}
```

### 5.2 Item Model & Availability States

```javascript
{
  id: "item-101",
  title: "Bosch Professional Hammer Drill",
  category: "Power Tools",      // Power Tools | Hand Tools | Gardening | Cleaning | Camping | Outdoor Equipment
  description: "850W corded hammer drill with chuck key and depth gauge.",
  condition: "Excellent",       // Like New | Excellent | Good | Fair
  conditionNotes: "Minor surface scuff on carry case. Motor and chuck in perfect order.",
  conditionImages: [drillImg],  // Local imported asset; user-entered URLs must pass §8.3
  depositAmount: 45.00,         // Simulated refundable deposit in USD
  ownerId: "user-1",
  ownerName: "Sarah Jenkins",
  ownerVerified: true,
  ownerRating: 4.9,
  isManuallyPaused: false,      // If true by owner -> "Unavailable"
  imageUrl: drillImg,           // Local imported asset
  createdAt: "2026-10-15T09:00:00Z"
}
```

Item `status` is **not stored**. It is always calculated from `isManuallyPaused` and the item's requests using the rules below, so it can never go stale.

#### Derived Availability Rules (checked in this order):

- **`Unavailable`:** `isManuallyPaused === true` OR the item has any request with status `Disputed`. A dispute keeps the item Unavailable until the owner clears it (MVP: by unpausing after resolution outside the app).
- **`Reserved`:** An `Active` request covers today's date (`startDate <= today <= endDate`). `Pending Approval` requests do **not** make an item Reserved; they only block their dates in the date picker (§6.2).
- **`Available`:** Otherwise.

### 5.3 Borrow Request Model

```javascript
{
  id: "req-501",
  itemId: "item-101",
  itemTitle: "Bosch Professional Hammer Drill",
  borrowerId: "user-2",
  borrowerName: "Alex Mercer",
  ownerId: "user-1",
  startDate: "2026-11-01",
  endDate: "2026-11-04",
  depositAmount: 45.00,

  // Status definitions
  // Request Status: "Pending Approval" | "Active" | "Rejected" | "Expired" | "Cancelled" | "Returned" | "Completed" | "Disputed"
  status: "Pending Approval",
  // Deposit Status: "Not Held" | "Held" | "Refunded" | "Under Review"
  depositStatus: "Not Held",

  // Timestamps
  createdAt: "2026-10-30T10:00:00Z",
  approvedAt: null,             // Set when owner approves request
  rejectedAt: null,             // Set when owner rejects request
  expiredAt: null,              // Set when 48h passes without owner response
  handedOverAt: null,           // Nullable. Set when owner confirms physical handover.
  cancelledAt: null,            // Set when borrower cancels request
  returnedAt: null,             // Set when borrower or owner marks item returned
  inspectedAt: null,            // Set when owner completes inspection (approval or dispute)

  // Condition & Handover Records
  preHandoverNotes: "",         // Logged during physical handover confirmation
  preHandoverImages: [],        // Photos captured during physical handover
  postReturnNotes: "",          // Notes logged during return/inspection
  cancellationReason: null,     // Optional note if cancelled post-approval

  // Dispute Data (Populated only if owner reports an issue)
  issueDescription: null,       // Description of damage or missing parts
  issueImages: []               // Photos submitted by owner during dispute
}
```

---

## 6. Borrowing Lifecycle, Availability & State Transitions

### 6.1 Comprehensive State Machine

```
                           Borrower submits request
                                       |
                                       v
                       [Status: Pending Approval]
                       [Deposit: Not Held       ]
                       [handedOverAt: null      ]
                                       |
           +---------------------------+---------------------------+---------------------------+
           | (Owner Approves)          | (Owner Rejects)           | (>48h Inaction)           | (Borrower Cancels)
           v                           v                           v                           v
  [Status: Active     ]       [Status: Rejected   ]       [Status: Expired    ]       [Status: Cancelled  ]
  [Deposit: Held      ]       [Deposit: Not Held  ]       [Deposit: Not Held  ]       [Deposit: Not Held  ]
  [handedOverAt: null ]       (Dates freed)               (Dates freed)               (Dates freed)
  (Dates locked)
           |
     +-----+---------------------------------------+
     | (Cancel: handedOverAt === null              | (Owner Confirms Physical Handover)
     |  AND today < startDate)                     | Captures preHandoverNotes & photos
     v                                             v
  [Status: Cancelled  ]                 [Status: Active     ]
  [Deposit: Not Held  ]                 [Deposit: Held      ]
  (Dates freed)                         [handedOverAt: <ts> ]
                                        (Cancellation strictly locked)
                                                   |
                                   (Borrower or owner marks returned)
                                                   |
                                                   v
                                        [Status: Returned   ]
                                        [Deposit: Held      ]
                                        [returnedAt: <ts>   ]
                                                   |
                                        (Owner inspects returned item)
                                                   |
                             +---------------------+---------------------+
                             | (Owner Approves)                          | (Owner Reports Issue)
                             v                                           v
                   [Status: Completed        ]                 [Status: Disputed            ]
                   [Deposit: Refunded        ]                 [Deposit: Under Review       ]
                   [inspectedAt: <ts>        ]                 [inspectedAt: <ts>           ]
                   (Item relisted            )                 (Item Unavailable; final state)
```

`Disputed` is a final state in the MVP. Dispute resolution is out of scope.

### 6.2 Availability & Date Overlap Management

- An item is locked for dates `[StartA, EndA]` if there exists any request for that item where:
  - `status === 'Active'` OR `status === 'Pending Approval'`
  - AND date intervals overlap: `(StartA <= ExistingEnd) && (EndA >= ExistingStart)`.
- Only `Active` and `Pending Approval` requests lock dates. Every other status (`Rejected`, `Expired`, `Cancelled`, `Returned`, `Completed`, `Disputed`) does not, so the interval is released as soon as a request leaves those two states. A `Disputed` request makes the whole item `Unavailable` instead (§5.2).
- A borrower may hold at most one `Pending Approval` request per item.
- Non-overlapping bookings remain valid. For example, if an item is reserved for Nov 1–4, a request for Nov 10–12 can be submitted and approved without conflict.

### 6.3 Dispute Handling Simulation

- When the owner selects "Report Issue", an accessible modal prompts for the damage/missing description and optional image URLs (validated by the §8.3 image URL rule).
- The request transitions to `status: 'Disputed'` and `depositStatus: 'Under Review'`.
- `inspectedAt`, `issueDescription`, and `issueImages` are populated.
- In the MVP, this status is clearly surfaced in both Borrower and Owner dashboards with an informational banner: _"Issue recorded under review by community trust desk. Deposit is held safely pending verification."_ No fake payment deductions are executed.

---

## 7. Demo Persona Management (Simulation Protocol)

To allow comprehensive testing of the dual-role workflows without requiring a complex authentication server or incognito windows:

1. **User Switcher:** Located in the navbar profile dropdown.
2. **Pre-configured Demo Personas:**
   - **Sarah Jenkins (Owner):** Owns power tools and gardening equipment. Receives incoming requests, confirms physical handovers, and inspects returns.
   - **Alex Mercer (Borrower):** Frequent DIYer looking to borrow tools for weekend projects. Submits requests, can cancel before the cancel deadline and prior to handover, and marks returns.
   - **Elena Rostova (New Member):** Unverified account with zero borrow history for testing verification and empty dashboard states.
3. **State Reactivity:** Changing the demo user updates the active context across all views, instantly toggling between owner approval/handover actions and borrower return/cancellation actions.

---

## 8. Error Handling, Validation & Accessibility (A11y)

### 8.1 Form Validation & Error Handling

- Native HTML5 validation attributes (`required`, `minlength`, `type="date"`, `min="<today>"`, `type="number"`, `step="1"`).
- Date validation: End date cannot precede start date; date span cannot collide with an existing `Active` or `Pending Approval` booking.
- Cancellation guard: Application validates `handedOverAt === null` and `today < startDate` (local `YYYY-MM-DD` dates) before permitting cancellation on approved requests.
- Request guard: blocks requests by the item's owner and a second `Pending Approval` request by the same borrower for the same item.
- Explicit `<label for="...">` associations for all form inputs.
- Safe parsing and error boundary in `storage.js` with fallback to default seed data if local storage is cleared or invalid.

### 8.2 Accessibility Compliance

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Proper heading hierarchy (`<h1>` to `<h3>`) maintained per view.
- Contrast compliant with WCAG 2.1 AA across all badges and interactive controls.
- Keyboard accessible modal dialogs and tab controls (`aria-selected`, `aria-controls`, `role="tab"`).
- Focus management on route change (`#main-content` focused automatically to support screen readers).

### 8.3 Security

- URL parameters, `localStorage` data, and form input are untrusted.
- Untrusted text is never inserted into `innerHTML` unescaped: use `textContent` for single values and `escapeHtml()` inside HTML templates (text and attributes).
- URL parameters are validated against allowlists: `category` must be one of the six categories, `status` one of the three availability states, `q` is trimmed and limited to 100 characters, and item IDs must match `/^item-\d{1,6}$/` (otherwise the 404 view is shown).
- **Image URL rule:** only relative URLs and `https:` URLs are accepted (`isSafeImageUrl`); anything else falls back to a local placeholder image.

---

## 9. Verification & Testing Strategy

1. **Static Analysis & Formatting:**
   - ESLint: zero warnings or errors.
   - Prettier: strict compliance on code formatting.
2. **Unit Tests:**
   - `npm test` runs Node's built-in test runner (`node --test`) on `tests/`. No test packages are installed.
   - Covers the pure functions in `src/logic/` and string-returning components that have no imports (e.g., `ItemCard.js`), including security regression cases from §8.3.
3. **Functional Test Scenarios:**
   - **Scenario 1 (Request & Approval):** Borrower Alex requests drill for Nov 1–4 $\rightarrow$ Status: `Pending Approval`, Deposit: `Not Held`, `handedOverAt: null` $\rightarrow$ Switch to Owner Sarah $\rightarrow$ Approve $\rightarrow$ Status: `Active`, Deposit: `Held`, `handedOverAt: null`.
   - **Scenario 2 (Physical Handover Confirmation):** Owner Sarah clicks "Confirm Handover" on active booking $\rightarrow$ Enters pre-handover notes $\rightarrow$ Submits $\rightarrow$ `handedOverAt` timestamp recorded. Switch to Borrower Alex $\rightarrow$ Verify "Cancel Request" button is now disabled/hidden.
   - **Scenario 3 (Post-Approval Pre-Handover Cancellation):** Owner approves request for future date (`handedOverAt` is `null`, date in future) $\rightarrow$ Borrower Alex cancels $\rightarrow$ Status: `Cancelled`, Deposit reverts to `Not Held`, dates freed.
   - **Scenario 4 (48h Expiration Check):** Simulate request created with timestamp older than 48h $\rightarrow$ Page load triggers lazy sweeper $\rightarrow$ Status automatically transitions to `Expired`, Deposit remains `Not Held`, dates freed.
   - **Scenario 5 (Pre-Approval Cancellation):** Borrower Alex submits request $\rightarrow$ Cancels before owner action $\rightarrow$ Status: `Cancelled`, Deposit: `Not Held`, dates freed.
   - **Scenario 6 (Date Overlap Guard):** Try to request drill for overlapping period while Active $\rightarrow$ Form blocks submission with clear overlap warning.
   - **Scenario 7 (Return & Full Refund):** Switch to Borrower Alex $\rightarrow$ Mark Returned $\rightarrow$ Status: `Returned`, Deposit: `Held`, `returnedAt` recorded $\rightarrow$ Switch to Owner Sarah $\rightarrow$ Inspect & Approve $\rightarrow$ Status: `Completed`, Deposit: `Refunded`, `inspectedAt` recorded, dates freed.
   - **Scenario 8 (Return & Dispute):** Owner Sarah reports cracked housing during inspection $\rightarrow$ Enters notes and photo URL $\rightarrow$ Status: `Disputed`, Deposit: `Under Review`, `inspectedAt` recorded $\rightarrow$ Issue displayed in both dashboards.
   - **Scenario 9 (Rejection):** Owner Sarah rejects a request $\rightarrow$ Status: `Rejected`, Deposit: `Not Held`, dates immediately freed.
   - **Scenario 10 (Cancel Deadline):** An approved request starting tomorrow can be cancelled today; on the start date the Cancel button is hidden.
   - **Scenario 11 (Request Guards):** Sarah cannot request her own drill; Alex cannot submit a second pending request for the same item.
   - **Scenario 12 (URL Injection):** Opening `#/catalog?q=<img src=x onerror=alert(1)>` shows the text literally and runs no script.
4. **Build & Bundle Verification:**
   - Run `npm run build` to ensure clean asset bundling with zero syntax errors.
   - Run `npm run preview` to verify production preview server functionality.

---

## 10. Language Support: English and Arabic

Approved 2026-11-01. Applies to every page and component.

### 10.1 Language switching

- The default language is **English** (`en`). The only other language is **Arabic** (`ar`). These are the only valid values.
- The Header contains a language switch button:
  - English interface: the label is `العربية` and the button has `lang="ar"`.
  - Arabic interface: the label is `English` and the button has `lang="en"`.
  - The `lang` attribute makes screen readers pronounce the label in its own language.
- The choice is saved in `localStorage` under `borrowbox_lang`.
- Reading or writing storage can fail (blocked storage, private mode, quota). Any failure, missing value or value other than `en`/`ar` means English. A failed write still switches the language for the current visit.
- Switching languages updates the current page **without a full page reload**. It preserves:
  - the current route, including its query string
  - the active demo persona
  - values typed into form fields on the current page, and the scroll position
  - keyboard focus, which returns to the language switch button after the Header re-renders

### 10.2 Initialization without a language flash

A small inline script in `index.html` runs before the stylesheet and the app. It reads `borrowbox_lang` inside `try/catch` and sets the document root before anything is displayed:

| Stored value                         | Result                       |
| ------------------------------------ | ---------------------------- |
| `ar`                                 | `<html lang="ar" dir="rtl">` |
| `en`, missing, invalid or unreadable | `<html lang="en" dir="ltr">` |

The static markup keeps `<html lang="en" dir="ltr">`, so the page is correct even if the script fails.

### 10.3 Translation architecture

- `src/i18n/en.js` and `src/i18n/ar.js` each export one flat object of `key → string`, for example `"nav.explore": "Explore"`. Keys are grouped by area with a dot prefix (`nav.`, `home.`, `footer.`, `item.`, `booking.`, `category.`, `status.`, `condition.`, `role.`, `page.`, `title.`).
- `src/i18n/i18n.js` exposes:
  - `t(key, values)` returns the string for the current language. `{name}` placeholders are replaced from `values`. Lookup order: current language → English → the key itself. It never returns an empty string.
  - `getLang()` returns `"en"` or `"ar"`.
  - `setLang(lang)` accepts only `en`/`ar` (anything else becomes `en`). It saves the choice, sets `lang` and `dir` on `<html>`, and dispatches the `borrowbox:langchange` event.
  - `formatMoney(amount)` formats a deposit in US dollars with no decimals, using `Intl.NumberFormat` with `numberingSystem: "latn"`, so digits are always Western (`0–9`) in both languages. Non-numeric input formats as 0.
- Both dictionaries have exactly the same keys, and no Arabic value is empty. Automated tests enforce this.
- All interface text, including `aria-label` values, `document.title`, placeholders and validation messages, comes from `t()`. No interface string is written directly in a component.
- **Safe insertion:** translated text is plain text. It is inserted with `textContent` where the element is created in script, and with `escapeHtml(t(...))` inside HTML string templates, the project's existing component pattern (§4.1, §8.3). Values interpolated into translations (user names, item titles) are escaped too. Translations never contain HTML.

### 10.4 What is translated

| Text                                                                                  | Translated?  | Rule                                                                                                                                                   |
| ------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Interface text (navigation, headings, buttons, labels, messages, footer, page titles) | Yes          | From the dictionaries                                                                                                                                  |
| Category names                                                                        | Display only | Data and URLs keep the English name (`?category=Power%20Tools`). The display text comes from `t("category.Power Tools")`, for example `أدوات كهربائية` |
| Availability status, condition level, persona role                                    | Display only | Fixed lists in the data model (§5), so they are interface vocabulary. Stored values stay English                                                       |
| Item title, description, condition notes, owner name                                  | No           | Written by users; shown exactly as stored                                                                                                              |

### 10.5 Right-to-left layout

- Under `dir="rtl"` the whole interface mirrors: navigation order, columns, alignment, form layout and the booking panel.
- CSS uses logical properties (`margin-inline-*`, `padding-inline-*`, `inset-inline-*`, `text-align: start`) for anything that depends on reading direction. Symmetric pairs (`left: 0; right: 0`) may stay.
- Directional arrows (back, "see how it works", list-link arrows) flip in RTL. Non-directional icons (Play, Pause, search, check marks, the logo) do not.

### 10.6 Arabic typography

- In Arabic, headings and body text use **Tajawal** (Space Grotesk and DM Sans have no Arabic letters). English keeps Space Grotesk and DM Sans unchanged.
- Arabic text has no negative `letter-spacing` and no `text-transform: uppercase`, because both break letter joining or have no meaning in Arabic.
- Tajawal is loaded at 400, 500 and 700. Arabic text that would use weight 600 uses 700.

### 10.7 Re-rendering on language change

On `borrowbox:langchange`, `main.js`:

1. records form field values in the current view (by element `id`) and the scroll position
2. re-renders the Header (`renderNavbar`) and Footer (`renderFooter`)
3. re-runs `handleRoute()`, which calls the current view's cleanup and mounts it again
4. restores field values, scroll position and focus on the language button

The hash is not changed, so no `hashchange` fires and the route is untouched. The persona is read from `userStore` as before. The Hero slideshow's paused state is kept across the re-render.

### 10.8 Verification

Automated tests (`npm test`) and the browser checks are listed in `docs/superpowers/plans/2026-11-01-arabic-english-i18n.md`. Both must pass before the feature is complete.
