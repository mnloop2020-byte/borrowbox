import type { ReactElement } from "react";
import { t } from "../shared/i18n/i18n.ts";
import { usePageTitle } from "../shared/browser/usePageTitle.ts";
import { PlaceholderCard } from "../shared/ui/PlaceholderCard.tsx";

/** Shown for any hash that matches no route */
export function NotFoundView(): ReactElement {
  usePageTitle(t("title.notFound"));
  return (
    <PlaceholderCard
      title={t("page.notFound.title")}
      text={t("page.notFound.text")}
    />
  );
}
