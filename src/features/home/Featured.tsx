import Link from "next/link";
import { Suspense } from "react";
import type { ReactElement } from "react";
import { getI18n } from "../../shared/i18n/serverI18n.ts";
import { ArrowIcon } from "../../shared/ui/ArrowIcon.tsx";
import { LoadingState } from "../../shared/ui/LoadingState.tsx";
import { RetryBoundary } from "../../shared/ui/RetryBoundary.tsx";
import { FeaturedGrid } from "./FeaturedGrid.tsx";

/**
 * "Featured items". The heading shows at once; the cards wait for the API
 * in their own Suspense (loading) and RetryBoundary (error with "Try
 * again"), so the rest of the home page never waits for them.
 */
export async function Featured(): Promise<ReactElement> {
  const { t, lang } = await getI18n();
  return (
    <section
      className="home-section featured-section"
      aria-labelledby="featured-heading"
    >
      <div className="featured-header" data-reveal>
        <h2 id="featured-heading" className="section-title">
          {t("home.featured.title")}
        </h2>
        <Link href="/catalog" className="text-link">
          {t("home.featured.viewAll")} <ArrowIcon />
        </Link>
      </div>
      <RetryBoundary lang={lang} title={t("items.errorTitle")}>
        <Suspense fallback={<LoadingState label={t("items.loading")} />}>
          <FeaturedGrid />
        </Suspense>
      </RetryBoundary>
    </section>
  );
}
