import { renderPlaceholder } from "../components/Placeholder.ts";
import { t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";
import type { MountedView } from "../types.ts";

/** "List an item" page (placeholder until the form is built) */
export function mountListItemView(container: HTMLElement): MountedView {
  container.innerHTML = renderPlaceholder(
    t("page.listItem.title"),
    escapeHtml(t("page.listItem.intro")),
  );
  return { title: t("title.listItem"), cleanup: () => {} };
}
