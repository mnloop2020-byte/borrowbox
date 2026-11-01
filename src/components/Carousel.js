import { t } from "../i18n/i18n.js";
import { escapeHtml } from "../logic/html.js";

const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>`;
const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"></path></svg>`;

const SLIDE_DURATION_MS = 6000;

// Kept outside the component so a language re-render does not restart a
// slideshow the user paused (product spec §10.7)
let rememberedUserPause = false;

/**
 * Mounts the Hero's rotating photo background (redesign spec §4.2).
 *
 * The photos are decorative: the heading and search sit on top of them,
 * so they are hidden from screen readers and have empty alt text.
 * A visible Pause/Play button satisfies WCAG 2.2.2 (anything that moves
 * for more than 5 seconds needs a way to stop it).
 *
 * @param {HTMLElement} mountElement
 * @param {{ image: string }[]} slides
 * @returns {{ cleanup: () => void }}
 */
export function createHeroBackground(mountElement, slides) {
  let currentIndex = 0;
  let timerId = null;
  // True after the user presses Pause; hover and focus must not restart rotation then.
  let isUserPaused = rememberedUserPause;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = mediaQuery.matches;

  mountElement.innerHTML = `
    <div class="hero-bg" aria-hidden="true">
      ${slides
        .map(
          (slide, index) =>
            `<img src="${slide.image}" alt="" class="hero-bg-slide ${index === 0 ? "is-active" : ""}" />`,
        )
        .join("")}
    </div>
    <button type="button" class="hero-pause-btn" aria-label="${escapeHtml(t("home.hero.pause"))}">
      ${isUserPaused ? PLAY_ICON : PAUSE_ICON}
    </button>
  `;

  const slideEls = mountElement.querySelectorAll(".hero-bg-slide");
  const pauseBtn = mountElement.querySelector(".hero-pause-btn");

  function showSlide(newIndex) {
    slideEls[currentIndex].classList.remove("is-active");
    currentIndex = (newIndex + slideEls.length) % slideEls.length;
    slideEls[currentIndex].classList.add("is-active");
  }

  function startAutoRotate() {
    if (prefersReducedMotion || isUserPaused || timerId || slideEls.length < 2)
      return;
    timerId = setInterval(() => showSlide(currentIndex + 1), SLIDE_DURATION_MS);
  }

  function stopAutoRotate() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Keep the button's icon and label in sync with the rotation state.
  // Hidden under reduced motion, because nothing rotates there.
  function updatePauseButton() {
    pauseBtn.hidden = prefersReducedMotion || slideEls.length < 2;
    pauseBtn.setAttribute(
      "aria-label",
      t(isUserPaused ? "home.hero.play" : "home.hero.pause"),
    );
    pauseBtn.innerHTML = isUserPaused ? PLAY_ICON : PAUSE_ICON;
  }

  function handleMotionChange(e) {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      stopAutoRotate();
      showSlide(0);
    } else {
      startAutoRotate();
    }
    updatePauseButton();
  }

  pauseBtn.addEventListener("click", () => {
    isUserPaused = !isUserPaused;
    rememberedUserPause = isUserPaused;
    if (isUserPaused) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
    updatePauseButton();
  });

  mediaQuery.addEventListener("change", handleMotionChange);

  updatePauseButton();
  startAutoRotate();

  return {
    cleanup() {
      stopAutoRotate();
      mediaQuery.removeEventListener("change", handleMotionChange);
    },
  };
}
