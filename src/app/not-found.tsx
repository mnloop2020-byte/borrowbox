import type { Metadata } from "next";
import type { ReactElement } from "react";
import { NotFoundView } from "../features/site/NotFoundView.tsx";
import { getI18n } from "../shared/i18n/serverI18n.ts";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.notFound") };
}

/** Any address that matches no page */
export default function NotFound(): ReactElement {
  return <NotFoundView />;
}
