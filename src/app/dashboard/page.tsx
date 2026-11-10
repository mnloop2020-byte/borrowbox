import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DashboardView } from "../../features/dashboard/DashboardView.tsx";
import { getI18n } from "../../shared/i18n/serverI18n.ts";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.dashboard") };
}

export default function DashboardPage(): ReactElement {
  return <DashboardView />;
}
