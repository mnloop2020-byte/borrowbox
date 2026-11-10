import type { ReactElement } from "react";

interface ErrorStateProps {
  title: string;
  text: string;
  /** The button text, e.g. "Try again" in the page's language */
  retryLabel: string;
  onRetry: () => void;
}

/**
 * Shown when something could not be loaded or drawn, with a "Try again"
 * button. role="alert" makes screen readers say it at once.
 */
export function ErrorState({
  title,
  text,
  retryLabel,
  onRetry,
}: ErrorStateProps): ReactElement {
  return (
    <div className="state-card state-error" role="alert">
      <h2 className="state-title">{title}</h2>
      <p>{text}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        {retryLabel}
      </button>
    </div>
  );
}
