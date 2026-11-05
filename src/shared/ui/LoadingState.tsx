import type { ReactElement } from "react";

interface LoadingStateProps {
  /** What is loading, e.g. "Loading tools…" */
  label: string;
}

/**
 * Shown while data is on its way. role="status" lets screen readers say
 * the label without moving focus.
 */
export function LoadingState({ label }: LoadingStateProps): ReactElement {
  return (
    <div className="state-card state-loading" role="status">
      <span className="state-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
