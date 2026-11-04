---
version: alpha
name: BorrowBox
description: >-
  Design system for BorrowBox, a neighbourhood tool-sharing web app, built on
  the visual language of Nomu (en.nomu.store): a warm off-white canvas, near
  black ink, one orange accent, light oversized headlines, white floating
  cards and slow, smooth motion.
colors:
  primary: "#ff7448"
  primary-hover: "#ff8d69"
  on-primary: "#0f151d"
  accent-text: "#b93a10"
  background: "#fff9f6"
  surface: "#ffffff"
  surface-muted: "#f1ebe9"
  surface-warm: "#ffc8b7"
  ink: "#0f151d"
  text-muted: "#5b5f63"
  line: "#eae5e2"
  border-strong: "#8a8c8e"
  focus: "#0f151d"
  dark: "#0f151d"
  dark-raised: "#1a212b"
  on-dark: "#fff9f6"
  on-dark-muted: "#b9bcc0"
  on-dark-accent: "#ff7448"
  info-bg: "#d3e1ff"
  info-text: "#1e3a8a"
  success-bg: "#e3f2e6"
  success-text: "#1d6b3d"
  danger-bg: "#fde8e4"
  danger-text: "#b42318"
typography:
  display:
    fontFamily: Inter
    fontSize: 7rem
    fontWeight: 450
    lineHeight: 1.02
    letterSpacing: -0.045em
  h1:
    fontFamily: Inter
    fontSize: 3.875rem
    fontWeight: 450
    lineHeight: 1.1
    letterSpacing: -0.045em
  h2:
    fontFamily: Inter
    fontSize: 2.875rem
    fontWeight: 450
    lineHeight: 1.1
    letterSpacing: -0.035em
  h3:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.02em
  step-number:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: 500
    lineHeight: 1.3
  caption:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.4
  eyebrow:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.06em
rounded:
  sm: 10px
  md: 14px
  lg: 20px
  card: 28px
  panel: 40px
  full: 9999px
spacing:
  2xs: 0.25rem
  xs: 0.5rem
  sm: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  3xl: 4.5rem
  section: 7.5rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 1.75rem
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: 48px
  nav-bar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.full}"
    height: 60px
  item-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: 8px
  item-card-image:
    rounded: "{rounded.lg}"
  chip:
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 0.25rem 0.75rem
  chip-available:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success-text}"
  chip-reserved:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info-text}"
  chip-unavailable:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger-text}"
  step-number:
    textColor: "{colors.accent-text}"
    typography: "{typography.step-number}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: 52px
  search-bar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.full}"
    height: 60px
  panel-dark:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.panel}"
---

# BorrowBox Design System

## Overview

BorrowBox lets neighbours borrow tools from each other instead of buying them.
This document replaces the old blue BorrowBox look with a new visual identity
built on the design language of **Nomu** (en.nomu.store).

### How to read this document

- **Observed** means the value was read from Nomu's published HTML and CSS
  files, inspected on 2026-11-03. The values were read from source code, not
  measured from screenshots.
- **BorrowBox** means our own decision, made to fit our product or to pass
  accessibility checks.

### What makes Nomu distinctive (observed)

| Area     | Observed in Nomu                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canvas   | Warm off-white page `#fff9f6` (`--nomu-bg`), never pure white                                                                                      |
| Ink      | One near-black `#0f151d` (`--nomu-ink`) for text; greys are this ink at lower opacity (`--nomu-muted: #0f151d8c`, `--nomu-line: #0f151d14`)        |
| Accent   | One orange `#ff7448` (`--nomu-primary`), with a CTA gradient `#f13f07 → #ff7448` and tints `#ff8d69`, `#ffa88d`, `#ffc8b7`                         |
| Surfaces | White cards `#fff` (`--nomu-card`) floating on the cream page; a soft grey-pink `#f1ebe9` (`--nomu-bubble`); a pale blue `#d3e1ff` (`--secondary`) |
| Type     | Inter everywhere. Headlines are **light** (`font-weight: 400`), very tight (`letter-spacing: -0.045em`), balanced (`text-wrap: balance`)           |
| Scale    | Hero type up to `clamp(48px, 7.2vw, 112px)`; page h1 `clamp(40px, 4.5vw, 62px)`, line-height 1.02 to 1.1                                           |
| Shape    | Pill controls (`--radius: 3.125rem`); cards 24px and 28px; small parts 10px to 16px                                                                |
| Cards    | White, radius 28px, an 8px inner padding so the image sits inset, a large soft shadow and no border                                                |
| Depth    | `--nomu-raised: 0 16px 40px -24px #0f151d47`, `--nomu-float: 0 16px 44px -12px #0f151d38`; glass blur `blur(12px)` and `blur(20px) saturate(180%)` |
| Motion   | Easing `cubic-bezier(.16, 1, .3, 1)`; hero fade-up 20px over 0.5s with delays 0.1s, 0.25s, 0.4s; scroll fade-up 40px over 0.8s                     |
| Images   | Slow "ken-burns" drift (scale 1.06 over 18s); hover zoom 105% and 110%; tiles 4/5, 8/5 and 4/3                                                     |
| Process  | Numbered steps written as two digits: `01 Design … 05 Deliver`                                                                                     |
| Rhythm   | Each section holds one idea: a short heading, then cards, steps, a table or a FAQ                                                                  |

