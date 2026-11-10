"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * A link to a section of the home page ("How it works"). From another page
 * it is a normal link to "/#how-it-works". On the home page it scrolls
 * there itself and moves focus to the section heading, for keyboard and
 * screen-reader users.
 */
export function ScrollLink({
  targetId,
  className,
  children,
  onClick,
}: ScrollLinkProps): ReactElement {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.();
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToSection(targetId);
  }

  return (
    <Link href={`/#${targetId}`} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
