import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";
import { useCurrentUser } from "../users/useCurrentUser.ts";

/** "My activity" page (placeholder until the dashboard is built) */
export function DashboardView(): ReactElement {
  usePageTitle(t("title.dashboard"));
  const currentUser = useCurrentUser();
  return (
    <PlaceholderCard
      title={t("page.dashboard.title")}
      text={t("page.dashboard.intro", {
        name: currentUser.name,
        role: t(`role.${currentUser.role}`),
      })}
    />
  );
}
