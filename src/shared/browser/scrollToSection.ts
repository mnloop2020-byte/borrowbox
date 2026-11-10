/**
 * Scrolls to a section on the current page and moves focus to its heading.
 *
 * Used by ScrollLink on the home page, so focus moves with the scroll.
 *
 * @param id - The section's element id
 */
export function scrollToSection(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  section.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });

  // Move keyboard and screen-reader focus with the scroll
  const heading = section.querySelector<HTMLElement>("[tabindex='-1']");
  heading?.focus({ preventScroll: true });
}
