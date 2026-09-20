# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: owners of cars they care about (daily drivers kept well, enthusiast and weekend cars) looking for a specialist detailing studio. They arrive on a phone or laptop, compare packages and price, and want to book a drop-off slot without phoning.

Secondary (the real audience of the portfolio piece): Upwork clients hiring for "fix my website" and "integrate Stripe / booking / maps / email". They judge the before/after audit evidence and the working integrations.

## Product Purpose

Lacquer & Co. is a fictional premium auto detailing studio. The site sells three service packages and takes bookings end to end: service, date, time, details, deposit. It ships next to a deliberately broken legacy version (`/before`) and an `AUDIT.md` defect log, proving the ability to diagnose and fix an existing site, not only build a new one.

Success: a visitor understands the offer in one viewport, and can complete a booking (in demo or live mode) without dead ends; a hirer can verify the audit claims in thirty seconds.

## Positioning

"Your car, returned better than delivered." A specialist workshop, closer to a watchmaker than a car wash. Real before/after photography of the same seats (same car, same framing) carries the claim.

## Operating Context

- Booking is drop-off based: the customer picks a service, a date, and a drop-off time.
- Integrations run behind provider interfaces with honest demo fallbacks (Cal.com, Stripe test mode, Mapbox, Resend). The first build runs entirely in demo mode; keys are added later by the user.

## Capabilities and Constraints

- Light theme only. No dark-default sections, including photographic ones.
- No em-dash or en-dash characters in visible copy.
- One radius system: 10px cards/panels, 999px buttons/pills, 8px inputs.
- All imagery local, optimized, attributed (`ATTRIBUTION.md`). Never hotlinked.
- Stripe is test mode only and says so on the deposit step and in the footer. Card entry only on Stripe hosted Checkout.
- No real customer data stored. Demo bookings live in server memory.

Business details authored as fictional placeholders (to be reviewed by the user, see README):
- Address: Unit 3, 2150 W Carroll Ave, Chicago, IL 60612
- Phone: (312) 555-0148 (reserved fictional 555-01xx range)
- Hours: Tuesday to Saturday, 8:00 am to 6:00 pm. Closed Sunday and Monday.
- Packages: Signature Detail ($420, 6 h, $75 deposit), Paint Correction and Ceramic ($1,280, 2 days, $150 deposit), Interior Reset ($260, 4 h, $50 deposit).

## Brand Commitments

- Name: Lacquer & Co. Logo files supplied by the user (drop mark in burnt orange #C2410C with a steel #43586B secondary shape; wordmark in graphite #191A1C with an orange ampersand). Use them as supplied.
- Palette from PRD 5.1 (porcelain, graphite, burnt orange, steel). The user permits palette adjustments where it improves the result, and asked for rich colour.
- Type from PRD 5.2: Chivo (display), Barlow (body/UI), Roboto Mono (prices, slots, references).
- Voice: precise, craft-driven, confident, not aggressive. No flames, chrome, racing clichés.

## Evidence on Hand

- Logo set: `public/brand/` (from the user's Downloads, `lacquer-co-*`).
- Photography: Unsplash, sourced by Claude with the user's permission, listed in `ATTRIBUTION.md`.
- Testimonials, customer names and vehicles are fictional and the footer says the business is fictional. No real reviews, ratings, customer counts or awards may be invented beyond that.

## Product Principles

1. Nothing dead-ends: every failure path lands somewhere a customer can act from.
2. Honest demo: when an integration is in fallback, the UI says so plainly.
3. The booking draft survives refreshes and the Stripe round trip.
4. Evidence over claims: before/after audit numbers are measured, not asserted.

## Accessibility & Inclusion

WCAG AA contrast, Lighthouse accessibility 100, full keyboard traversal with visible focus rings, focus-trapped booking modal that restores focus, `prefers-reduced-motion` honoured.
