# Attribution

All photography is from [Unsplash](https://unsplash.com), used under the [Unsplash License](https://unsplash.com/license). Every file was downloaded once, cropped and converted to WebP with `sharp`, and is committed to this repository. Nothing is hotlinked. The site serves AVIF or WebP from these files through `next/image`.

| File | Used for | Photographer | Source |
|---|---|---|---|
| `public/images/hero-red-panel.webp` | Hero (cropped to exclude the car maker's badge and plate) | Pavol Duracka | https://unsplash.com/photos/JIE9mi-RTKQ |
| `legacy/img/hero.jpg` | Legacy hero (the same photograph, original and unoptimized on purpose) | Pavol Duracka | https://unsplash.com/photos/JIE9mi-RTKQ |
| `public/images/seats-before.webp` | Before/after slider, before | Dany Caiza | https://unsplash.com/photos/QhPAyB0zIdQ |
| `public/images/seats-after.webp` | Before/after slider, after | Dany Caiza | https://unsplash.com/photos/PO6cI2GhYxY |
| `public/images/service-correction.webp` | Paint Correction & Ceramic | Zac Nielson | https://unsplash.com/photos/CsZjHjFN3N8 |
| `public/images/service-foam.webp`, `legacy/img/foam.jpg` | Signature Detail | Sem Ramon | https://unsplash.com/photos/jVm9stv6UpE |
| `public/images/service-interior.webp`, `legacy/img/interior.jpg` | Interior Reset | Ivan Kazlouskij | https://unsplash.com/photos/_WynKVTnCC4 |
| `public/images/location-unit.webp` | Location | Yunfan Li | https://unsplash.com/photos/FB7QTOXs6q0 |
| `public/images/avatars/avatar-1.webp` | Testimonial avatar | Daniel Gamez | https://unsplash.com/photos/nVrPtMsssXk |
| `public/images/avatars/avatar-2.webp` | Testimonial avatar | Gift Habeshaw | https://unsplash.com/photos/dlbiYGwEe9U |
| `public/images/avatars/avatar-3.webp` | Testimonial avatar | Kuljeet Punia | https://unsplash.com/photos/eFGTJONYPqA |
| `public/images/avatars/avatar-4.webp` | Testimonial avatar | Luiz Pedro Maciel | https://unsplash.com/photos/3SjjPBTN1U0 |

The two seat photographs are a genuine before and after of the same car, published by the same photographer. They are not the work of Lacquer & Co., which is fictional. The people in the avatar photos are not the people named in the testimonials; those names and quotes are fictional.

## Map

`public/images/map-fallback.webp` is the static map shown when no Mapbox token is set. It was rendered once from OpenStreetMap tiles and tinted to the palette. Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License. The live map uses Mapbox GL JS and carries Mapbox and OpenStreetMap attribution in its own control.

## Brand and code

- Logo, mark and favicon (`public/brand/`, `app/icon.svg`): supplied by the project owner.
- `legacy/jquery-1.12.4.min.js`: jQuery, MIT License, © OpenJS Foundation.
- Fonts: Chivo, Barlow and Roboto Mono from Google Fonts (SIL Open Font License), self-hosted at build time by `next/font`.
