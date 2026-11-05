/**
 * True when the hash is this route or inside it,
 * e.g. "#/catalog?q=drill" keeps "Explore" active. Home matches no link.
 */
export function isCurrentRoute(hash: string, route: string): boolean {
  return (
    hash === route ||
    hash.startsWith(`${route}?`) ||
    hash.startsWith(`${route}/`)
  );
}