### What BorrowBox takes, changes and leaves

- **Takes:** the cream canvas, the ink, the orange accent, Inter, light
  oversized headlines, white floating cards with inset images, pill controls,
  soft shadows, the easing curve and the reveal motion, and two-digit steps.
- **Changes for accessibility:** orange buttons use **ink text**, not white.
  White on `#ff7448` measures 2.68:1 and fails. Orange **text** uses a darker
  orange, `accent-text` `#b93a10`, because `#ff7448` on cream is 2.57:1. Muted
  text is a solid `#5b5f63`, because Nomu's 55% ink (about `#7b7c7f`) is too
  light for small text.
- **Leaves:** Nomu's logo, its private display font (`nomnom`), its content,
  the AI chat prompt, partner marquees, award badges, stat counters, the
  comparison table and the FAQ. BorrowBox has none of these features.

### What changed while building it (BorrowBox)

Applying the plan in the browser found problems that the plan did not
predict. Each change below was measured, and this document now describes
the result.

| Planned                               | Built                                         | Why                                                                                    |
| ------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------- |
| Glass nav at 80% cream                | 90% cream                                     | Muted nav links over the dark "Why" panel fell to 4.00:1; at 90% they are 5.01:1       |
| Orange (`primary`) nav underline      | `accent-text` underline                       | As a state indicator `#ff7448` is 2.68:1 on white; `#b93a10` is 5.71:1                 |
| Step numbers 3.5rem                   | 2.5rem                                        | Sized for the small 2 × 2 step cards next to the photo                                 |
| Booking panel sticky on the item page | The photo is sticky                           | The details column is the long one, so the photo is what should stay in view           |
| Photo carousel hero                   | A search-first hero with no photo             | Nomu's hero has no photo; a carousel needs a Pause control and hides the main action   |
| `button-dark`                         | Removed                                       | No screen needed it; one primary and one ghost button cover every area                 |
| (not planned)                         | `<bdi>` around text that owners write         | English titles such as "4-Person Tent" showed as "Person Tent-4" on the Arabic page    |
| (not planned)                         | The footer stays at the bottom on short pages | Short pages left a strip of cream under the dark footer                                |
| Item photos 4 : 5                     | Square 1 : 1                                  | The product photos are square; 4 : 5 cut about 12% from each side (bike wheels, mower) |

### Principles

1. **Warm and calm.** Cream canvas, ink text, white cards. Orange is rare, so
   it means something.
2. **Big, light headlines.** One expressive headline per screen; everything
   else is small and quiet.
3. **The item is the hero.** Large photos in floating white cards. Trust
   details (owner, rating, deposit, status) sit right next to the photo.
4. **One action per area.** At most one orange button per section.
5. **Motion that explains.** Things rise gently into place as you arrive or
   scroll. Nothing loops for attention.
6. **Measured, not guessed.** Every colour pair here has a measured contrast.

## Colors

Tokens become CSS custom properties in `src/style.css` under `:root`, named
`--color-<token>`. All contrast values are measured (WCAG 2.x formula).

### Core palette

