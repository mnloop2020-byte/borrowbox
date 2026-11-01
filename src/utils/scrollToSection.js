/**
 * Scrolls to a section on the current page and moves focus to its heading.
 *
 * Used instead of plain "#id" links, because the app routes on the URL hash
 * ("#/catalog"), so "#how-it-works" would be treated as an unknown route.
 *
 * @param {string} id - The section's element id
 * @returns {void}
 */
export function scrollToSection(id) {
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
  const heading = section.querySelector("[tabindex='-1']");
  heading?.focus({ preventScroll: true });
}
