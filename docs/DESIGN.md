---
name: Lacquer & Co.
description: Hand detailing, paint correction and ceramic coating from a small Chicago workshop, priced and booked like a work order.
colors:
  bg: "#f3f2f0"
  surface: "#ffffff"
  surface-alt: "#e6e4e1"
  ink: "#191a1c"
  ink-soft: "#4e5257"
  ink-faint: "#5f6369"
  line: "#d8d5d1"
  accent: "#c2410c"
  accent-hover: "#a9380a"
  accent-soft: "#fbe7dc"
  accent-ink: "#7c2a08"
  steel: "#43586b"
  steel-soft: "#e4e9ee"
  success: "#3f7d4a"
  warning: "#b8863a"
  warning-ink: "#8a6326"
  danger: "#a63a2e"
typography:
  display:
    fontFamily: "Chivo, Arial Black, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3.6vw, 4rem)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Chivo, Arial Black, sans-serif"
    fontSize: "clamp(2.125rem, 1.6rem + 2.2vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline-sm:
    fontFamily: "Chivo, Arial Black, sans-serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.6vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Chivo, Arial Black, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.3
  body-l:
    fontFamily: "Barlow, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Barlow, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Barlow, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  figure:
    fontFamily: "Roboto Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  input: "8px"
  panel: "10px"
  pill: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-tablet: "48px"
  container: "1296px"
  section-mobile: "72px"
  section-tablet: "96px"
  section-desktop: "128px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-inverse:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-inverse-hover:
    backgroundColor: "{colors.accent-soft}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "0 14px"
    height: "48px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  badge-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  badge-steel:
    backgroundColor: "{colors.steel-soft}"
    textColor: "{colors.steel}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  slot-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    rounded: "{rounded.pill}"
    height: "56px"
  slot-chip-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  nav-link-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.ink}"
---

# Design System: Lacquer & Co.

## Overview

**Creative North Star: "The Work Order"**

A detailing workshop that prices and schedules like an instrument maker. Every surface reads as a precise, honest document: porcelain paper, graphite type, hairline rules, and figures set in mono like entries on a drop-off ticket. The finish itself is the only spectacle, carried by photography of real paint and real seats; the interface around it stays quiet, exact and legible.

Density is editorial, not dashboard: generous section rhythm, asymmetric 12-column splits, and panels that hold line items rather than marketing copy. Burnt orange is the one voice. It speaks as a small accent almost everywhere, and exactly once it floods a whole band of the page, where the visitor books.

The world refuses the category default of detailing sites: glossy black car on black, neon, and gold "luxury". It is light only.

**Key Characteristics:**
- Porcelain ground, graphite ink, a single burnt orange accent.
- Chivo 900 headlines set tight; Barlow for everything read; Roboto Mono only for figures.
- Hairline borders and rings instead of heavy shadow; 10px panels, pill buttons, 8px inputs.
- Priced line items as the recurring motif: name left, mono figure right, hairline between.
- Saturated, close-up photography of the finish carries the emotion.

## Colors

A neutral porcelain and graphite palette with one warm, loud accent and one cool, quiet tint.

### Primary
- **Burnt Orange** (accent): primary buttons, selected slots and dates, the compare-slider handle, check marks, focus outlines, and the single full-bleed booking band.
- **Burnt Orange Pressed** (accent-hover): hover state of primary buttons only.
- **Apricot Wash** (accent-soft): text selection, hover fills on choosable items, selected-row tint, accent badges.
- **Burnt Umber Ink** (accent-ink): text on Apricot Wash and on the inverse button; the accent's readable form at small sizes.

### Secondary
- **Workshop Steel** (steel): text on steel-tinted surfaces, mono figure line under the before/after heading, steel badges and notices.
- **Steel Mist** (steel-soft): the quiet band behind the before/after section and demo-availability notices.

### Neutral
- **Porcelain** (bg): page ground, nav and footer.
- **Paper White** (surface): panels, cards, inputs, dialog.
- **Dove Grey** (surface-alt): hover fills on nav links and ghost controls, the newsletter band, loading skeletons, neutral badges.
- **Graphite** (ink): headings and primary text.
- **Graphite Soft** (ink-soft): body copy, secondary text, nav links at rest.
- **Graphite Faint** (ink-faint): hints, placeholders, legal footer copy. Darkened from the PRD value so it holds AA on Porcelain.
- **Hairline** (line): dividers, panel rings, section borders.

