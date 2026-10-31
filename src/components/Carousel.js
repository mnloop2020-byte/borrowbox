import drillImg from "../assets/images/carousel-drill.svg";
import gardenImg from "../assets/images/carousel-gardening.svg";
import campImg from "../assets/images/carousel-camping.svg";
import cleanImg from "../assets/images/carousel-cleaning.svg";

export const CAROUSEL_SLIDES = [
  {
    image: drillImg,
    alt: "Cordless power drill and woodworking tools in workshop",
    title: "Power Tools & DIY Gear",
    tagline: "High-grade drills, saws, and sanders ready for home projects",
  },
  {
    image: gardenImg,
    alt: "Stainless steel gardening hand trowel and pruning shears",
    title: "Garden & Lawn Equipment",
    tagline:
      "Eco-friendly landscaping tools shared by local garden enthusiasts",
  },
  {
    image: campImg,
    alt: "Camping dome tent and warm lantern ready for outdoor adventure",
    title: "Camping & Outdoor Kits",
    tagline:
      "Weekend getaways made easy without buying costly outdoor supplies",
  },
  {
    image: cleanImg,
    alt: "High-pressure washer and domestic cleaning machine",
    title: "Pressure Washers & Cleaning",
    tagline: "Deep cleaning machines for seasonal home and patio restoration",
  },
];

/**
 * Creates and mounts an accessible, self-rotating Carousel component.
 *
 * @param {HTMLElement} mountElement
 * @returns {Object} { cleanup: Function }
 */
export function createCarousel(mountElement) {
  let currentIndex = 0;
  let timerId = null;
  const slideDuration = 5000;

  // Check user motion preference
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = mediaQuery.matches;

  function handleMotionChange(e) {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  }

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleMotionChange);
  }

  mountElement.innerHTML = `
    <div class="carousel-container" role="region" aria-roledescription="carousel" aria-label="Featured Community Equipment">
      <div class="carousel-track" aria-live="polite">
        ${CAROUSEL_SLIDES.map(
          (slide, index) => `
          <div
            class="carousel-slide ${index === 0 ? "is-active" : ""}"
            role="group"
            aria-roledescription="slide"
            aria-label="Slide ${index + 1} of ${CAROUSEL_SLIDES.length}: ${slide.title}"
            aria-hidden="${index === 0 ? "false" : "true"}"
            data-index="${index}"
          >
            <div class="carousel-image-wrapper">
              <img src="${slide.image}" alt="${slide.alt}" class="carousel-img" />
              <div class="carousel-caption">
                <span class="carousel-caption-title">${slide.title}</span>
                <span class="carousel-caption-tagline">${slide.tagline}</span>
              </div>
            </div>
          </div>
        `,
        ).join("")}
      </div>

      <!-- Navigation Arrows -->
      <div class="carousel-controls">
        <button
          type="button"
          class="carousel-control-btn prev-btn"
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          type="button"
          class="carousel-control-btn next-btn"
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Pagination Dot Indicators -->
      <div class="carousel-indicators" role="tablist" aria-label="Choose slide">
        ${CAROUSEL_SLIDES.map(
          (_, index) => `
          <button
            type="button"
            class="carousel-dot ${index === 0 ? "is-active" : ""}"
            role="tab"
            aria-label="Go to slide ${index + 1}"
            aria-selected="${index === 0 ? "true" : "false"}"
            data-slide-to="${index}"
          ></button>
        `,
        ).join("")}
      </div>
    </div>
  `;

  const slides = mountElement.querySelectorAll(".carousel-slide");
  const dots = mountElement.querySelectorAll(".carousel-dot");
  const prevBtn = mountElement.querySelector(".prev-btn");
  const nextBtn = mountElement.querySelector(".next-btn");
  const container = mountElement.querySelector(".carousel-container");

  function goToSlide(newIndex) {
    slides[currentIndex].classList.remove("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "true");
    dots[currentIndex].classList.remove("is-active");
    dots[currentIndex].setAttribute("aria-selected", "false");

    currentIndex = (newIndex + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;

    slides[currentIndex].classList.add("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "false");
    dots[currentIndex].classList.add("is-active");
    dots[currentIndex].setAttribute("aria-selected", "true");
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoRotate() {
    if (prefersReducedMotion || timerId) return;
    timerId = setInterval(nextSlide, slideDuration);
  }

  function stopAutoRotate() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoRotate();
      prevSlide();
      startAutoRotate();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoRotate();
      nextSlide();
      startAutoRotate();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIndex = parseInt(dot.getAttribute("data-slide-to"), 10);
      stopAutoRotate();
      goToSlide(targetIndex);
      startAutoRotate();
    });
  });

  // Pause on hover or keyboard focus
  if (container) {
    container.addEventListener("mouseenter", stopAutoRotate);
    container.addEventListener("mouseleave", startAutoRotate);
    container.addEventListener("focusin", stopAutoRotate);
    container.addEventListener("focusout", startAutoRotate);
  }

  startAutoRotate();

  // Return unmount cleanup function
  return {
    cleanup() {
      stopAutoRotate();
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMotionChange);
      }
    },
  };
}