| Token           | Value     | Source                             | Use                                     | Contrast                                         |
| --------------- | --------- | ---------------------------------- | --------------------------------------- | ------------------------------------------------ |
| `background`    | `#fff9f6` | Observed (`--nomu-bg`)             | Page background                         | n/a                                              |
| `surface`       | `#ffffff` | Observed (`--nomu-card`)           | Cards, nav bar, inputs, search bar      | n/a                                              |
| `surface-muted` | `#f1ebe9` | Observed (`--nomu-bubble`)         | Alternate sections, chips, image wells  | n/a                                              |
| `surface-warm`  | `#ffc8b7` | Observed (`--highlight-3`)         | Soft orange highlights, selected filter | ink 12.40                                        |
| `ink`           | `#0f151d` | Observed (`--nomu-ink`)            | All headings and body text              | 17.58 on background, 15.54 on muted              |
| `text-muted`    | `#5b5f63` | BorrowBox                          | Secondary text, meta, captions          | 6.17 on background, 6.44 on white, 5.46 on muted |
| `line`          | `#eae5e2` | BorrowBox (ink at about 8%, solid) | Decorative dividers only                | decorative                                       |
| `border-strong` | `#8a8c8e` | BorrowBox                          | Input and control borders               | 3.24 on background, 3.37 on white (UI)           |

### Accent

| Token           | Value     | Source                      | Use                                                  | Contrast                          |
| --------------- | --------- | --------------------------- | ---------------------------------------------------- | --------------------------------- |
| `primary`       | `#ff7448` | Observed (`--nomu-primary`) | Primary button fill, active indicators, small shapes | ink on it 6.85                    |
| `primary-hover` | `#ff8d69` | Observed (`--highlight-1`)  | Primary button hover                                 | ink on it 8.09                    |
| `on-primary`    | `#0f151d` | BorrowBox                   | Text on orange                                       | 6.85                              |
| `accent-text`   | `#b93a10` | BorrowBox                   | Orange text, links, step numbers, eyebrows           | 5.48 on background, 4.84 on muted |

### Dark sections (footer, trust panel)

| Token            | Value     | Use                           | Contrast |
| ---------------- | --------- | ----------------------------- | -------- |
| `dark`           | `#0f151d` | Footer and dark panels        | n/a      |
| `dark-raised`    | `#1a212b` | Cards inside the dark panel   | n/a      |
| `on-dark`        | `#fff9f6` | Text on dark                  | 17.58    |
| `on-dark-muted`  | `#b9bcc0` | Secondary text on dark        | 9.62     |
| `on-dark-accent` | `#ff7448` | Orange text and icons on dark | 6.85     |

### Status

| Token pair                    | Values                 | Use                 | Contrast |
| ----------------------------- | ---------------------- | ------------------- | -------- |
| `success-text` / `success-bg` | `#1d6b3d` on `#e3f2e6` | Available           | 5.62     |
| `info-text` / `info-bg`       | `#1e3a8a` on `#d3e1ff` | Reserved            | 7.88     |
| `danger-text` / `danger-bg`   | `#b42318` on `#fde8e4` | Unavailable, errors | 5.58     |

`info-bg` `#d3e1ff` is Nomu's observed `--secondary`.

### Role names (how the dark footer works)

Shared components do not use the palette directly for page colour, text and
lines. They use five **role names**: `--color-bg`, `--color-text`,
`--color-heading`, `--color-border` and `--color-surface-tint`. On the cream
page these point to `background`, `ink`, `line` and `surface-muted`. The
footer gives them light values (`on-dark`, `on-dark-muted`, light lines), so
a link or a heading inside the footer turns light with no second set of
rules. Buttons use the palette directly, so they look the same everywhere.

### Colour rules

- `primary` (`#ff7448`) is **never text** and never a background for white
  text. Text on it is always `ink`.
- Orange appears at most once or twice per screen: the main button and one
  small accent. Large areas stay cream, white or ink.
- No gradients on buttons. Nomu's gradient `#f13f07 → #ff7448` is too light
  for white text, and ink text reads better on a flat fill.
- Status is never shown by colour alone; every chip shows its word.
- Text over photos sits on an overlay or a white card, and is measured
  against the brightest part of the photo.

## Typography

**Font: Inter** (observed on Nomu, open licence, on Google Fonts), loaded as
its variable axis from 400 to 600, which includes 450. It replaces Space
Grotesk and DM Sans. **Arabic: Tajawal** for every role, loaded at 400, 500
and 700.

