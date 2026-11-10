"use client";
import { catchError } from "next/error";
import type { ErrorInfo } from "next/error";
import type { ReactElement } from "react";
import { createI18n } from "../i18n/i18n.ts";
import type { Lang } from "../types.ts";
import { ErrorState } from "./ErrorState.tsx";

interface RetryBoundaryProps {
  lang: Lang;
  /** What could not be shown, e.g. "We couldn't load the tools" */
  title: string;
}

/**
 * What RetryBoundary shows when its children fail. retry() asks the server
 * for that part again and draws it; the rest of the page stays as it is.
 */
function RetryFallback(
  { lang, title }: RetryBoundaryProps,
  { retry }: ErrorInfo,
): ReactElement {
  const { t } = createI18n(lang);
  return (
    <ErrorState
      title={title}
      text={t("items.errorText")}
      retryLabel={t("state.retry")}
      onRetry={retry}
    />
  );
}

/**
 * An error boundary for one part of a page (e.g. the catalog results), made
 * with Next.js catchError: <RetryBoundary lang title>{part}</RetryBoundary>.
 */
export const RetryBoundary = catchError(RetryFallback);
