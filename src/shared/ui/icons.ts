/**
 * Arrow icons shared by several views.
 *
 * Both carry .icon-directional, so they flip in the Arabic (RTL) page and
 * keep pointing along the reading direction. aria-hidden: the link text
 * next to them already says where they go.
 */

/** Points forward ("View all →") */
export const ARROW_ICON = `<svg class="icon-directional" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"></path></svg>`;

/** Points back ("← Back to catalog") */
export const BACK_ICON = `<svg class="icon-directional" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m6 6-6-6 6-6"></path></svg>`;
