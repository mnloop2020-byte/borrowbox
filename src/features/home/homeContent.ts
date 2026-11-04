/**
 * Structure and images for the home page.
 * The words live in src/shared/i18n/en.ts and ar.ts; these entries hold the keys,
 * which HomeView.ts passes to t() at render time.
 *
 * Photos supplied by the user (src/assets/photos).
 */
import powerToolsPhoto from "../../assets/photos/01-power-tools.webp";
import cleaningPhoto from "../../assets/photos/04-cleaning.webp";
import sharingPhoto from "../../assets/photos/05-neighbor-tool-sharing.webp";
import garagePhoto from "../../assets/photos/06-garage-tools.webp";
import outdoorPhoto from "../../assets/photos/07-outdoor-equipment.webp";
import { CATEGORIES } from "../items/categories.ts";

const [POWER_TOOLS, HAND_TOOLS, GARDENING, CLEANING, CAMPING, OUTDOOR] =
  CATEGORIES;

export const HERO_BULLET_KEYS = [
  "home.hero.bullet1",
  "home.hero.bullet2",
  "home.hero.bullet3",
];

export const CATEGORY_GROUPS = [
  {
    id: "tools",
    titleKey: "home.groups.tools.title",
    descriptionKey: "home.groups.tools.description",
    image: powerToolsPhoto,
    imageAltKey: "home.groups.tools.imageAlt",
    categories: [POWER_TOOLS, HAND_TOOLS],
  },
  {
    id: "garden-outdoors",
    titleKey: "home.groups.garden.title",
    descriptionKey: "home.groups.garden.description",
    image: outdoorPhoto,
    imageAltKey: "home.groups.garden.imageAlt",
    categories: [GARDENING, CAMPING, OUTDOOR],
  },
  {
    id: "home-cleaning",
    titleKey: "home.groups.home.title",
    descriptionKey: "home.groups.home.description",
    image: cleaningPhoto,
    imageAltKey: "home.groups.home.imageAlt",
    categories: [CLEANING],
  },
];

export const HOW_STEP_KEYS = [
  "home.how.step1",
  "home.how.step2",
  "home.how.step3",
  "home.how.step4",
];

export const HOW_IMAGE = { image: sharingPhoto, altKey: "home.how.imageAlt" };

export const IDLE_POINT_KEYS = [
  "home.idle.point1",
  "home.idle.point2",
  "home.idle.point3",
];

export const IDLE_IMAGE = { image: garagePhoto, altKey: "home.idle.imageAlt" };

export const WHY_ITEMS = [1, 2, 3, 4, 5].map((n) => ({
  titleKey: `home.why.item${n}.title`,
  descriptionKey: `home.why.item${n}.text`,
}));

/** The items in "Featured items": one or more from every category */
export const FEATURED_ITEM_IDS = [
  "item-101",
  "item-102",
  "item-103",
  "item-104",
  "item-106",
  "item-108",
  "item-112",
  "item-113",
];
