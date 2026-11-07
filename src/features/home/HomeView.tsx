import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { t } from "../../shared/i18n/i18n.ts";
import { observeReveals } from "../../shared/browser/reveal.ts";
import { usePageTitle } from "../../shared/browser/usePageTitle.ts";
import { ErrorBoundary } from "../../shared/ui/ErrorBoundary.tsx";
import { About } from "./About.tsx";
import { Categories } from "./Categories.tsx";
import { Featured } from "./Featured.tsx";
import { Hero } from "./Hero.tsx";
import { HowItWorks } from "./HowItWorks.tsx";
import { IdleTools } from "./IdleTools.tsx";
import { Why } from "./Why.tsx";

/** The home page. The scroll reveal starts when it appears and stops when it leaves. */
export function HomeView(): ReactElement {
  usePageTitle(t("title.home"));
  const ref = useRef<HTMLDivElement>(null);

  // Runs once after the first draw; React calls the returned
  // function when the page leaves, which stops the observer
  useEffect(() => {
    if (!ref.current) return;
    return observeReveals(ref.current);
  }, []);

  return (
    <div className="home-view" ref={ref}>
      <Hero />
      <About />
      <Categories />
      <ErrorBoundary
        title={t("error.boundaryTitle")}
        text={t("error.boundaryText")}
      >
        <Featured />
      </ErrorBoundary>
      <HowItWorks />
      <IdleTools />
      <Why />
    </div>
  );
}
