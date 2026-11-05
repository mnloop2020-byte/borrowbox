/**
 * Reveals content as it scrolls into view (DESIGN.md, "Scroll reveal").
 *
 * - `[data-reveal]` elements rise into place once, when about 15% of them
 *   is visible.
 * - Children of `[data-reveal-group]` reveal one after another, 80ms apart,
 *   at most 6 steps; the rest arrive with the 6th.
 * - The hiding rule in CSS only applies under `.js-reveal`, which is added
 *   here, so the page is complete without JavaScript.
 * - With reduced motion, nothing is hidden or moved.
 *
 * @param root - where to look for elements to reveal
 * @returns cleanup that stops observing
 */
export function observeReveals(root: ParentNode): () => void {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    return () => {};
  }

  for (const group of root.querySelectorAll<HTMLElement>(
    "[data-reveal-group]",
  )) {
    [...group.children].forEach((child, i) => {
      if (!(child instanceof HTMLElement)) return;
      child.dataset.reveal = "";
      child.style.setProperty("--reveal-i", String(Math.min(i, 5)));
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // reveal once, never hide again
      }
    },
    { threshold: 0.15 },
  );

  for (const el of root.querySelectorAll("[data-reveal]")) {
    observer.observe(el);
  }
  document.documentElement.classList.add("js-reveal");

  return () => observer.disconnect();
}
