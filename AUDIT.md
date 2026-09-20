# Audit: Lacquer & Co. website rescue

A defect log for the legacy site (served at `/before`) and the fix for each item in the rebuild (`/`). Every number below comes from committed evidence in `audit/`, produced by scripts, not captured by hand.

## Headline numbers

Lighthouse 13.4.1, mobile preset (simulated slow 4G, 4x CPU slowdown), production build on localhost, **median of 5 runs**. Accessibility counts come from axe-core 4 (WCAG 2.1 A and AA rules).

| Metric | Before (`/before`) | After (`/`) | Target |
|---|---|---|---|
| Largest Contentful Paint | 22.8 s | 3.9 s | under 2.5 s: **not met locally, see note 1** |
| Cumulative Layout Shift (Lighthouse) | 0.000 | 0.013 | under 0.1 |
| Cumulative Layout Shift (real throttling, see note 2) | **0.400** | **0.000** | under 0.1 |
| Total Blocking Time (lab proxy for INP, note 3) | 162 ms | 232 ms | under 200 ms: **not reliably met locally, see note 3** |
| Total page weight | 4.41 MB | 0.46 MB | |
| Performance score | 72 | 83 | |
| Accessibility score | 74 | **100** | 100 |
| Best Practices score | 96 | 100 | |
| SEO score | 83 | 100 | |
| axe violations | 3 rules, 16 nodes | 0 | 0 |

The After column was recorded just before the final hero photograph swap (grey to red paint); the Before column already uses the new photograph. A later After run taken while other heavy processes shared the machine was discarded as unrepresentative. Re-run the audit to refresh the After column.

Evidence: `audit/before/` and `audit/after/` hold `lighthouse.json` (full report), `axe.json`, `summary.json` and `mobile.png`. `audit/cls-throttled.json` holds the throttled CLS runs.

**Note 1, LCP.** The rebuild's LCP element is the hero photograph, served as a small AVIF and requested at high priority. On this machine Lighthouse records a first paint of about 2.0 to 2.3 s even for the static legacy page, which paints nothing more than HTML and CSS. That delay comes from the local environment, not the page, and it feeds the simulated LCP. The 3.9 s is reported as measured. Re-run `npm run audit` against the deployed URL, or PageSpeed Insights, before claiming the 2.5 s target.

**Note 2, CLS.** Lighthouse's simulated mode loads the page unthrottled, so image dimensions arrive before first paint and no shift is recorded. `scripts/measure-cls.mjs` loads each page under real network throttling (400 ms RTT, 1.6 Mbps, cache disabled, 390 px wide) three times. The legacy page shifted by 0.400 on every run; the rebuild shifted by 0.000 on every run.

**Note 3, INP.** INP needs real user interactions, so a Lighthouse navigation run cannot measure it. Total Blocking Time is the standard lab proxy and is reported under that name. An early build of the rebuild measured 4.3 s of TBT because the Zod schema library (97 KB gzipped) shipped with the home page. The booking draft and the newsletter validation now load it on demand. Across the median runs recorded on this machine, TBT has ranged from 96 ms to 298 ms; the legacy page, whose code did not change, moved from 113 ms to 268 ms over the same period, so local machine load is a large part of the spread. What remains is mostly React hydration. Treat the 200 ms target as unverified until it is measured on the deployed site.

## Defect log

Severity: Critical, High, Medium, Low. Reproduce on a phone or at 390 px wide unless noted.

