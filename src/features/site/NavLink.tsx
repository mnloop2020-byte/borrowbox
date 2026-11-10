"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { isCurrentRoute } from "./isCurrentRoute.ts";

interface NavLinkProps {
  route: string;
  label: string;
  onNavigate: () => void;
}

/** A menu link that is marked as the current page when its route is open */
export function NavLink({
  route,
  label,
  onNavigate,
}: NavLinkProps): ReactElement {
  const current = isCurrentRoute(usePathname(), route);
  return (
    <Link
      href={route}
      className={current ? "nav-link is-active" : "nav-link"}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}
