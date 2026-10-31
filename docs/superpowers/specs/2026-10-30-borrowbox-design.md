# BorrowBox System Architecture & Design Specification (MVP)

**Document Version:** 1.3.0  
**Date:** 2026-10-30  
**Status:** Under Review (Awaiting User Approval)

---

## 1. Product Overview & MVP Requirements

### 1.1 Mission & Value Proposition

BorrowBox is a community-driven, peer-to-peer (P2P) web platform that connects neighbors to share, lend, and borrow household tools and equipment. Instead of purchasing costly, infrequently used items (e.g., power drills, pressure washers, camping equipment), community members can borrow them for free, backed by a simulated refundable security deposit.

### 1.2 Core MVP Scope

1. **Catalog & Discovery:** Filter and search items by category, keyword, and availability status (`Available`, `Reserved`, `Unavailable`). Display detailed item cards with security deposit, condition notes, verified owner badge, and date-aware availability.
2. **Borrowing Request Workflow (Owner Approval First):**
   - Borrower submits borrow request with start and end dates.
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
   - **Post-Approval (Pre-Handover):** Cancellation is strictly permitted **only when `handedOverAt === null` AND the scheduled borrowing start date has not passed**. Status becomes `Cancelled`, deposit reverts to `Not Held`, owner is notified via a dashboard alert badge, and dates are freed.
   - **Post-Handover (`handedOverAt !== null`):** Cancellation is strictly prohibited. The loan is legally/physically in progress; the borrower must use the return workflow, and the owner must use the inspection/dispute workflow.
5. **Owner Inspection & Return Workflow:**
   - Borrower marks item returned (status transitions to `Returned`, deposit remains `Held`, sets `returnedAt`).
   - Owner inspects item condition and records `postReturnNotes`.
   - Owner approves return (status transitions to `Completed`, deposit status becomes `Refunded`, sets `inspectedAt`, item availability restored) OR reports an issue (status transitions to `Disputed`, deposit status becomes `Under Review`, sets `inspectedAt`, `issueDescription`, and `issueImages`).
6. **Unified "My Activity" Dashboard:**
   - Tabs for "My Borrowed Items" and "My Listings".
   - Status indicators for active loans, pending approvals, and deposits (`Not Held`, `Held`, `Refunded`, `Under Review`).
   - Actionable triggers:
     - Owners: Approve/Reject requests, Confirm Handover (capturing condition notes), Inspect & Approve returns, Report issues.
     - Borrowers: Cancel request (pre-handover only), Mark returned.
7. **Item Listing & Registration:**
   - Semantic form to list tools (title, category, condition, condition notes, condition photos/URLs, deposit amount, description, manual listing status).
   - Member registration/profile with native HTML5 validation and verification badge simulation.
8. **Persistence & Demo Persona Switcher:**
   - Client-side storage (`localStorage`) initialized with realistic seed mock data for immediate evaluation.
   - Top utility bar persona switcher (`Sarah Jenkins - Owner`, `Alex Mercer - Borrower`, `Elena Rostova - New Member`) to allow full testing of both roles in a single browser session.
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
- **Demo User Switching Flow:** Top utility bar lets the user switch between sample users (Sarah vs. Alex) to test approvals, handovers, cancellations, and returns end-to-end within the same browser.

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

- **Top Utility Bar:** Demo persona selector ("Current Demo User: [Sarah Jenkins ▾]"), displaying active role, unread pending action badges, and quick switch.
- **Header:** Brand logo, primary navigation links with active route highlighting, and quick-access "My Activity" badge count.
- **Main Shell:** Dynamic `<main id="main-content">` where routed views render.
- **Footer:** Semantic footer with community guidelines, trust & safety disclaimer, and accessible navigation links.

---

## 4. Component & Module Architecture

### 4.1 Directory Structure

