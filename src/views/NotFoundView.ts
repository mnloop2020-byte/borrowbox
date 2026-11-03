import { renderPlaceholder } from "../components/Placeholder.ts";
import { t } from "../i18n/i18n.ts";
import { escapeHtml } from "../logic/html.ts";
import type { MountedView } from "../types.ts";

/** Shown for any hash that matches no route */
export function mountNotFoundView(container: HTMLElement): MountedView {
  container.innerHTML = renderPlaceholder(
    t("page.notFound.title"),
    escapeHtml(t("page.notFound.text")),
  );
  return { title: t("title.notFound"), cleanup: () => {} };
}
