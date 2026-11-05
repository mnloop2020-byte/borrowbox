import type { ReactElement } from "react";

/**
 * Points back ("← Back to home").
 *
 * .icon-directional flips it in the Arabic (RTL) page. aria-hidden: the
 * link text next to it already says where it goes.
 */
export function BackIcon(): ReactElement {
  return (
    <svg
      className="icon-directional"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5m6 6-6-6 6-6"></path>
    </svg>
  );
}