```text
src/
├── assets/                  # Icons and images
├── components/              # Reusable UI templates (pure functions returning HTML string + event binding)
│   ├── Header.js
│   ├── Footer.js
│   ├── UserSwitcher.js      # Demo persona switcher component
│   ├── ItemCard.js
│   ├── StatusBadge.js       # Visual pills for request, deposit, handover, and availability states
│   ├── DatePicker.js        # Date selection with overlap indication
│   ├── HandoverModal.js     # Modal for confirming physical handover and pre-handover notes
│   ├── DisputeModal.js      # Modal for reporting damage/missing items with descriptions
│   └── Modal.js             # Generic accessible modal base
├── store/                   # State management & LocalStorage persistence
│   ├── storage.js           # Low-level localStorage wrapper with fallback
│   ├── seedData.js          # Default initial items, users, and activity records
│   ├── store.js             # Centralized store (items, requests, active demo user)
│   └── expiration.js        # Lazy evaluation logic for 48h expiration sweeps
├── views/                   # Route-level view controllers
│   ├── HomeView.js
│   ├── CatalogView.js
│   ├── ItemDetailView.js
│   ├── ListItemView.js
│   ├── DashboardView.js
│   └── RegisterView.js
├── router/                  # Hash-based lightweight client router
│   └── router.js
├── styles/                  # Mobile-first modular CSS
│   ├── reset.css
│   ├── variables.css        # Colors, spacing, typography tokens
│   ├── layout.css           # Grid, containers, navigation
│   ├── components.css       # Cards, badges, buttons, forms, user-switcher, modals
│   └── views.css            # Route-specific layout adjustments
└── main.js                  # Application bootstrapper
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
  email: "sarah.jenkins@example.com",
  isVerified: true,            // Simulated identity verification badge
  trustScore: 4.9,
  completedBorrowsCount: 14,
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
}
```

### 5.2 Item Model & Availability States

```javascript
{
  id: "item-101",
  title: "Bosch Professional Hammer Drill",
  category: "Power Tools",      // Power Tools | Gardening | Cleaning | Camping | Hand Tools
  description: "850W corded hammer drill with chuck key and depth gauge.",
  condition: "Excellent",       // Like New | Excellent | Good | Fair
  conditionNotes: "Minor surface scuff on carry case. Motor and chuck in perfect order.",
  conditionImages: [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
  ],
  depositAmount: 45.00,         // Simulated refundable deposit in USD
  ownerId: "user-1",
  ownerName: "Sarah Jenkins",
  ownerVerified: true,
  ownerRating: 4.9,
  status: "Available",          // "Available" | "Reserved" | "Unavailable" (derived/manual)
  isManuallyPaused: false,      // If true by owner -> forced "Unavailable"
  imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
  createdAt: "2026-10-15T09:00:00Z"
}
```

#### Derived Availability Rules:

- **`Unavailable`:** If `isManuallyPaused === true` (owner paused listing) OR item is currently in `Disputed` state under damage review.
- **`Reserved`:** If there are active or approved bookings covering today's date, but future dates may be free.
- **`Available`:** If the item is active and has no booking covering today's date (and open for future dates).

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
  returnedAt: null,             // Set when borrower marks item returned
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
     | (Pre-Handover & Pre-Start Date Cancellation)| (Owner Confirms Physical Handover)
     | Condition: handedOverAt === null            | Captures preHandoverNotes & photos
     v                                             v
  [Status: Cancelled  ]                 [Status: Active     ]
  [Deposit: Not Held  ]                 [Deposit: Held      ]
  (Dates freed)                         [handedOverAt: <ts> ]
                                        (Cancellation strictly locked)
                                                   |
                                        (Borrower marks returned)
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
                   (Dates freed / Relisted   )                 (Dispute recorded / Displayed)
