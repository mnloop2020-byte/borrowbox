import { renderPlaceholder } from "../../shared/ui/Placeholder.ts";
import { categoryLabel } from "../items/categories.ts";
import { t } from "../../shared/i18n/i18n.ts";
import { escapeHtml } from "../../shared/lib/html.ts";
import { parseCatalogParams } from "./catalogParams.ts";
import type { MountedView } from "../../shared/types.ts";

/**
 * Catalog page (placeholder until the catalog is built).
 * Shows which category or search term was asked for.
 *
 * @param queryString - the part of the hash after "?", e.g. "category=Camping"
 */
export function mountCatalogView(
  container: HTMLElement,
  queryString: string,
): MountedView {
  // Only allowed values survive; the text is then set with textContent,
  // which never turns it into HTML
  const { category, q: query } = parseCatalogParams(queryString);
  const label = category
    ? t("page.catalog.filtering")
    : t("page.catalog.searching");

  container.innerHTML = renderPlaceholder(
    t("page.catalog.title"),
    category || query
      ? `${escapeHtml(label)} <strong data-slot="value"></strong>`
      : escapeHtml(t("page.catalog.intro")),
  );

  const valueSlot = container.querySelector('[data-slot="value"]');
  if (valueSlot) {
    // The URL keeps the English category; only its display is translated
    valueSlot.textContent = category ? categoryLabel(category) : `“${query}”`;
  }

  return { title: t("title.catalog"), cleanup: () => {} };
}