### Status
- **Moss** (success), **Ochre** (warning fill) with **Ochre Ink** (warning text), **Brick** (danger): form validation and booking states only, always paired with an icon or text.

### Named Rules
**The One Flood Rule.** Burnt Orange fills a page-scale field exactly once per page: the booking band. Everywhere else it is an accent on a control, a figure or a mark. A second orange band is a violation.

**The Quiet Band Rule.** Section changes of tone use Steel Mist or Dove Grey bands, never a second saturated color and never a dark band.

**The Readable Accent Rule.** Small accent-colored text sits on Apricot Wash in Burnt Umber Ink; white text sits on Burnt Orange only at button or heading weight.

## Typography

**Display Font:** Chivo (with Arial Black, sans-serif)
**Body Font:** Barlow (with Arial, sans-serif)
**Label/Mono Font:** Roboto Mono (with ui-monospace, monospace), tabular figures

**Character:** A heavy, compact grotesque shouting short sentences over a calm, slightly technical sans; the mono is the ledger in the margin.

### Hierarchy
- **Display** (900, clamp 40 to 64px, 1.02, -0.03em): the hero H1 only, three lines maximum.
- **Headline** (900, clamp 34 to 48px, 1.08, -0.02em): section H2s, written as full sentences ending in a period.
- **Headline Small** (900, clamp 28 to 36px, 1.12): the newsletter heading and confirmation-page headings.
- **Title** (700, clamp 20 to 24px, 1.3): package names and card titles in Chivo. Dialog step headings use Barlow 600 at 20px instead.
- **Body Large** (400, 18px, 1.6): section intros and hero subtext, capped at 34 to 52ch.
- **Body** (400, 16px, 1.6): running text; 15px in cards, lists and footer.
- **Label** (600, 15px): buttons, nav links, field labels, panel captions.
- **Figure** (Roboto Mono 500, tabular): prices (24 to 32px in package cards), durations and deposits (14px, ink-soft), slot times, dates in the calendar, booking references (28px on confirmation).

### Named Rules
**The Ledger Rule.** Roboto Mono sets only prices, durations, time slots and references. Never headlines, never body, never labels.

**The Sentence Headline Rule.** Headings are plain declarative sentences in Chivo 900. No eyebrow, kicker or small uppercase label sits above a heading.

## Layout

A 1296px container with 20px gutters on mobile, 48px from 768px, and none from 1440px. Sections breathe on a 72 / 96 / 128px vertical rhythm (mobile / tablet / desktop). Desktop composition is an asymmetric 12-column split (roughly 5 to 7 or 7 to 5), with the hero breaking the container: copy in the left half, photography bleeding to the right viewport edge with a priced panel overlapping its lower left edge. Sticky 72px nav; anchor scroll offsets by 88px. On mobile everything stacks in reading order, the hero photo follows the copy, and nav links collapse into a menu while the Book pill stays visible.

## Elevation & Depth

