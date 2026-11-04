import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { flushSync } from "react-dom";
import { Footer } from "./Footer.tsx";
import { Navbar } from "./Navbar.tsx";
import { NotFoundView } from "./NotFoundView.tsx";
import { isValidItemId } from "../features/items/itemId.ts";
import { BorrowListView } from "../features/borrow-list/BorrowListView.tsx";
import { CatalogView } from "../features/catalog/CatalogView.tsx";
import { DashboardView } from "../features/dashboard/DashboardView.tsx";
import { HomeView } from "../features/home/HomeView.tsx";
import { ItemDetailView } from "../features/items/ItemDetailView.tsx";
import { ListItemView } from "../features/list-item/ListItemView.tsx";
import { RegisterView } from "../features/register/RegisterView.tsx";
import { useLang } from "../shared/i18n/useLang.ts";
import { Toasts } from "../shared/ui/Toasts.tsx";

/*
 * App shell and hash router. It draws the page frame, picks the page for
 * the current hash and handles app-wide events. Each page lives in its
 * feature folder (src/features/<feature>/).
 */

/** Picks the page component for a hash */
function renderRoute(hash: string): ReactElement {
  if (hash === "#/" || hash === "" || hash === "#") {
    return <HomeView />;
  }
  // Supports ?q= and ?category=
  if (hash.startsWith("#/catalog")) {
    const query = hash.split("?")[1] || "";
    // key: a new URL is a new catalog, so the search box starts again
    return <CatalogView key={query} queryString={query} />;
  }
  if (hash.startsWith("#/register")) {
    return <RegisterView />;
  }
  if (hash.startsWith("#/list-item")) {
    return <ListItemView />;
  }
  if (hash.startsWith("#/borrow-list")) {
    return <BorrowListView />;
  }
  if (hash.startsWith("#/dashboard")) {
    return <DashboardView />;
  }
  // An id that is not in the "item-123" format falls through to "not found"
  const itemId = hash.startsWith("#/item/")
    ? hash.replace("#/item/", "").split("?")[0]
    : "";
  if (isValidItemId(itemId)) {
    // key: another item is a new page, so the form starts empty
    return <ItemDetailView key={itemId} itemId={itemId} />;
  }
  return <NotFoundView />;
}

const currentHash = (): string => window.location.hash || "#/";

export function App(): ReactElement {
  const [hash, setHash] = useState(currentHash);
  // Every text comes from t(), which reads the current language. Reading
  // the language here makes App, and so every page inside it, draw again
  // after a switch. Nothing is rebuilt, so typed values, scroll and focus stay.
  useLang();

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // After a route change, move focus to <main> so screen-reader and keyboard
    // users start at the new page's content. Not done on first load, where
    // the browser's normal starting point is correct. flushSync draws the new
    // page right away, so the focus (and a ScrollLink's scroll) find it.
    const onHashChange = (): void => {
      flushSync(() => setHash(currentHash()));
      mainRef.current?.focus();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      {/* The sticky wrapper (style.css, #nav-mount) */}
      <div id="nav-mount">
        <Navbar hash={hash} />
      </div>
      <main
        id="main-content"
        className="main-content"
        tabIndex={-1}
        ref={mainRef}
      >
        {renderRoute(hash)}
      </main>
      <Footer />
      <Toasts />
    </>
  );
}
