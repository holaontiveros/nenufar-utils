# Nenúfar Apps

This repository hosts small browser-based utilities by Nenúfar Regalos
Personalizados. Each utility has its own directory under `site/`, which maps
directly to its public URL path.

`site/shared/` contains the reusable Nenúfar header used by the hub and every
utility. It shows the color logo, centered Apps and Shop navigation, and a
language selector. User-facing content is available in English and Spanish.

## Arrow.js migration

The staged Arrow.js migration and behavior-parity test requirements are
documented in [ARROW_MIGRATION_PLAN.md](./ARROW_MIGRATION_PLAN.md).

## Available utilities

- `site/glass-wrap/` → `/glass-wrap/`: print-accurate SVG templates for
  straight and conical glasses.
- `site/sticker-counter/` → `/sticker-counter/`: a 480 mm vinyl layout
  visualizer and counter for identical circle, square, or PNG stickers.

## Use

Start a local server with:

```sh
npm run dev
```

Then open `http://localhost:8000/` or a utility directly, such as
`http://localhost:8000/glass-wrap/`. Enter the outside top perimeter, bottom
perimeter, and height in millimeters or centimeters. Use a flexible tape to
measure around the glass, or select Diameter to measure across it. Switching
measurement modes converts the entries while preserving the wrap's physical
size. Matching top and bottom measurements produce a straight rectangular
wrap; different measurements produce a developed conical wrap.

Enable the optional 10 mm glue tab when the wrap will be glued rather than
printed on sticker paper. The downloaded SVG includes real millimeter `width`
and `height` attributes for 100% printing.

## Check the calculator

```sh
npm test
```

The tests cover validation, straight and conical geometry, near-equal diameter
handling, the 10 mm tab, and SVG export dimensions.

Validate the static artifact that GitHub Pages uploads with:

```sh
npm run build
```

## GitHub Pages

The site is deployed from `site/` by the GitHub Actions workflow in
`.github/workflows/deploy-pages.yml`. In the repository’s **Settings → Pages**,
select **GitHub Actions** as the publishing source once. Future pushes to
`main` publish the current version automatically.

The intended production domain is `https://apps.nenufar.mx`, with utilities
available as paths below it, for example `https://apps.nenufar.mx/glass-wrap/`.
