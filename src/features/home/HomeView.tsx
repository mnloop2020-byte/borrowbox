import type { ReactElement } from "react";
import { RevealOnScroll } from "../../shared/ui/RevealOnScroll.tsx";
import { About } from "./About.tsx";
import { Categories } from "./Categories.tsx";
import { Featured } from "./Featured.tsx";
import { Hero } from "./Hero.tsx";
import { HowItWorks } from "./HowItWorks.tsx";
import { IdleTools } from "./IdleTools.tsx";
import { Why } from "./Why.tsx";

/**
 * The home page. Every section is drawn on the server; only Featured waits
 * for the API, inside its own Suspense, so the other sections show at once.
 */
export function HomeView(): ReactElement {
  return (
    <RevealOnScroll className="home-view">
      <Hero />
      <About />
      <Categories />
      <Featured />
      <HowItWorks />
      <IdleTools />
      <Why />
    </RevealOnScroll>
  );
}
