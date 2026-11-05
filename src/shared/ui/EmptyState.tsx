import type { ReactElement, ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  text: string;
  /** Optional link or button under the text, e.g. "Clear filters" */
  action?: ReactNode;
}

/**
 * Shown when there is nothing to list: no items at all, no match for a
 * search, or an empty borrow list.
 */
export function EmptyState({
  title,
  text,
  action,
}: EmptyStateProps): ReactElement {
  return (
    <div className="state-card">
      <h2 className="state-title">{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