| Role          | Size                             | Weight | Line height | Tracking | Source                                     |
| ------------- | -------------------------------- | ------ | ----------- | -------- | ------------------------------------------ |
| `display`     | `clamp(3rem, 7.2vw, 7rem)`       | 450    | 1.02        | -0.045em | Observed scale `clamp(48px, 7.2vw, 112px)` |
| `h1` (pages)  | `clamp(2.5rem, 4.5vw, 3.875rem)` | 450    | 1.1         | -0.045em | Observed `clamp(40px, 4.5vw, 62px)`        |
| `h2`          | `clamp(2rem, 3.5vw, 2.875rem)`   | 450    | 1.1         | -0.035em | Observed `clamp(34px, 3.5vw, 46px)`        |
| `h3`          | `clamp(1.25rem, 2vw, 1.5rem)`    | 500    | 1.25        | -0.02em  | Observed range `clamp(18px, 2.4vw, 25px)`  |
| `step-number` | `2.5rem`                         | 400    | 1           | -0.05em  | BorrowBox                                  |
| `body-lg`     | `1.25rem`                        | 400    | 1.5         | -0.01em  | BorrowBox                                  |
| `body`        | `1rem`                           | 400    | 1.6         | 0        | BorrowBox                                  |
| `label`       | `0.9375rem`                      | 500    | 1.3         | 0        | Observed weight 500 is Nomu's most used    |
| `caption`     | `0.8125rem`                      | 500    | 1.4         | 0        | BorrowBox                                  |
| `eyebrow`     | `0.8125rem`, uppercase           | 500    | 1.3         | 0.06em   | BorrowBox                                  |

