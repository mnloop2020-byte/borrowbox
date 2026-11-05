import type { ReactElement } from "react";
import { t } from "../i18n/i18n.ts";

interface ErrorStateProps {
  title: string;
  text: string;
  /** Called by the "Try again" button */
  onRetry: () => void;
}

/**
 * Shown when data could not be loaded, with a "Try again" button.
 * role="alert" makes screen readers say it at once.
 */
export function ErrorState({
  title,
  text,
  onRetry,
}: ErrorStateProps): ReactElement {
  return (
    <div className="state-card state-error" role="alert">
      <h2 className="state-title">{title}</h2>
      <p>{text}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        {t("state.retry")}
      </button>
    </div>
  );
}
