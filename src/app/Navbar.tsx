import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { setLang, t } from "../shared/i18n/i18n.ts";
import { useLang } from "../shared/i18n/useLang.ts";
import { ScrollLink } from "../shared/ui/ScrollLink.tsx";
import {
  knownEntries,
  listCount,
} from "../features/borrow-list/borrowListRules.ts";
import { useBorrowList } from "../features/borrow-list/useBorrowList.ts";
import { useItems } from "../features/cards/useItems.ts";
import { useCurrentUser } from "../features/users/useCurrentUser.ts";
import { userStore } from "../features/users/userStore.ts";
import { isCurrentRoute } from "./isCurrentRoute.ts";
import { NavLink } from "./NavLink.tsx";

interface NavbarProps {
  /** The current route, e.g. "#/catalog?q=drill" */
  hash: string;
}

/**
 * The header on every page: logo, menu, "List an item", language switch,
 * demo persona switch and the mobile menu button.
 */
export function Navbar({ hash }: NavbarProps): ReactElement {
  const users = userStore.getUsers();
  const currentUser = useCurrentUser();
  const otherLang = useLang() === "ar" ? "en" : "ar";
  // Read from the stores, so the number changes after every add or remove.
  // Once the items arrive, count only rows whose item exists (like the list page).
  const borrowList = useBorrowList();
  const items = useItems();
  const listItemCount =
    items.status === "success"
      ? knownEntries(borrowList, items.items).length
      : listCount(borrowList);
  const onListPage = isCurrentRoute(hash, "#/borrow-list");

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // Once the page scrolls, the floating bar turns to frosted glass
  const [scrolled, setScrolled] = useState(false);

  // For the outside-click check and to give focus back on Escape
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While a menu is open: a click outside it or Escape closes it
  useEffect(() => {
    if (!menuOpen && !profileOpen) return;

    const onClick = (event: MouseEvent): void => {
      // event.target can be null or a non-Node (such as window)
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!profileRef.current?.contains(target)) setProfileOpen(false);
      const inMenu =
        menuRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target);
      if (!inMenu) setMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      // Give focus back to the button that opened the menu
      if (profileOpen) {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, profileOpen]);

  // Opening one menu closes the other
  function toggleMenu(): void {
    setMenuOpen(!menuOpen);
    setProfileOpen(false);
  }
  function toggleProfile(): void {
    setProfileOpen(!profileOpen);
    setMenuOpen(false);
  }
  const closeMenu = (): void => setMenuOpen(false);

  return (
    <header
      className={scrolled ? "app-header is-scrolled" : "app-header"}
      role="banner"
    >
      <a href="#main-content" className="skip-link">
        {t("nav.skip")}
      </a>
      <div className="nav-container">
        <a href="#/" className="nav-brand" aria-label={t("nav.homeLabel")}>
          <span className="brand-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 8 12 3 3 8v8l9 5 9-5z"></path>
              <path d="m3 8 9 5 9-5M12 13v8"></path>
            </svg>
          </span>
          <span className="brand-name">BorrowBox</span>
        </a>

        <nav
          ref={menuRef}
          id="primary-navigation"
          className={menuOpen ? "nav-menu is-open" : "nav-menu"}
          aria-label={t("nav.mainLabel")}
        >
          <ul className="nav-links-list">
            <li>
              <NavLink
                hash={hash}
                route="#/catalog"
                label={t("nav.explore")}
                onNavigate={closeMenu}
              />
            </li>
            <li>
              <ScrollLink
                targetId="how-it-works"
                className="nav-link"
                onClick={closeMenu}
              >
                {t("nav.howItWorks")}
              </ScrollLink>
            </li>
            <li>
              <NavLink
                hash={hash}
                route="#/dashboard"
                label={t("nav.myActivity")}
                onNavigate={closeMenu}
              />
            </li>
            {/* On small screens the orange button is hidden, so the link lives in the menu */}
            <li className="nav-mobile-only">
              <NavLink
                hash={hash}
                route="#/list-item"
                label={t("nav.listItem")}
                onNavigate={closeMenu}
              />
            </li>
          </ul>
        </nav>

        <a href="#/list-item" className="btn btn-primary nav-cta">
          {t("nav.listItem")}
        </a>

        <div className="nav-controls">
          {/* Name: "My list (3 items)". The text is hidden on phones, the icon and number stay */}
          <a
            href="#/borrow-list"
            className={onListPage ? "nav-list-link is-active" : "nav-list-link"}
            aria-current={onListPage ? "page" : undefined}
          >
            <svg
              className="nav-list-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="nav-list-text">{t("nav.myList")}</span>
            <span className="nav-list-count" aria-hidden="true">
              {listItemCount}
            </span>
            <span className="visually-hidden">
              {t("nav.listCount", { count: listItemCount })}
            </span>
          </a>
          {/* Labelled in the language it switches to, so lang is that language */}
          <button
            type="button"
            className="lang-switch"
            lang={otherLang}
            onClick={() => setLang(otherLang)}
          >
            {t("lang.switchTo")}
          </button>

          <div className="profile-menu-container" ref={profileRef}>
            <button
              ref={profileButtonRef}
              id="profile-menu-button"
              className="profile-button"
              type="button"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              aria-controls="profile-dropdown-panel"
              aria-label={t("nav.profileLabel", { name: currentUser.name })}
              onClick={toggleProfile}
            >
              <span className="profile-avatar" aria-hidden="true">
                {currentUser.avatarInitial}
              </span>
              <span className="profile-name">{currentUser.name}</span>
              <svg
                className="profile-dropdown-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div
              id="profile-dropdown-panel"
              className={
                profileOpen ? "profile-dropdown is-open" : "profile-dropdown"
              }
            >
              <div className="dropdown-header">{t("nav.switchPersona")}</div>
              <ul className="dropdown-persona-list">
                {users.map((user) => {
                  const selected = user.id === currentUser.id;
                  return (
                    <li key={user.id}>
                      <button
                        type="button"
                        className={
                          selected
                            ? "persona-item-btn is-selected"
                            : "persona-item-btn"
                        }
                        aria-current={selected}
                        onClick={() => {
                          userStore.setCurrentUser(user.id);
                          setProfileOpen(false);
                          // The list closes, so focus goes back to its button
                          profileButtonRef.current?.focus();
                        }}
                      >
                        <span>{user.name}</span>
                        <span className="persona-role-tag">
                          ({t(`role.${user.role}`)})
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button
            ref={menuButtonRef}
            id="mobile-nav-toggle"
            className="nav-toggle-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={t("nav.menuToggle")}
            onClick={toggleMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
