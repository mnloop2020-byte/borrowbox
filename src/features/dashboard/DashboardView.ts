import { renderPlaceholder } from "../../shared/ui/Placeholder.ts";
import { t } from "../../shared/i18n/i18n.ts";
import { escapeHtml } from "../../shared/lib/html.ts";
import { userStore } from "../users/userStore.ts";
import type { MountedView } from "../../shared/types.ts";

/** "My activity" page (placeholder until the dashboard is built) */
export function mountDashboardView(container: HTMLElement): MountedView {
  const currentUser = userStore.getCurrentUser();
  container.innerHTML = renderPlaceholder(
    t("page.dashboard.title"),
    escapeHtml(
      t("page.dashboard.intro", {
        name: currentUser.name,
        role: t(`role.${currentUser.role}`),
      }),
    ),
  );
  return { title: t("title.dashboard"), cleanup: () => {} };
}
