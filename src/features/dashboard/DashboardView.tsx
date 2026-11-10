import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";
import { getCurrentUser } from "../users/currentUser.ts";

/** "My activity" page (placeholder until the dashboard is built) */
export async function DashboardView(): Promise<ReactElement> {
  const { t } = await getI18n();
  const currentUser = await getCurrentUser();
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
