import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { ArrowIcon } from "../../shared/ui/ArrowIcon.tsx";
import { ScrollLink } from "../../shared/ui/ScrollLink.tsx";

/** "What is BorrowBox" with a link down to "How it works" */
export async function About(): Promise<ReactElement> {
  const { t } = await getI18n();
  return (
    <section
      className="home-section about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-heading-col" data-reveal>
        <span className="section-eyebrow">{t("home.about.eyebrow")}</span>
        <h2 id="about-heading" className="section-title">
          {t("home.about.title")}
        </h2>
      </div>
      <div className="about-body-col" data-reveal>
        <p className="about-text">{t("home.about.text")}</p>
        <ScrollLink targetId="how-it-works" className="text-link">
          {t("home.about.link")} <ArrowIcon />
        </ScrollLink>
      </div>
    </section>
  );
}
