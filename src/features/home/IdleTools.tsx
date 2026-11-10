import Link from "next/link";
import Image from "next/image";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { CheckIcon } from "../../shared/ui/CheckIcon.tsx";
import { IDLE_IMAGE, IDLE_POINT_KEYS } from "./homeContent.ts";

/** "Your tools sit idle": the reasons to list an item */
export async function IdleTools(): Promise<ReactElement> {
  const { t } = await getI18n();
  return (
    <section
      className="home-section split-section split-section--reverse"
      aria-labelledby="idle-heading"
    >
      <div className="split-text" data-reveal>
        <h2 id="idle-heading" className="section-title">
          {t("home.idle.title")}
        </h2>
        <p className="section-lead">{t("home.idle.lead")}</p>
        <ul className="check-list">
          {IDLE_POINT_KEYS.map((key) => (
            <li key={key}>
              <CheckIcon />
              {t(key)}
            </li>
          ))}
        </ul>
        <Link href="/list-item" className="btn btn-primary">
          {t("nav.listItem")}
        </Link>
      </div>
      <Image
        src={IDLE_IMAGE.image}
        alt={t(IDLE_IMAGE.altKey)}
        className="split-img"
        sizes="(min-width: 768px) 50vw, 100vw"
        data-reveal
      />
    </section>
  );
}
