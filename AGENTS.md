# Working Agreement

## Product focus

This repository is a browser-only utilities hub for Nenúfar Regalos
Personalizados. Each utility lives in `site/<utility-slug>/` and is deployed at
`/<utility-slug>/`. The first utility is a generator for print-accurate SVG
templates that wrap straight and conical glasses.

Read `PLAN.md` before proposing or implementing work. Treat its confirmed
decisions and non-goals as the current product boundary.

Keep root-level `site/index.html` as the concise directory of available
utilities. Add a new utility only when it has a stable slug, a direct entry in
that directory, and focused tests beneath `test/<utility-slug>/`.

Sticker Counter lives in `site/sticker-counter/`. Default its usable vinyl
width to 480 mm, while allowing a custom width; keep both widths, the
complete-sticker count, and the left-to-right/top-to-bottom grid calculation in
a browser-independent module. Keep its full-sheet overview capped at 2 m for
custom lengths while a separate inspection view represents the true sticker
cell size.

All pages use the shared Nenúfar header in `site/shared/header.js` and
`site/shared/header.css`. Configure its relative apps-hub and logo paths with
the header data attributes; use the color logo on this light header and retain
the white logo for future dark surfaces.

## Language

- Every user-facing page supports only English (`en`) and Spanish (`es`).
- Resolve the first-render language from the browser locale: `es` and `es-*`
  use Spanish; every other or unavailable locale uses English.
- Keep all visible strings, navigation labels, validation messages, dynamic
  states, and document metadata in each page's translation module. Do not
  duplicate translated strings in UI logic.
- The shared header must always show the language selector. Preserve a language
  change in browser session storage so it follows navigation between hub and
  utility pages, but do not persist it beyond the current browser session.

## Export

- SVG and PNG exports must use the same template geometry and selected
  contour/fill appearance.
- PNG exports use 300 DPI and include pixels-per-meter metadata derived from
  that resolution so physical dimensions remain available to print software.
- Keep the displayed and exported artwork in the intended rotated orientation.
  When rotating the SVG canvas, swap width and height while preserving the
  template geometry and physical size.

## Units

- Every utility with physical measurements accepts only millimeters and
  centimeters; default to millimeters.
- Normalize displayed measurements to millimeters before validation and domain
  calculation. Switching units must convert current manual entries without
  changing the physical result; quick presets retain their physical size.
- Display every numeric input, option, and calculated dimension using the
  selected unit. Reuse `site/shared/units.js`; do not duplicate conversion
  logic in utilities.

## Engineering principles

- **YAGNI:** implement only behavior required by the accepted plan. Do not add
  persistence, APIs, authentication, configuration layers, unit conversion,
  native packaging, or future-looking abstractions without an approved need.
- **DRY:** calculate geometry once in a framework-independent domain module.
  The preview and downloaded SVG must be generated from that same source of
  truth. Do not duplicate formulas or SVG path construction in UI code.
- **TDD:** for all geometry and export behavior, first add a failing test that
  captures the expected behavior or invariant, then implement the smallest
  change that makes it pass, then refactor while retaining coverage.

## Arrow.js migration

- Follow `ARROW_MIGRATION_PLAN.md` for the staged Arrow.js port.
- Start each tool port by adding browser-level characterization tests for the
  current behavior; retain the existing Node domain tests.
- Arrow owns reactive UI state and templates only. Domain, export, locale, and
  unit modules must remain framework-independent.
- Port one tool at a time and preserve public paths, native accessibility,
  language/session behavior, unit behavior, and download/upload outcomes.
- Do not remove legacy UI orchestration until the relevant parity suite passes
  and the tool has been manually checked in both languages.

## Domain rules

- Inputs are manual, in mm or cm, with perimeter selected by default and
  diameter available for both edges. Switching modes preserves physical size.
- Required values: top perimeter/diameter, bottom perimeter/diameter, glass
  height. Each must be finite and greater than zero. Normalize to millimeters
  and convert perimeter to diameter before passing values to the geometry module.
- Equal top and bottom diameters represent a straight glass and yield a
  rectangle with width `π × diameter`.
- Different diameters represent a conical frustum and yield its annular-sector
  development.
- Treat almost-equal diameters safely to avoid unstable division; use the
  straight geometry when the difference is within the documented tolerance.
- The body outline is the physical wrap. An enabled glue tab is a 10 mm joining
  allowance and must not change body dimensions.
- Glue tabs are disabled by default.
- Output must have physical SVG width and height in mm and a matching `viewBox`
  so it can print at 100% scale.
- v1 output contains only cut/outline guides, with an optional fill: no labels,
  alignment marks, or decorative artwork. The preview and downloaded SVG must
  use the same selected appearance.

## Code organization

- Keep validation and geometric calculations independent of browser and UI
  APIs.
- Have the SVG renderer consume typed domain geometry. It alone should create
  SVG markup and export dimensions.
- Keep UI components focused on inputs, accessible validation, preview display,
  and download interaction.
- Prefer clear names and small pure functions over speculative patterns.
- Use TypeScript strictness; avoid `any` and implicit fallback values in
  measurements or geometry.

## Tests and validation

Maintain focused tests for at least:

- valid straight and conical calculations;
- invalid/missing/non-finite/non-positive measurements;
- near-equal diameter stability;
- top and bottom circumference/arc-length invariants;
- enabled and disabled 10 mm tab behavior;
- exported SVG physical dimensions and `viewBox`.

Before handing off a change, run the relevant unit tests and production build.
For any change affecting SVG paths or sizing, manually inspect straight and
conical previews with and without the tab. Report commands or checks that could
not run, along with the reason.

## Change discipline

- Preserve unrelated user changes.
- Keep commits scoped to one coherent, tested outcome.
- Update `PLAN.md` only when an approved product decision changes.
- Explain trade-offs whenever a request expands v1 scope or conflicts with a
  documented rule.
