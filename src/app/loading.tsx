import type { ReactElement } from "react";
import { getI18n } from "../shared/i18n/serverI18n.ts";
import { LoadingState } from "../shared/ui/LoadingState.tsx";

/** Shown by Next.js (inside Suspense) while a page is being prepared */
export default async function Loading(): Promise<ReactElement> {
  const { t } = await getI18n();
  return <LoadingState label={t("page.loading")} />;
}
