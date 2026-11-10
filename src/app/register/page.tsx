import type { Metadata } from "next";
import type { ReactElement } from "react";
import { RegisterView } from "../../features/register/RegisterView.tsx";
import { getI18n } from "../../shared/i18n/serverI18n.ts";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.register") };
}

export default async function RegisterPage(): Promise<ReactElement> {
  const { lang } = await getI18n();
  return <RegisterView lang={lang} />;
}
