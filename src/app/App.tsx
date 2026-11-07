import { Suspense, useEffect, useRef, useState } from "react";
import type { ComponentType, LazyExoticComponent, ReactElement } from "react";
import { flushSync } from "react-dom";
import { Footer } from "./Footer.tsx";
import { Navbar } from "./Navbar.tsx";
import { t } from "../shared/i18n/i18n.ts";
import { useLang } from "../shared/i18n/useLang.ts";
import { LoadingState } from "../shared/ui/LoadingState.tsx";
import { Toasts } from "../shared/ui/Toasts.tsx";
import { ErrorBoundary } from "../shared/ui/ErrorBoundary.tsx";
import { useRetryableLazy } from "./useRetryableLazy.ts";
import { matchRoute } from "./routeMatcher.ts";
import type { RouteMatch } from "./routeMatcher.ts";

interface RoutePages {
  HomeView: LazyExoticComponent<ComponentType>;
  CatalogView: LazyExoticComponent<ComponentType<{ queryString: string }>>;
  RegisterView: LazyExoticComponent<ComponentType>;
  ListItemView: LazyExoticComponent<ComponentType>;
  BorrowListView: LazyExoticComponent<ComponentType>;
  DashboardView: LazyExoticComponent<ComponentType>;
  ItemDetailView: LazyExoticComponent<ComponentType<{ itemId: string }>>;
  NotFoundView: LazyExoticComponent<ComponentType>;
}

const loadHomeView = () =>
  import("../features/home/HomeView.tsx").then((module) => ({
    default: module.HomeView,
  }));
const loadCatalogView = () =>
  import("../features/catalog/CatalogView.tsx").then((module) => ({
    default: module.CatalogView,
  }));
const loadRegisterView = () =>
  import("../features/register/RegisterView.tsx").then((module) => ({
    default: module.RegisterView,
  }));
const loadListItemView = () =>
  import("../features/list-item/ListItemView.tsx").then((module) => ({
    default: module.ListItemView,
  }));
const loadBorrowListView = () =>
  import("../features/borrow-list/BorrowListView.tsx").then((module) => ({
    default: module.BorrowListView,
  }));
const loadDashboardView = () =>
  import("../features/dashboard/DashboardView.tsx").then((module) => ({
    default: module.DashboardView,
  }));
const loadItemDetailView = () =>
  import("../features/cards/ItemDetailView.tsx").then((module) => ({
    default: module.ItemDetailView,
  }));
const loadNotFoundView = () =>
  import("./NotFoundView.tsx").then((module) => ({
    default: module.NotFoundView,
  }));

/*
 * App shell and hash router. It draws the page frame, picks the page for
 * the current hash and handles app-wide events. Each page lives in its
 * feature folder (src/features/<feature>/).
 */

/** Picks the page component for a hash. */
function renderRoute(route: RouteMatch, pages: RoutePages): ReactElement {
  switch (route.name) {
    case "home":
      return <pages.HomeView />;
    case "catalog":
      // key: a new URL is a new catalog, so the search box starts again
      return (
        <pages.CatalogView
          key={route.queryString}
          queryString={route.queryString}
        />
      );
    case "register":
      return <pages.RegisterView />;
    case "list-item":
      return <pages.ListItemView />;
    case "borrow-list":
      return <pages.BorrowListView />;
    case "dashboard":
      return <pages.DashboardView />;
    case "item":
      // key: another item is a new page, so the form starts empty
      return <pages.ItemDetailView key={route.itemId} itemId={route.itemId} />;
    case "not-found":
      return <pages.NotFoundView />;
  }
}

const currentHash = (): string => window.location.hash || "#/";

export function App(): ReactElement {
  const [hash, setHash] = useState(currentHash);
  const [retryCounts, setRetryCounts] = useState<
    Record<RouteMatch["name"], number>
  >({
    home: 0,
    catalog: 0,
    register: 0,
    "list-item": 0,
    "borrow-list": 0,
    dashboard: 0,
    item: 0,
    "not-found": 0,
  });
  // Every text comes from t(), which reads the current language. Reading
  // the language here makes App, and so every page inside it, draw again
  // after a switch. Nothing is rebuilt, so typed values, scroll and focus stay.
  useLang();

  const route = matchRoute(hash);
  const HomeView = useRetryableLazy(loadHomeView, retryCounts.home);
  const CatalogView = useRetryableLazy(loadCatalogView, retryCounts.catalog);
  const RegisterView = useRetryableLazy(loadRegisterView, retryCounts.register);
  const ListItemView = useRetryableLazy(
    loadListItemView,
    retryCounts["list-item"],
  );
  const BorrowListView = useRetryableLazy(
    loadBorrowListView,
    retryCounts["borrow-list"],
  );
  const DashboardView = useRetryableLazy(
    loadDashboardView,
    retryCounts.dashboard,
  );
  const ItemDetailView = useRetryableLazy(loadItemDetailView, retryCounts.item);
  const NotFoundView = useRetryableLazy(
    loadNotFoundView,
    retryCounts["not-found"],
  );

  const pages: RoutePages = {
    HomeView,
    CatalogView,
    RegisterView,
    ListItemView,
    BorrowListView,
    DashboardView,
    ItemDetailView,
    NotFoundView,
  };

  const retryPage = (): void => {
    setRetryCounts((counts) => ({
      ...counts,
      [route.name]: counts[route.name] + 1,
    }));
  };

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
        <ErrorBoundary
          key={hash}
          title={t("error.boundaryTitle")}
          text={t("error.boundaryText")}
          onRetry={retryPage}
        >
          <Suspense fallback={<LoadingState label={t("page.loading")} />}>
            {renderRoute(route, pages)}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toasts />
    </>
  );
}
