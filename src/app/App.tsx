import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { flushSync } from "react-dom";
import { Footer } from "./Footer.tsx";
import { LegacyView } from "./LegacyView.tsx";
import { renderNavbar, updateActiveNavLink } from "./Navbar.ts";
import { NotFoundView } from "./NotFoundView.tsx";
import { isValidItemId } from "../features/items/itemId.ts";
import { CatalogView } from "../features/catalog/CatalogView.tsx";
import { DashboardView } from "../features/dashboard/DashboardView.tsx";
import { mountHomeView } from "../features/home/HomeView.ts";
import { ItemDetailView } from "../features/items/ItemDetailView.tsx";
import { ListItemView } from "../features/list-item/ListItemView.tsx";
import { RegisterView } from "../features/register/RegisterView.tsx";
import { restoreFields, snapshotFields } from "../shared/browser/formFields.ts";
import { scrollToSection } from "../shared/browser/scrollToSection.ts";

/*
 * App shell and hash router. It draws the page frame, picks the page for
 * the current hash and handles app-wide events. Each page lives in its
 * feature folder (src/features/<feature>/).
 */

/**
 * Picks the page for a hash. A page moved to React is a component;
 * an old one is a mountXView() function run by LegacyView.
 *
 * @param version - goes up on a language or persona change. An old page
 * gets it as its key, so it is mounted again. A React page is only drawn
 * again, so it keeps its state (for example the text typed in a field).
 */
function renderRoute(hash: string, version: number): ReactElement {
  if (hash === "#/" || hash === "" || hash === "#") {
    return <LegacyView key={version} mount={mountHomeView} />;
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
  // Goes up by one when the language or the persona changes,
  // so the header, the page and the footer are drawn again
  const [version, setVersion] = useState(0);

  const navRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Built again only when the hash or version changes, so an old page's
  // mount function stays the same and LegacyView does not mount it twice
  const page = useMemo(() => renderRoute(hash, version), [hash, version]);

  // The header (still the old function) depends on language and persona
  useLayoutEffect(() => {
    if (navRef.current) renderNavbar(navRef.current);
  }, [version]);

  useLayoutEffect(() => {
    if (navRef.current) updateActiveNavLink(navRef.current);
  }, [hash, version]);

  useEffect(() => {
    // After a route change, move focus to <main> so screen-reader and keyboard
    // users start at the new page's content. Not done on first load, where
    // the browser's normal starting point is correct. flushSync draws the new
    // page right away, so the focus and the scroll below find it.
    const onHashChange = (): void => {
      flushSync(() => setHash(currentHash()));
      mainRef.current?.focus();
    };

    // Demo persona switch: the header and the page show the new persona
    const onUserChange = (): void => setVersion((v) => v + 1);

    // Language switch: draw everything again in the new language without a
    // reload, keeping the route, persona, typed values, scroll and focus
    const onLangChange = (): void => {
      const main = mainRef.current;
      if (!main) return;
      const fields = snapshotFields(main);
      const scrollY = window.scrollY;

      flushSync(() => setVersion((v) => v + 1));

      restoreFields(main, fields);
      // Focus first without scrolling, then put the page back where it was
      navRef.current
        ?.querySelector<HTMLButtonElement>(".lang-switch")
        ?.focus({ preventScroll: true });
      window.scrollTo(0, scrollY);
    };

    // "How it works" style links: scroll to a section on the home page.
    // From another route, go home first, then scroll once home is drawn.
    const onClick = (event: MouseEvent): void => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-scroll-target]")
          : null;
      if (!link) return;
      event.preventDefault();

      // Close the mobile menu if the link was inside it
      if (document.querySelector(".nav-menu.is-open")) {
        document.querySelector<HTMLButtonElement>(".nav-toggle-btn")?.click();
      }

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
    window.addEventListener("borrowbox:userchange", onUserChange);
    window.addEventListener("borrowbox:langchange", onLangChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("borrowbox:userchange", onUserChange);
      window.removeEventListener("borrowbox:langchange", onLangChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <div id="nav-mount" ref={navRef} />
      <main
        id="main-content"
        className="main-content"
        tabIndex={-1}
        ref={mainRef}
      >
        {page}
      </main>
      <Footer />
    </>
  );
}
