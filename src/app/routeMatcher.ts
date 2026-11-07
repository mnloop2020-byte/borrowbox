import { isValidItemId } from "../features/cards/itemId.ts";

export type RouteMatch =
  | { name: "home" }
  | { name: "catalog"; queryString: string }
  | { name: "register" }
  | { name: "list-item" }
  | { name: "borrow-list" }
  | { name: "dashboard" }
  | { name: "item"; itemId: string }
  | { name: "not-found" };

/** Matches complete route paths while allowing query strings on page routes. */
export function matchRoute(hash: string): RouteMatch {
  if (hash === "" || hash === "#" || hash === "#/") {
    return { name: "home" };
  }

  const queryIndex = hash.indexOf("?");
  const path = queryIndex === -1 ? hash : hash.slice(0, queryIndex);
  const queryString = queryIndex === -1 ? "" : hash.slice(queryIndex + 1);

  if (path === "#/catalog") return { name: "catalog", queryString };
  if (path === "#/register") return { name: "register" };
  if (path === "#/list-item") return { name: "list-item" };
  if (path === "#/borrow-list") return { name: "borrow-list" };
  if (path === "#/dashboard") return { name: "dashboard" };

  const itemRoute = /^#\/item\/([^/]+)$/.exec(path);
  const itemId = itemRoute?.[1];
  if (itemId && isValidItemId(itemId)) return { name: "item", itemId };

  return { name: "not-found" };
}
