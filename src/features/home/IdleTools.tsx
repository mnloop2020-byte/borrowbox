import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { CheckIcon } from "../../shared/ui/CheckIcon.tsx";
import { IDLE_IMAGE, IDLE_POINT_KEYS } from "./homeContent.ts";

/** "Your tools sit idle": the reasons to list an item */
export function IdleTools(): ReactElement {
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
        <a href="#/list-item" className="btn btn-primary">
          {t("nav.listItem")}
        </a>
      </div>
      <img
        src={IDLE_IMAGE.image}
        alt={t(IDLE_IMAGE.altKey)}
        className="split-img"
        loading="lazy"
        data-reveal
      />
    </section>
  );
}
