import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ListItemView } from "../../features/list-item/ListItemView.tsx";
import { getI18n } from "../../shared/i18n/serverI18n.ts";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.listItem") };
}

export default function ListItemPage(): ReactElement {
  return <ListItemView />;
}
