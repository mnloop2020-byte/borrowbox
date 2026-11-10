import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CatalogView } from "../../features/catalog/CatalogView.tsx";
import { parseCatalogParams } from "../../features/catalog/catalogParams.ts";
import { getI18n } from "../../shared/i18n/serverI18n.ts";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.catalog") };
}

interface CatalogPageProps {
  /** ?q=, ?category= and ?sort= from the URL: untrusted, checked below */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** /catalog: the filters live in the URL, so a link or a refresh keeps them */
export default async function CatalogPage({
  searchParams,
}: CatalogPageProps): Promise<ReactElement> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") query.set(key, value);
  }
  return <CatalogView filters={parseCatalogParams(query.toString())} />;
}
