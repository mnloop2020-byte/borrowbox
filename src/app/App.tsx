import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { flushSync } from "react-dom";
import { Footer } from "./Footer.tsx";
import { Navbar } from "./Navbar.tsx";
import { NotFoundView } from "./NotFoundView.tsx";
import { isValidItemId } from "../features/items/itemId.ts";
import { CatalogView } from "../features/catalog/CatalogView.tsx";
import { DashboardView } from "../features/dashboard/DashboardView.tsx";
import { HomeView } from "../features/home/HomeView.tsx";
import { ItemDetailView } from "../features/items/ItemDetailView.tsx";
import { ListItemView } from "../features/list-item/ListItemView.tsx";
import { RegisterView } from "../features/register/RegisterView.tsx";
import { scrollToSection } from "../shared/browser/scrollToSection.ts";

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
  // The language and the persona live in their stores, not in React.
  // When one changes, this number goes up: new state makes React draw the
  // header, the page and the footer again, and each one reads the new value.
  // Only the setter is needed, so the number itself is not named.
  const [, setVersion] = useState(0);

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // After a route change, move focus to <main> so screen-reader and keyboard
    // users start at the new page's content. Not done on first load, where
    // the browser's normal starting point is correct. flushSync draws the new
    // page right away, so the focus and the scroll below find it.
    const onHashChange = (): void => {
      flushSync(() => setHash(currentHash()));
      mainRef.current?.focus();
    };

    // Language or persona switch: draw everything again with the new value.
    // Nothing is rebuilt, so the route, typed values, scroll and focus stay.
    const redraw = (): void => setVersion((v) => v + 1);

    // "How it works" style links: scroll to a section on the home page.
    // From another route, go home first, then scroll once home is drawn.
    const onClick = (event: MouseEvent): void => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-scroll-target]")
          : null;
      if (!link) return;
      event.preventDefault();

      const targetId = link.dataset.scrollTarget ?? "";
      const isHome = ["", "#", "#/"].includes(window.location.hash);
      if (isHome) {
        scrollToSection(targetId);
      } else {
        // Added after the router's listener, so it runs after home is drawn.
        // setTimeout (not requestAnimationFrame) so it never waits for a paint.
        window.addEventListener(
          "hashchange",
          () => setTimeout(() => scrollToSection(targetId), 0),
          { once: true },
        );
        window.location.hash = "#/";
      }
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("borrowbox:userchange", redraw);
    window.addEventListener("borrowbox:langchange", redraw);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("borrowbox:userchange", redraw);
      window.removeEventListener("borrowbox:langchange", redraw);
      document.removeEventListener("click", onClick);
    };
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
    </>
  );
}
