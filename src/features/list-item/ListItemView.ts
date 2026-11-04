import { renderPlaceholder } from "../../shared/ui/Placeholder.ts";
import { t } from "../../shared/i18n/i18n.ts";
import { escapeHtml } from "../../shared/lib/html.ts";
import type { MountedView } from "../../shared/types.ts";

/** "List an item" page (placeholder until the form is built) */
export function mountListItemView(container: HTMLElement): MountedView {
  container.innerHTML = renderPlaceholder(
    t("page.listItem.title"),
    escapeHtml(t("page.listItem.intro")),
  );
  return { title: t("title.listItem"), cleanup: () => {} };
}
