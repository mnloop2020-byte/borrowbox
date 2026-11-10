/**
 * True when the pathname is this route or inside it, e.g. "/items/item-103"
 * is inside "/items". The query (?q=drill) is not part of the pathname, so
 * "/catalog?q=drill" keeps "Explore" active. Home matches no link.
 */
export function isCurrentRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}