```

### 6.2 Availability & Date Overlap Management

- An item is locked for dates `[StartA, EndA]` if there exists any request for that item where:
  - `status === 'Active'` OR `status === 'Pending Approval'`
  - AND date intervals overlap: `(StartA <= ExistingEnd) && (EndA >= ExistingStart)`.
- When a request reaches `Rejected`, `Expired`, `Cancelled`, or `Completed`, its interval is immediately released.
- Non-overlapping bookings remain valid. For example, if an item is reserved for Nov 1–4, a request for Nov 10–12 can be submitted and approved without conflict.

### 6.3 Dispute Handling Simulation

- When the owner selects "Report Issue", an accessible modal prompts for the damage/missing description and optional image URLs.
- The request transitions to `status: 'Disputed'` and `depositStatus: 'Under Review'`.
- `inspectedAt`, `issueDescription`, and `issueImages` are populated.
- In the MVP, this status is clearly surfaced in both Borrower and Owner dashboards with an informational banner: _"Issue recorded under review by community trust desk. Deposit is held safely pending verification."_ No fake payment deductions are executed.

---

## 7. Demo Persona Management (Simulation Protocol)

To allow comprehensive testing of the dual-role workflows without requiring a complex authentication server or incognito windows:

1. **User Switcher:** Located in the top header utility bar.
2. **Pre-configured Demo Personas:**
   - **Sarah Jenkins (Owner):** Owns power tools and gardening equipment. Receives incoming requests, confirms physical handovers, and inspects returns.
   - **Alex Mercer (Borrower):** Frequent DIYer looking to borrow tools for weekend projects. Submits requests, can cancel strictly prior to handover, and marks returns.
   - **Elena Rostova (New Member):** Unverified account with zero borrow history for testing verification and empty dashboard states.
3. **State Reactivity:** Changing the demo user updates the active context across all views, instantly toggling between owner approval/handover actions and borrower return/cancellation actions.

---

## 8. Error Handling, Validation & Accessibility (A11y)

### 8.1 Form Validation & Error Handling

- Native HTML5 validation attributes (`required`, `minlength`, `type="date"`, `min="<today>"`, `type="number"`, `step="1"`).
- Date validation: End date cannot precede start date; date span cannot collide with an existing `Active` or `Pending Approval` booking.
- Cancellation guard: Application validates `handedOverAt === null` and `now < startDate` before permitting cancellation on approved requests.
- Explicit `<label for="...">` associations for all form inputs.
- Safe parsing and error boundary in `storage.js` with fallback to default seed data if local storage is cleared or invalid.

### 8.2 Accessibility Compliance

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Proper heading hierarchy (`<h1>` to `<h3>`) maintained per view.
- Contrast compliant with WCAG 2.1 AA across all badges and interactive controls.
- Keyboard accessible modal dialogs and tab controls (`aria-selected`, `aria-controls`, `role="tab"`).
- Focus management on route change (`#main-content` focused automatically to support screen readers).

---

## 9. Verification & Testing Strategy

1. **Static Analysis & Formatting:**
   - ESLint: zero warnings or errors.
   - Prettier: strict compliance on code formatting.
2. **Functional Test Scenarios:**
   - **Scenario 1 (Request & Approval):** Borrower Alex requests drill for Nov 1–4 $\rightarrow$ Status: `Pending Approval`, Deposit: `Not Held`, `handedOverAt: null` $\rightarrow$ Switch to Owner Sarah $\rightarrow$ Approve $\rightarrow$ Status: `Active`, Deposit: `Held`, `handedOverAt: null`.
   - **Scenario 2 (Physical Handover Confirmation):** Owner Sarah clicks "Confirm Handover" on active booking $\rightarrow$ Enters pre-handover notes $\rightarrow$ Submits $\rightarrow$ `handedOverAt` timestamp recorded. Switch to Borrower Alex $\rightarrow$ Verify "Cancel Request" button is now disabled/hidden.
   - **Scenario 3 (Post-Approval Pre-Handover Cancellation):** Owner approves request for future date (`handedOverAt` is `null`, date in future) $\rightarrow$ Borrower Alex cancels $\rightarrow$ Status: `Cancelled`, Deposit reverts to `Not Held`, dates freed.
   - **Scenario 4 (48h Expiration Check):** Simulate request created with timestamp older than 48h $\rightarrow$ Page load triggers lazy sweeper $\rightarrow$ Status automatically transitions to `Expired`, Deposit remains `Not Held`, dates freed.
   - **Scenario 5 (Pre-Approval Cancellation):** Borrower Alex submits request $\rightarrow$ Cancels before owner action $\rightarrow$ Status: `Cancelled`, Deposit: `Not Held`, dates freed.
   - **Scenario 6 (Date Overlap Guard):** Try to request drill for overlapping period while Active $\rightarrow$ Form blocks submission with clear overlap warning.
   - **Scenario 7 (Return & Full Refund):** Switch to Borrower Alex $\rightarrow$ Mark Returned $\rightarrow$ Status: `Returned`, Deposit: `Held`, `returnedAt` recorded $\rightarrow$ Switch to Owner Sarah $\rightarrow$ Inspect & Approve $\rightarrow$ Status: `Completed`, Deposit: `Refunded`, `inspectedAt` recorded, dates freed.
   - **Scenario 8 (Return & Dispute):** Owner Sarah reports cracked housing during inspection $\rightarrow$ Enters notes and photo URL $\rightarrow$ Status: `Disputed`, Deposit: `Under Review`, `inspectedAt` recorded $\rightarrow$ Issue displayed in both dashboards.
   - **Scenario 9 (Rejection):** Owner Sarah rejects a request $\rightarrow$ Status: `Rejected`, Deposit: `Not Held`, dates immediately freed.
3. **Build & Bundle Verification:**
   - Run `npm run build` to ensure clean asset bundling with zero syntax errors.
   - Run `npm run preview` to verify production preview server functionality.
