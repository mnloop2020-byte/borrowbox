import type { ReactElement } from "react";
import { isCurrentRoute } from "./isCurrentRoute.ts";

interface NavLinkProps {
  hash: string;
  route: string;
  label: string;
  onNavigate: () => void;
}

/** A menu link that is marked as the current page when its route is open */
export function NavLink({
  hash,
  route,
  label,
  onNavigate,
}: NavLinkProps): ReactElement {
  const current = isCurrentRoute(hash, route);
  return (
    <a
      href={route}
      className={current ? "nav-link is-active" : "nav-link"}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      {label}
    </a>
  );
}
