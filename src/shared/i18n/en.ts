/**
 * English interface text.
 * Keys must match ar.ts exactly; tests/i18n.test.ts checks this.
 * Plain text only, no HTML. "{name}" style placeholders are filled by t().
 */
export default {
  // Language switch
  "lang.switchTo": "العربية",

  // Page titles
  "title.home": "BorrowBox — Peer-to-Peer Community Tool Sharing",
  "title.catalog": "Catalog — BorrowBox",
  "title.listItem": "List an Item — BorrowBox",
  "title.dashboard": "My Activity — BorrowBox",
  "title.notFound": "Page Not Found — BorrowBox",
  "title.register": "Create an account — BorrowBox",
  "title.itemNotFound": "Item Not Found — BorrowBox",
  "title.item": "{title} — BorrowBox",

  // Header
  "nav.skip": "Skip to main content",
  "nav.homeLabel": "BorrowBox home",
  "nav.mainLabel": "Main navigation",
  "nav.explore": "Explore",
  "nav.howItWorks": "How it works",
  "nav.myActivity": "My activity",
  "nav.listItem": "List an item",
  "nav.profileLabel": "Profile and demo persona switcher for {name}",
  "nav.switchPersona": "Switch demo persona",
  "nav.menuToggle": "Toggle navigation menu",

  // Persona roles (stored values stay English)
  "role.Owner": "Owner",
  "role.Borrower": "Borrower",
  "role.New Member": "New Member",

  // Categories (data and URLs keep the English names)
  "category.Power Tools": "Power Tools",
  "category.Hand Tools": "Hand Tools",
  "category.Gardening": "Gardening",
  "category.Cleaning": "Cleaning",
  "category.Camping": "Camping",
  "category.Outdoor Equipment": "Outdoor Equipment",

  // Availability status
  "status.Available": "Available",
  "status.Reserved": "Reserved",
  "status.Unavailable": "Unavailable",

  // Condition levels
  "condition.Like New": "Like New",
  "condition.Excellent": "Excellent",
  "condition.Good": "Good",
  "condition.Fair": "Fair",

  // Hero
  "home.hero.eyebrow": "Used tools, shared nearby",
  "home.hero.title": "Borrow what you need.",
  "home.hero.titleAccent": "Share what you have.",
  "home.hero.bullet1": "Quality used tools from people on your street",
  "home.hero.bullet2": "Every borrow protected by a refundable deposit",
  "home.hero.bullet3": "Use it for the job, then give it back",
  "home.hero.searchLabel": "Search tools and equipment",
  "home.hero.searchInputLabel": "Search equipment by keyword",
  "home.hero.searchPlaceholder": "Search drills, lawn mowers, tents…",
  "home.hero.searchButton": "Search",
  "home.hero.exploreAll": "Explore all items",

  // About
  "home.about.eyebrow": "About BorrowBox",
  "home.about.title": "Why buy a tool you'll use twice?",
  "home.about.text":
    "BorrowBox connects people who own used tools with neighbors who need them for a day or a weekend. Owners earn value from tools sitting idle, borrowers skip the cost and the clutter, and every handover is backed by a refundable deposit.",
  "home.about.link": "See how it works",

  // Category groups
  "home.categories.title": "Browse tools by category",
  "home.categories.viewAll": "View all items",
  "home.groups.tools.title": "Tools",
  "home.groups.tools.description":
    "Drills, saws, sanders and hand tools from neighbors who already own them. Pick up for a day, a weekend or a whole project.",
  "home.groups.tools.imageAlt":
    "A cordless drill, tape measure and hammer on a workbench",
  "home.groups.garden.title": "Garden and outdoors",
  "home.groups.garden.description":
    "Mowers, trimmers and camping gear for the weekend, without buying and storing them.",
  "home.groups.garden.imageAlt":
    "Camping chair, backpack and lantern on the grass",
  "home.groups.home.title": "Home and cleaning",
  "home.groups.home.description":
    "Cleaning machines and supplies for one-off jobs and seasonal deep cleans.",
  "home.groups.home.imageAlt":
    "A bucket of cleaning supplies with spray bottles and a brush",

  // Featured
  "home.featured.title": "Featured items in your area",
  "home.featured.viewAll": "View all",

  // How it works
  "home.how.title": "How BorrowBox works",
  "home.how.lead": "Four steps from “I need a drill” to a finished job.",
  "home.how.step1": "Find a tool nearby",
  "home.how.step2": "Book your dates",
  "home.how.step3": "Pick it up and use it",
  "home.how.step4": "Return it, get your deposit back",
  "home.how.imageAlt": "One neighbor handing a cordless drill to another",

  // Idle tools
  "home.idle.title": "Got tools sitting idle?",
  "home.idle.lead":
    "List a used tool in a few minutes and decide when it's available.",
  "home.idle.point1": "Add photos and describe its condition",
  "home.idle.point2": "Set your dates and the deposit amount",
  "home.idle.point3": "Approve requests from verified neighbors",
  "home.idle.imageAlt": "A tidy home garage with tools on a pegboard",

  // Why BorrowBox
  "home.why.title": "Why BorrowBox?",
  "home.why.item1.title": "Less waste",
  "home.why.item1.text":
    "Used tools get a second life instead of sitting in a garage.",
  "home.why.item2.title": "Refundable deposits",
  "home.why.item2.text":
    "A simulated deposit protects owners and comes back to you.",
  "home.why.item3.title": "Verified neighbors",
  "home.why.item3.text": "Members confirm their identity before borrowing.",
  "home.why.item4.title": "Ratings you can trust",
  "home.why.item4.text": "Both sides review each other after every exchange.",
  "home.why.item5.title": "Pickup nearby",
  "home.why.item5.text": "Find tools a few streets away, not across the city.",

  // Item card
  "card.ratingLabel": "Rating {rating} out of 5",
  "card.conditionLabel": "Condition:",
  "card.owner": "by {name}",
  "card.depositLabel": "Refundable deposit",
  "card.freeLoan": "Free loan",

  // Item detail page
  "item.back": "Back to catalog",
  "item.conditionHeading": "Condition: {condition}",
  "item.ownerHeading": "Owner",
  "item.verified": "✓ Verified",
  "item.rating": "★ {rating} rating",
  "item.notFoundTitle": "We couldn't find this item",
  "item.notFoundText": "It may have been removed, or the link may be wrong.",
  "item.browseCatalog": "Browse the catalog",

  // Booking panel
  "booking.depositHeading": "Refundable deposit",
  "booking.note":
    "Free to borrow. Your deposit comes back when the item is returned in good condition.",
  "booking.ownerNote": "This is your listing.",
  "booking.from": "From",
  "booking.to": "To",
  "booking.submit": "Request to borrow",
  "booking.error.missing-dates": "Choose a start date and an end date.",
  "booking.error.start-in-past": "Choose a start date from today onwards.",
  "booking.error.end-before-start":
    "Choose an end date on or after the start date.",
  "booking.error.duplicate-pending":
    "You already have a pending request for this item.",
  "booking.error.overlap":
    "These dates overlap an existing booking. Choose different dates.",
  "booking.error.save-failed":
    "Your request couldn't be saved. Check that your browser allows site storage, then try again.",
  "booking.success": "Request sent. The owner has 48 hours to respond.",
  "toast.requestFailed":
    "We couldn't send your request. Check your connection and try again.",

  // Placeholder pages
  "page.backHome": "Back to home",
  "page.catalog.title": "Explore catalog",
  "catalog.searchLabel": "Search the catalog",
  "catalog.searchInputLabel": "Search for a tool",
  "catalog.searchPlaceholder": "Search drills, ladders, tents…",
  "catalog.searchButton": "Search",
  "catalog.filtersLabel": "Filter by category",
  "catalog.all": "All",
  "catalog.count": "Showing {count} of {total} items",
  "catalog.emptyTitle": "No items match",
  "catalog.emptyText": "Try another word, or look in all categories.",
  "catalog.sortLabel": "Sort by",
  "catalog.sort.default": "Default",
  "catalog.sort.name": "Name (A–Z)",
  "catalog.sort.deposit-asc": "Deposit: low to high",
  "catalog.sort.deposit-desc": "Deposit: high to low",
  "catalog.clear": "Clear filters",
  "page.catalog.intro":
    "Discover power tools, garden gear and household equipment available in your community.",
  "page.listItem.title": "List an item for borrowing",
  "page.listItem.intro":
    "Share your equipment with trusted neighbors and set a refundable deposit.",
  "page.dashboard.title": "My activity",
  "page.dashboard.intro":
    "Manage borrowed tools and inspect item returns as {name} ({role}).",
  "page.notFound.title": "Page not found",
  "page.notFound.text": "We couldn't find the page you asked for.",

  // Registration: validates, confirms, creates no user
  "register.title": "Create your account",
  "register.intro": "Join your neighbors to borrow and share tools.",
  "register.name": "Full name",
  "register.email": "Email",
  "register.password": "Password",
  "register.passwordHint": "At least 8 characters",
  "register.agree": "I agree to the community guidelines",
  "register.submit": "Create account",
  "register.success":
    "Thanks, {name}. This is a demo, so no account was created.",
  "footer.register": "Create account",

  // Footer
  "footer.tagline": "Borrow what you need. Share what you have.",
  "footer.quickLinks": "Quick links",
  "footer.categories": "Categories",
  "footer.bottom": "© 2026 BorrowBox. Deposits are simulated.",
};
