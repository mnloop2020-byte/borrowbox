import type { MouseEvent, ReactElement, ReactNode } from "react";
import { scrollToSection } from "../browser/scrollToSection.ts";

interface ScrollLinkProps {
  /** The id of a section on the home page, e.g. "how-it-works" */
  targetId: string;
  className: string;
  children: ReactNode;
  /** Runs first, e.g. to close the mobile menu */
  onClick?: () => void;
}

/**
 * A link to a section of the home page ("How it works"). A plain
 * "#how-it-works" link cannot work, because the router reads the hash
 * ("#/catalog"), so this link scrolls with JavaScript instead.
 * From another page it goes home first, then scrolls.
 */
export function ScrollLink({
  targetId,
  className,
  children,
  onClick,
}: ScrollLinkProps): ReactElement {
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    onClick?.();

    const isHome = ["", "#", "#/"].includes(window.location.hash);
    if (isHome) {
      scrollToSection(targetId);
      return;
    }
    // Added after the router's listener (App.tsx), so it runs after home is
    // drawn. setTimeout (not requestAnimationFrame) never waits for a paint.
    window.addEventListener(
      "hashchange",
      () => setTimeout(() => scrollToSection(targetId), 0),
      { once: true },
    );
    window.location.assign("#/");
  }

  return (
    <a href="#/" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
