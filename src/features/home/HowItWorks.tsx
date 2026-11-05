import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { HOW_IMAGE, HOW_STEP_KEYS } from "./homeContent.ts";

/** The numbered steps; the menu's "How it works" link scrolls here */
export function HowItWorks(): ReactElement {
  return (
    <section
      id="how-it-works"
      className="home-section split-section"
      aria-labelledby="how-heading"
    >
      <div className="split-text">
        {/* tabIndex -1: scrollToSection() moves focus here */}
        <h2
          id="how-heading"
          className="section-title"
          tabIndex={-1}
          data-reveal
        >
          {t("home.how.title")}
        </h2>
        <p className="section-lead" data-reveal>
          {t("home.how.lead")}
        </p>
        <ol className="how-steps" data-reveal-group>
          {HOW_STEP_KEYS.map((key, i) => (
            <li key={key}>
              {/* Two digits ("01"), like Nomu's numbered process; <ol> already gives the order */}
              <span className="step-number" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t(key)}
            </li>
          ))}
        </ol>
      </div>
      <img
        src={HOW_IMAGE.image}
        alt={t(HOW_IMAGE.altKey)}
        className="split-img"
        loading="lazy"
        data-reveal
      />
    </section>
  );
}