- Headlines are **light and tight**: weight 450, never bold. Hierarchy comes
  from size, not weight. (Nomu's hero is weight 400.)
- Headlines use `text-wrap: balance` (observed). Paragraphs use
  `text-wrap: pretty`.
- One `display` per site (the home hero). Other pages start with `h1`.
- An `h1` inside a card (the register card, placeholder pages) or a product
  name (the item page) uses the `h2` size, because the `h1` size is too large
  for a narrow column. The `h1` size is kept for full-width page headers,
  such as the catalog when it is built.
- One `h1` per page; heading levels never skip.
- Text blocks: `max-width: 42rem` (Nomu's most used text width is 680px to
  700px).
- **Arabic:** switch to Tajawal, remove negative tracking and uppercase (they
  break letter joining), and raise line height by 0.1.
- **Open decision: Arabic heading weight.** Tajawal has no 450 weight. Now,
  the hero headline falls back to 500, and section titles, category and
  "Why" titles and subheadings use 700, because thin Arabic letters at those
  sizes look weak.
  This is the one place where headlines are bold. The final weights are
  confirmed after previewing Arabic headings in the real interface.

## Layout

### Spacing scale

| Token     | Value   | Use                                  |
| --------- | ------- | ------------------------------------ |
| `2xs`     | 0.25rem | Icon gaps                            |
| `xs`      | 0.5rem  | Card inner padding, label to input   |
| `sm`      | 0.75rem | Chip gaps, title to text             |
| `md`      | 1rem    | Default gap; mobile side padding     |
| `lg`      | 1.5rem  | Between cards                        |
| `xl`      | 2rem    | Desktop side padding; between blocks |
| `2xl`     | 3rem    | Heading to content                   |
| `3xl`     | 4.5rem  | Section padding on mobile            |
| `section` | 7.5rem  | Section padding on desktop           |

The page feels spacious because sections are far apart, not because
components are padded. Keep component padding small and section padding
large.

### Containers

- Page container: `max-width: 1200px`, centred, side padding `md` (mobile)
  and `xl` (768px and up). _BorrowBox._
- Text: `max-width: 42rem`. _Observed width._
- Hero: one column of `max-width: 62rem`; each sentence of the headline is
  on its own line.
- Form card: `max-width: 32rem`. Placeholder card: `max-width: 50rem`.
- **Sticky footer:** the page is at least one screen tall
  (`min-height: 100dvh`) and `<main>` takes the space left over, so on a
  short page the footer still sits at the bottom of the screen.

### Grid and breakpoints (mobile first)

Base styles are for phones; larger screens add rules with `min-width` only.

| Name | Query               | Changes                                                                                                               |
| ---- | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| base | 320px and up        | One column; nav collapses to a menu button; only the logo icon shows                                                  |
| —    | `min-width: 420px`  | The brand word "BorrowBox" appears next to the icon                                                                   |
| sm   | `min-width: 640px`  | Featured items, category links, steps and "Why" cards in 2 columns; the two date fields side by side                  |
| md   | `min-width: 768px`  | Side padding `xl`; sections get `section` padding; footer in 3 columns                                                |
| lg   | `min-width: 1024px` | Full nav; featured items 4 columns; "Why" cards 5 columns; text and photo side by side; item photo beside its details |

The catalog grid is set when the catalog is built.

- No horizontal scroll and no clipped control at 320px, 768px and 1280px.
- Use logical properties (`margin-inline-start`, `inset-inline-end`) so the
  Arabic RTL layout works without extra rules.

### Page layouts

All pages share the floating nav, the cream canvas, the container and the
dark footer.

| Page                         | Layout                                                                                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home** `#/`                | Hero → About → Browse by category → Featured items → How it works (steps `01–04`) → Got tools sitting idle? → Why BorrowBox (dark panel) → Footer                                        |
| **Catalog** `#/catalog`      | `h1`, a pill `search-bar`, category chips (from the existing category list and `?category=`), then the item grid. Empty and "no results" states use the same card shape                  |
| **Item detail** `#/item/:id` | Large square photo in a white `card` frame (left on desktop, sticky); one column on the right: title, owner and trust details, the booking panel (deposit, status, date form), condition |
| **List item** `#/list-item`  | `h1` and one centred white form card (`max-width: 42rem`)                                                                                                                                |
| **Dashboard** `#/dashboard`  | `h1`, then white cards in a single column on mobile and two columns from 1024px                                                                                                          |
| **Register** `#/register`    | `h1` and one centred white form card                                                                                                                                                     |

The catalog, list item and dashboard pages are placeholders in the current
app: each shows one centred white card with its `h1`, a short text and a
"Back to home" button. This table sets their future layout shell only;
their content and features come from the approved spec when they are
built. No new features are added here.

## Elevation & Depth

Depth comes from white surfaces on cream plus large, soft, low shadows.
Borders are rare.

| Level  | Value                                                                      | Source                                             | Use                            |
| ------ | -------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------ |
| flat   | none                                                                       |                                                    | Sections, chips                |
| raised | `0 16px 40px -24px rgba(15, 21, 29, 0.28)`                                 | Observed `--nomu-raised`                           | Cards at rest, inputs, nav bar |
| float  | `0 16px 44px -12px rgba(15, 21, 29, 0.22)`                                 | Observed `--nomu-float`                            | Card hover, dropdowns, menus   |
| glass  | `backdrop-filter: blur(12px) saturate(180%)` on `rgba(255, 249, 246, 0.9)` | Observed blur; tint ours (90%: see "What changed") | Sticky nav over content        |

- Shadow colour is always `ink`, never black.
- On the dark footer, depth comes from `#1a212b` surfaces, not shadows.

## Shapes

| Token   | Value  | Source                             | Use                                          |
| ------- | ------ | ---------------------------------- | -------------------------------------------- |
| `sm`    | 10px   | Observed                           | Tags, small thumbnails                       |
| `md`    | 14px   | Observed                           | Inputs, dropdown items                       |
| `lg`    | 20px   | BorrowBox (`card` minus 8px inset) | Images inside cards                          |
| `card`  | 28px   | Observed                           | Item cards, form cards, photo frames         |
| `panel` | 40px   | BorrowBox                          | Large panels (the dark "Why" panel, footer)  |
| `full`  | 9999px | Observed (pill)                    | Buttons, nav bar, search bar, chips, avatars |

- **Nested radius rule:** inner radius = outer radius − padding. A 28px card
  with 8px padding holds a 20px image.
- Only these six values are used.

## Components

### Navigation bar

- A white pill (`nav-bar`), 60px tall, floating 12px below the top of the
  page, with the `raised` shadow. It becomes `glass` after the page scrolls.
- Left: the logo, a separate asset (SVG) rendered on its own and never cut
  from a photo. The generated orange box icon is not the official logo.
  Centre: links in
  `label`. Right: the "List an item" `button-primary` (small, 40px) and the
  profile button.
- Active link: ink text with a 2px `accent-text` underline that grows from
  the centre.
- Mobile: a menu button opens a white card under the pill that slides down
  8px and fades in.

### Hero (home)

Like Nomu, the hero has **no photo**. Nomu's hero shows its own product in
use (an "Ask Nomu anything" prompt card); BorrowBox shows its own first
action: the search.

- Cream canvas, one centred column (`max-width: 62rem`): eyebrow, `display`
  headline with each sentence on its own line, then the three trust points
  as one quiet `text-muted` row with check marks (they wrap on mobile, and
  each check mark stays next to its first word).
- **Search card:** a white `card` with the `float` shadow, holding the pill
  `search-bar` and, under it, the six categories as chips linking to
  `#/catalog?category=<name>`. It uses the existing search form and category
  list; nothing new is added.
- Under the card: one `button-primary` ("Explore all items") and one
  `button-ghost` ("List an item").
- One word or phrase of the headline may be `accent-text` (BorrowBox). Never
  the whole headline.
- All hero text, buttons, the search bar and the navigation are real HTML.
- Real photos start right after the hero, in "Featured items" and "Browse by
  category".

#### Optional hero image (future)

Not used now. If a hero image is added later, the layout becomes two
columns from 768px (text and search card on the start side, the image in a
4 : 5 `card` frame on the end side); on mobile the image sits under the
search card. The search card stays the same. The image must meet these
requirements.

The first generated image (camera, books, phone, laptop) is **not used**. Its
objects do not show what BorrowBox lends. It is kept only as a reference for
mood: warm cream and orange tones, soft natural light, an editorial product
look and balanced depth.

A new image is made to this brief:

| Requirement   | Value                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Subject       | A calm, uncrowded arrangement of 3 to 5 recognisable items from the six categories                         |
| Categories    | Power Tools, Hand Tools, Gardening, Cleaning, Camping, Outdoor Equipment                                   |
| Example items | Cordless drill, hammer or wrench, watering can or garden shears, a cleaning item, a lantern or folded tent |
| Not allowed   | Books, cameras, laptops, phones, industrial machinery as the main subject                                  |
| Style         | Realistic, professional product photography; soft natural side light                                       |
| Colours       | Warm cream background close to `background` `#fff9f6`; subtle orange accents close to `primary` `#ff7448`  |
| Must not have | Text, headlines, logos, watermarks, or fake app screens                                                    |
| Master size   | 3072 × 2048 px (3 : 2)                                                                                     |

Composition and crop:

- The hero frame is `aspect-ratio: 4 / 5`. A 4 : 5 crop of the master is
  1638 × 2048 px.
- **Safe zone:** every important object sits inside the centre 1638 px of the
  width (x from about 717 px to 2355 px), with some space around it. The
  same crop is used on every screen size, so nothing important can be cut
  off.
- `object-fit: cover`, `object-position: 50% 50%` as the starting value,
  checked in the browser at 320px, 768px and 1280px.

Delivery:

- The master stays outside the repository. The repository gets only the
  image the site uses: a 4 : 5 WebP exported from the master, about
  1200 × 1500 px. The frame is about 560 px wide on desktop, so this is
  sharp on 2× screens (560 × 2 = 1120 px).
- WebP quality is chosen after a side-by-side comparison with the master at
  the real frame size (start at quality 80).

Use in the page:

- **Decorative:** `alt=""`; the HTML headline carries the meaning.
- **Loading:** the largest element in the first view, so it is not
  lazy-loaded. It gets `fetchpriority="high"` and fixed `width`/`height` to
  avoid layout shift.
- **RTL:** in Arabic the frame moves to the other side. The image is never
  mirrored.
- **One static image.** The hero has no rotating carousel and no looping
  animation. It only has its entrance animation (see Motion).

### Buttons

| Variant          | Rest                                  | Hover (hover devices)                            | Active        | Focus                           |
| ---------------- | ------------------------------------- | ------------------------------------------------ | ------------- | ------------------------------- |
| `button-primary` | Orange fill, ink text, pill, 48px     | `primary-hover`, lift `-2px`, arrow nudges `4px` | `scale(0.97)` | 3px `focus` outline, 3px offset |
| `button-ghost`   | White fill, ink text, `raised` shadow | `float` shadow, lift `-2px`                      | `scale(0.97)` | same                            |
| Text link        | `accent-text`, underline 1px          | underline 2px                                    | n/a           | same                            |

- `scale(0.97)` on press is observed on Nomu. The arrow nudge is observed as
  small `translate-x` hovers (1px to 10px).
- Minimum touch target 44×44px.
- Labels say what happens: "Send request", "List an item".

### Item card

- White `surface`, radius `card` (28px), 8px padding, `raised` shadow, no
  border. (Observed card pattern.)
- Image first: `aspect-ratio: 1 / 1`, radius `lg` (20px), `object-fit: cover`.
  The status chip sits on the image, in the top end corner.
- Under the image, with `md` padding: category and rating on one row, the
  title, then condition and owner, and a footer row with the deposit and a
  "Free to borrow" chip.
- The whole card is one link to `#/item/:id`; it has one focusable element.
- Hover: card lifts `-4px` and gets the `float` shadow; the image zooms to
  `scale(1.05)` inside its frame.

### Chips

- Pill, `caption` text, `0.25rem 0.75rem` padding.
- Status chips use the status pairs; the word is always shown.
- Hero category chips: `surface-muted` with ink text (15.54:1), 36px tall.
- Category filter chips (catalog, when built): `surface` with ink text at
  rest; `ink` fill with cream text when selected.

### Process steps ("How it works")

- Four steps, `01` to `04`, in `step-number` style and `accent-text` colour
  (observed two-digit pattern).
- Each step: the two-digit number and its short label, in a white `card`.
- The steps sit next to the section photo, so they form a 2 × 2 grid:
  1 column on mobile, 2 columns from 640px. The photo stays beside them
  from 1024px.
- Markup is an ordered list (`<ol>`).
- Steps reveal one after another on scroll (see Motion).

### Forms

- White form card, radius `card`, `raised` shadow, padding `xl` / `lg` on
  phones and `2xl` / `xl` from 640px.
- The booking form sits in the item page's booking panel, the only card on
  that page with a shadow, because it holds the main action.
- Inputs: `surface`, radius `md`, 52px tall, 1px `border-strong` border,
  `focus` outline on focus. Labels sit `xs` above their input.
- Every input has a visible `<label>`. Placeholders are never labels.
- Errors: `danger-text` under the field, linked with `aria-describedby`;
  focus moves to the first invalid field.

### Images

| Context               | Ratio | Source                                 |
| --------------------- | ----- | -------------------------------------- |
| Item card             | 1 / 1 | BorrowBox (square product photos)      |
| Item detail main      | 1 / 1 | BorrowBox (square product photos)      |
| Category group photos | 8 / 5 | Observed                               |
| Section photos        | 4 / 3 | Observed                               |
| Hero image            | 4 / 5 | BorrowBox (crop of the new hero image) |

- WebP, quality 80, imported in TypeScript so Vite hashes the file name.
- Content images have a real `alt`; decorative ones have `alt=""`.
- Only relative or `https:` image URLs (see `CLAUDE.md`).
- **Item photos:** studio product shots, 1024 × 1024, on a light cream
  background close to `background`, with the item centred. Each is about
  20–70 KB as WebP. The item page shows them up to about 560px wide, so they
  stay sharp on 2× screens. New item photos follow the same style.
- The home section photos (`01`–`07`) are still about 380×508px; larger
  versions would make the home page sharper.

### Footer

`dark` background with `panel` top corners, `on-dark` text, `on-dark-muted`
links, column headings in `on-dark-accent` (6.85:1), and a `button-primary`
"List an item". Content stays as it is today.

## Motion

Motion is a core part of this identity. It must feel smooth and intentional,
never busy.

### Tokens

| Token               | Value                           | Source                              |
| ------------------- | ------------------------------- | ----------------------------------- |
| `ease-out`          | `cubic-bezier(0.16, 1, 0.3, 1)` | Observed (`--nomu-ease`)            |
| `duration-press`    | 100ms                           | Observed (0.1s)                     |
| `duration-fast`     | 150ms                           | Observed (0.15s)                    |
| `duration-standard` | 200ms                           | Observed (0.2s, Nomu's most used)   |
| `duration-medium`   | 300ms                           | Observed (0.3s)                     |
| `duration-enter`    | 500ms                           | Observed (hero fade-up 0.5s)        |
| `duration-reveal`   | 800ms                           | Observed (scroll fade-up 0.8s)      |
| `distance-sm`       | 4px                             | BorrowBox (hover lift, arrow nudge) |
| `distance-md`       | 20px                            | Observed (hero fade-up)             |
| `distance-lg`       | 40px                            | Observed (scroll fade-up)           |
| `stagger-hero`      | 0.1s, 0.25s, 0.4s               | Observed (hero delays)              |
| `stagger-group`     | 80ms per item, at most 6 items  | BorrowBox                           |
| `scale-press`       | 0.97                            | Observed                            |
| `scale-image-hover` | 1.05                            | Observed (105%)                     |
| `scale-enter`       | 1.03                            | BorrowBox (hero image settles in)   |

### Hero entrance

1. Eyebrow, headline, line and actions fade in and rise `distance-md`
   (20px) over `duration-enter`, with `ease-out`, at delays 0.1s, 0.25s and
   0.4s.
2. The search card fades in and rises `distance-lg` over `duration-reveal`,
   starting at 0.25s; its category chips follow with `stagger-group`.
3. After that the hero is still. It plays once per page load, finishes in
   about 1.5s, and needs no Pause control.
4. If the optional hero image is added, its frame enters like the search
   card and the image settles from `scale-enter` (1.03) to 1.

### Scroll reveal

- Section headings, card groups and steps start at `opacity: 0` and
  `translateY(40px)`, then move to their place over `duration-reveal` with
  `ease-out` when about 15% of them enter the viewport (observed `.fade-up`
  → `.visible` pattern).
- Groups reveal in order with `stagger-group` (80ms each, at most 6; the
  rest appear with the 6th).
- Each element reveals once and does not hide again when scrolled away.
- Content must be visible without JavaScript: the hidden start state is only
  applied after the script has loaded.

### Interaction

| Element         | Behaviour                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Card            | Lift `-4px` + `float` shadow over `duration-medium`; image zoom 1.05 over `duration-reveal`       |
| Button          | Colour over `duration-fast`; lift `-2px` over `duration-standard`; press `scale(0.97)` over 100ms |
| Arrow in a link | Moves `distance-sm` toward the reading direction (mirrored in RTL)                                |
| Nav link        | Underline grows from the centre over `duration-medium`                                            |
| Dropdown / menu | Fade + rise 8px over `duration-standard`; close over `duration-fast`                              |
| Nav bar         | Background turns to `glass` over `duration-medium` after the page scrolls                         |

### Rules

- Animate only `transform` and `opacity` (plus colour and `box-shadow` on
  hover). Never animate width, height or layout.
- Name properties in `transition`; never `transition: all`.
- Hover effects live inside `@media (hover: hover) and (pointer: fine)`.
  Touch screens get the press `scale(0.97)` instead, and no stuck hover.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no fade-up offset,
  no reveal, no scale, no lift, no zoom; elements are simply visible. Colour
  changes stay. Smooth scrolling is turned off. (Observed: Nomu disables its
  fade-up, ken-burns and smooth scroll the same way.)

## Accessibility

- WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold),
  control borders and focus rings.
- After any colour change, measure every text element against the background
  it actually sits on, including over photos, on the dark footer and inside
  chips.
- Focus is always visible: 3px `focus` (ink) outline with 3px offset; on
  dark backgrounds the outline is `on-dark`.
- On route change, focus moves to `<main>`.
- Semantic HTML: one `h1`, landmarks, `<ol>` for steps, a label for every
  input.
- **Mixed-direction text:** text that owners write (item title, description,
  condition notes, owner name) is wrapped in `<bdi>`. It keeps its own
  direction, so "4-Person Tent" stays in order on the Arabic page, while the
  line keeps the page's alignment. `dir="auto"` is not used, because it would
  push English titles to the left inside the Arabic layout.
- Run Lighthouse accessibility before calling a page done.

## Do's and Don'ts

**Do**

- Keep the page cream, the cards white, the text ink and the orange rare.
- Use light, tight, oversized headlines and let size carry the hierarchy.
- Put item photos in white floating cards with inset images.
- Use tokens for every colour, size, space, radius, shadow and duration.
- Check every page at 320px, 768px and 1280px, in English and Arabic, and
  with reduced motion turned on.

**Don't**

- Don't put white text on orange or use `#ff7448` as text.
- Don't use bold headlines or more than one `display` headline.
- Don't use pure white `#ffffff` as the page background or pure black for
  text or shadows.
- Don't add borders to cards; use the shadow.
- Don't animate layout properties, add looping or auto-rotating
  animations, or ignore reduced motion.
- Don't copy Nomu's logo, its `nomnom` font, its content, or features
  BorrowBox doesn't have (chat, counters, partner logos, comparison tables).
- Don't use `!important` or `max-width` media queries.
