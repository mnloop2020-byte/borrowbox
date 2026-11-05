import type { ReactElement } from "react";

/** A tick before a list line (the hero points and the idle-tools list) */
export function CheckIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5 9-10"></path>
    </svg>
  );
}