Mostly flat. Depth comes from Paper White panels on Porcelain, separated by a 1px Hairline ring. Two shadows exist and they are soft and ambient, never hard or offset.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgba(25,26,28,0.05)`): primary buttons and small accent chips at rest.
- **Raised** (`0 12px 32px rgba(25,26,28,0.1)`): floating panels (the hero price card), primary button hover, the compare-slider handle.
- **Band Lift** (`0 24px 48px rgba(124,42,8,0.35)`): only the white panel sitting on the orange booking band, tinted with the accent so it does not go grey on orange.

### Named Rules
**The Hairline First Rule.** Separate with a Hairline ring or divider before reaching for a shadow; a shadow means the element floats over something.

## Shapes

Three radii, each with one job: 10px for panels, cards, photographs and dialogs; fully round pills for buttons, badges, nav hover fills and slot chips; 8px for inputs, calendar days and inline notices. Photography that bleeds off an edge keeps the panel radius only on its inner corners. Borders are 1px Hairline or ink at 15 to 20% opacity.

## Components

### Buttons
Confident, compact pills that lift a pixel on hover.
- **Shape:** full pill (9999px).
- **Primary:** Burnt Orange with white Barlow 600 label, 44px tall with 20px sides (52px and 28px at large), Rest shadow.
- **Hover / Focus:** Burnt Orange Pressed plus Raised shadow and a 1px lift; press scales to 0.98. Focus is a 2px Burnt Orange outline offset 3px (white on the orange band).
- **Secondary:** Paper White with a 15% ink border, border darkens to 40% on hover.
- **Inverse:** Paper White with Burnt Umber Ink text, for the orange band only; hovers to Apricot Wash.
- **Quiet:** an underlined text link at button height; the underline turns orange on hover.

### Chips
- **Badges:** pill, 13px Barlow 600, tonal pairs (Dove Grey/Graphite Soft, Apricot Wash/Burnt Umber Ink, Steel Mist/Workshop Steel, status tints).
- **Slot chips:** 56px mono pills in a 2 or 4 column grid; unselected Paper White with 15% ink border, hover Apricot Wash, selected solid Burnt Orange with white text.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** Paper White on Porcelain or Steel Mist.
- **Shadow Strategy:** Hairline ring at rest; Raised only when floating over photography.
- **Internal Padding:** 20px (compact), 24px, 32px from 640px.
- **Package cards** split photograph and text; the featured package spans 7 columns.

### Inputs / Fields
- **Style:** Paper White, 1px ink at 20%, 8px radius, 48px tall, 14px sides, placeholder in Graphite Faint. Label above in Barlow 600 15px, hint below in Graphite Faint.
- **Focus:** border turns Burnt Orange with a 3px ring of orange at 20%.
- **Error:** Brick border and ring; error message pairs Brick text with a warning icon.

### Navigation
Sticky 72px Porcelain bar with a Hairline bottom border. Lockup left, four Barlow 600 links in Graphite Soft that fill with a Dove Grey pill on hover, phone number and the orange Book pill right. Below 1024px links move into a menu.

### Price Line Panel
The signature: a panel of line items, service name in Graphite Soft left, mono price in Graphite right, Hairline dividers between. It appears over the hero photo, inside the booking band, and in the booking dialog's service step.

### Booking Dialog
A 680px Paper White dialog (full-screen on mobile) over a 45% Graphite scrim with 2px blur, rising in over 360ms. Each step shares one anatomy: Barlow 600 heading, intro, body, and a sticky footer with a Back ghost pill and the primary action. Progress is a segmented bar: done in Graphite, current in Burnt Orange, pending in Dove Grey.

### Compare Slider
Full-width before/after with a 2px white divider and a 56px Burnt Orange round handle with Raised shadow; small orange pill labels mark each side.

### Motion
Ease-out-expo (`cubic-bezier(0.16, 1, 0.3, 1)`) throughout. Hero copy rises in 24px with 80ms staggers; the hero photo reveals by clip only (no opacity, it is the LCP); sections rise on scroll via view timelines where supported. Everything is visible by default and all motion is skipped under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep Burnt Orange (#c2410c) to controls, figures and marks, plus the one booking band per page.
- **Do** set every price, duration, slot and booking reference in Roboto Mono with tabular figures.
- **Do** separate surfaces with a 1px Hairline ring before adding a shadow.
- **Do** use 10px for panels, full pills for buttons and chips, 8px for inputs.
- **Do** lead sections with a Chivo 900 sentence heading and an 18px Graphite Soft intro.
- **Do** use Steel Mist or Dove Grey bands for quiet tonal changes.
- **Do** let close-up, saturated photography of real finishes carry the emotion.

### Don't:
- **Don't** flood a second page-scale field with Burnt Orange.
- **Don't** add eyebrows, kickers or small uppercase labels above headings.
- **Don't** use Roboto Mono for headings, body copy or labels.
- **Don't** introduce a dark theme or dark bands; the world is light only.
- **Don't** use hard, offset or grey-on-orange shadows.
- **Don't** reach for glossy black cars on black, neon or gold "luxury" styling.
- **Don't** use Graphite Faint lighter than #5f6369 for text.
