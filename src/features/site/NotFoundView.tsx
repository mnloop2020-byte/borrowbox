import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard.tsx";

/** Shown for any address that matches no route (app/not-found.tsx) */
export async function NotFoundView(): Promise<ReactElement> {
  const { t } = await getI18n();
  return (
    <PlaceholderCard
      title={t("page.notFound.title")}
      text={t("page.notFound.text")}
    />
  );
}
