import type { ReactElement } from "react";

/**
 * Points forward ("View all →").
 *
 * .icon-directional flips it in the Arabic (RTL) page, so it keeps pointing
 * along the reading direction. aria-hidden: the link text next to it
 * already says where it goes.
 */
export function ArrowIcon(): ReactElement {
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
      <path d="M5 12h14m-6-6 6 6-6 6"></path>
    </svg>
  );
}