| ID | Sev | Category | Defect | How to reproduce | Business impact | Fix in the rebuild |
|---|---|---|---|---|---|---|
| L-01 | Critical | Responsive | Fixed 980 px container behind a `width=device-width` viewport tag | Open `/before` at 390 px: the page scrolls sideways by **590 px** (measured) | Most visitors are on phones and see a broken, zoomed page | Fluid 12/6/4 column layout, container max 1296 px with 20/48 px gutters; 0 px overflow at 390 and 1440 (measured) |
| L-02 | Critical | Functionality | Contact form posts nowhere. The "Send Message" script clears the form and does nothing else (`scripts.js`, marked TODO) | Fill the form, press Send Message: the fields empty, nothing is sent, no message appears | Every enquiry is silently lost | Replaced by a real booking flow plus a newsletter form. Both are validated by shared Zod schemas on the client and again in the route handler, with loading, success and inline error states |
| L-03 | High | Performance | Hero is the original 3183x4774 JPEG, **2.82 MB**, no lazy loading, no modern format. The PRD estimated 4.2 MB; the real file is 2.82 MB and the whole page weighs 4.41 MB | Lighthouse: LCP 22.8 s, page weight 4.41 MB | A 20 s wait for the main image on mobile data; many visitors leave first | `next/image` with AVIF/WebP, correct `sizes`, hero fetched at high priority, everything else lazy. Page weight 0.46 MB, LCP 3.9 s (note 1) |
| L-04 | High | Accessibility | All five buttons are `<div onclick>` with no role, no `tabindex` and `outline: none` | Tab through the page: focus reaches the links, inputs and textarea but never "Get A Quote", the three "Book Now" or "Send Message" (verified with Playwright) | Keyboard and switch users cannot contact or book at all | Real `<button>` and `<a>` elements everywhere, a visible 2 px accent focus ring, a skip link, and a focus-trapped booking dialog that returns focus to its trigger on close (verified) |
| L-05 | High | Accessibility | Placeholder used as the only label. The page has **0** `<label>` elements | Start typing in any field: its label disappears | Error-prone for everyone, unusable with a screen reader | Labels above inputs, helper text and errors below, linked with `aria-describedby`, `aria-invalid` on error, errors paired with an icon so colour is not the only signal |
| L-06 | High | Functionality | No booking at all; "Book Now" opens an `alert()` asking visitors to phone. The phone number is plain text, **0** `tel:` links | Press any "Book Now"; try tapping the number on a phone | Bookings only in opening hours, only by phone | A five-step booking flow (package, day, drop-off time, details, deposit) with live availability through the scheduling provider, a Stripe test-mode deposit, and a confirmation page with a reference. Phone number is a `tel:` link in the nav, location and footer |
| L-07 | Medium | Performance | Carousel and service images have no width or height | Throttled load (note 2): **CLS 0.400**; Lighthouse also fails "Image elements have explicit width and height" | Content jumps as images arrive, causing mis-taps | Every image has explicit dimensions or a sized container; throttled CLS 0.000, Lighthouse CLS 0.013 |
| L-08 | Medium | Accessibility | Body text `#9a9a9a` on white (about 2.8:1) | axe `color-contrast`: **12 nodes** | Hard to read for many people, especially outdoors | Tokens checked against WCAG AA before use. The PRD's `ink-faint` #868A8F failed at 3.1:1 and was darkened to #5F6369. axe reports 0 violations |
| L-09 | Medium | SEO | Title is "Home"; no meta description, no Open Graph tags, no favicon (the browser's `/favicon.ico` request returns 404, logged as a console error) | View source; Lighthouse `meta-description` and `errors-in-console` fail | Poor search snippets, blank link previews, no tab icon | Descriptive title template, meta description, Open Graph and Twitter tags with a 1200x630 image, SVG favicon from the brand files. SEO 100 |
| L-10 | Medium | Functionality | jQuery carousel only responds to clicks on 40 px arrows: no swipe, no keyboard, and it auto-advances every 6 s | Try to swipe the slider on a phone | Main imagery is fiddly on the devices most visitors use | Carousel removed. The before/after comparison slider supports pointer drag (mouse, pen, touch), arrow keys, Home and End, with `role="slider"` and live `aria-valuenow`. The testimonial rail uses native scroll-snap and swipes |
| L-11 | Low | Functionality | "Gallery" and "Reviews" nav links point to `#` | Click either: nothing happens | Looks broken, erodes trust | Every nav link targets a real section; the rebuild has no placeholder links |
| L-12 | Low | SEO | No `sitemap.xml` or `robots.txt` in the legacy site | List `legacy/`: neither file exists | Slower, less complete indexing | `app/sitemap.ts` and `app/robots.ts` generate both. Because they are served at the domain root, they now also cover `/before`, so the legacy half of this repo can no longer show this defect live |

### Additional findings from the automated scan

These were not in the planned list. axe found them, so they are logged the way a real audit would log them.

| ID | Sev | Category | Defect | Evidence | Fix |
|---|---|---|---|---|---|
| A-01 | High | Accessibility | Images have no `alt` text | axe `image-alt` (critical): 3 nodes | Every meaningful image has descriptive alt text; decorative avatars use `alt=""` next to the visible name |
| A-02 | Medium | Accessibility | `<html>` has no `lang` attribute | axe `html-has-lang` (serious) | `<html lang="en">` |
| A-03 | Low | Accessibility | No `<main>` landmark | Lighthouse `landmark-one-main` | Semantic `header`, `nav`, `main`, `section` (each labelled by its heading) and `footer` |

## How to reproduce the evidence

```bash
npm run build && npm start                  # production build, port 3000
node scripts/audit.mjs --label before --path /before --runs 5
node scripts/audit.mjs --label after  --path /       --runs 5
node scripts/measure-cls.mjs http://localhost:3000/before http://localhost:3000/
```

On Git Bash for Windows, run `export MSYS_NO_PATHCONV=1` first so `/before` is not rewritten into a Windows path.
