"use client";
import { useEffect, useRef } from "react";
import type { ReactElement, ReactNode } from "react";
import { observeReveals } from "../browser/reveal.ts";

interface RevealOnScrollProps {
  className: string;
  children: ReactNode;
}

/**
 * A wrapper whose [data-reveal] children rise into view as the page
 * scrolls (shared/browser/reveal.ts). The effect is needed: it starts an
 * IntersectionObserver, which is outside React, and stops it on leave.
 */
export function RevealOnScroll({
  className,
  children,
}: RevealOnScrollProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return observeReveals(ref.current);
  }, []);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
