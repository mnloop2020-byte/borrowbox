"use client";
import type { ReactElement } from "react";
import { createI18n } from "../shared/i18n/i18n.ts";
import { useDocumentLang } from "../shared/i18n/useDocumentLang.ts";
import { ErrorState } from "../shared/ui/ErrorState.tsx";

interface PageErrorProps {
  /** Not shown: in production Next.js hides the details of server errors */
  error: unknown;
  /** Asks the server for the page again and draws it */
  retry: () => void;
}

/**
 * The error boundary of every page (Next.js wraps each page in it). The
 * Navbar and Footer stay; only the page is replaced by the error.
 */
export default function PageError({ retry }: PageErrorProps): ReactElement {
  const { t } = createI18n(useDocumentLang());
  return (
    <ErrorState
      title={t("error.boundaryTitle")}
      text={t("error.boundaryText")}
      retryLabel={t("state.retry")}
      onRetry={retry}
    />
  );
}
