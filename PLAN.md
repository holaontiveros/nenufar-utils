# Nenúfar Apps — Glass Wrap v1 Plan

## Goal

Build a browser-only utilities hub for Nenúfar Regalos Personalizados. Its first
tool, Glass Wrap, generates a print-accurate SVG cut outline for wrapping a
straight or conical glass. A user enters measurements in millimeters, reviews a
live preview, and downloads the resulting SVG.

The first release intentionally has no server, accounts, persistence, printing
workflow, design editor, material presets, or support for inches.

## Confirmed product decisions

- Input is manual, through clear, understandable fields.
- All measurements and exported SVG dimensions use millimeters.
- The required inputs are the top and bottom perimeter or diameter, plus glass
  height. Perimeter is the default so users can measure around the glass with
  a flexible tape. One selector switches both edge measurements together.
- Switching between perimeter and diameter converts current entries without
  changing the physical wrap or glass height. Perimeters are divided by `π`
  after unit normalization; the geometry module continues to consume diameters
  in millimeters.
- Equal top and bottom diameters mean a straight glass; no separate shape
  selector is needed.
- Different diameters mean a conical frustum.
- The SVG represents the full wrap template at physical size for 100% printing.
- The SVG contains cut/outline guides only; it has no measurement labels or
  alignment marks.
- The user can choose whether the preview and downloaded SVG are contour-only
  or filled with Nenúfar pink; contour-only is the default.
- The apps hub and every utility support English and Spanish only. They start
  in Spanish for an `es` browser locale and English for every other locale; the
  shared-header language selector can change the current page and follows
  navigation during the current browser session without becoming a long-term
  preference.
- The user can download the selected template as SVG or as a 300 DPI PNG whose
  dimensions and PNG resolution metadata preserve its physical millimeter size.
- Measurements can be entered in millimeters or centimeters. Millimeters are
  the default, and changing units converts entered values while preserving the
  underlying physical dimensions.
- Every physical-measurement utility uses the same mm/cm selector and displays
  inputs, presets, and calculated dimensions in the selected unit while
  retaining millimeters for domain calculations.
- The UI will migrate to Arrow.js tool by tool, beginning with browser-level
  parity tests. Existing domain modules remain framework-independent, and no
  tool's imperative UI is removed until Arrow.js matches current behavior.
- Preview and exported artwork are rotated 90° into the intended orientation;
  this swaps SVG/PNG page width and height without changing the cut shape's
  physical dimensions.
- A glue tab is optional and disabled by default, for sticker-paper wraps.
- When enabled, the glue tab is a fixed 10 mm wide edge extension.
- The app offers a live preview before export.
- v1 is a web app, runs entirely in the browser, and stores no data.
- The initial platform target is the web browser rather than a native Tauri
  application.
- The repository root serves a small utility index, and every utility has a
  stable path below the shared `apps.nenufar.mx` domain.
- Every utility and the hub use a shared Nenúfar header with the color logo and
  centered Apps and Shop navigation, plus a language selector, styled
  consistently with the main ecommerce site.
- Sticker Counter is a browser-only calculator and visualizer for arranging
  identical stickers on vinyl rolls. It defaults to Nenúfar's 480 mm width and
  also accepts a custom width. It does not generate a print or VersaWorks
  layout file.
- Sticker Counter supports circles, squares, and uploaded PNGs. A PNG keeps
  its complete rectangular canvas, including transparent padding; its selected
  size applies to the longest side while preserving aspect ratio.
- Sticker size quick options represent 3, 4, 5, 6, and 7 cm, with a manual
  size option; all appear in the selected mm/cm unit. PNGs can restore their
  embedded physical size, using 300 DPI when no PNG resolution metadata is
  present.
- Gap quick options represent 3, 4, 5, and 6 mm, with a manual option. The
  only spacing is between stickers: no outer roll margins are reserved. The
  default is 4 mm.
- Print-length quick options represent 0.5, 1, 1.5, and 2 m, with a manual
  option; all appear in the selected mm/cm unit. The default is 1 m.
  The overview renders the whole sheet only through 2 m; longer custom sheets
  show a capped overview and retain a zoomed sticker-inspection mode.
- The count includes only complete stickers. Items are placed left to right,
  then top to bottom, as a VersaWorks-style grid.

## Scope and user flow

1. The user opens the single-page app.
2. They enter positive top perimeter, bottom perimeter, and height values in mm
   or cm, or switch the measurement selector to diameter.
3. The app validates the values as they are entered and explains any problem in
   plain language.
4. It identifies the shape as straight when the diameters are equal; otherwise
   it creates the developed surface of a conical frustum.
5. The user optionally enables the 10 mm glue tab.
6. The preview updates from the same SVG geometry used for export.
7. The user downloads the SVG, whose `width`, `height`, and `viewBox` preserve
   physical millimeter dimensions.

## Geometry contract

The implementation must keep SVG construction separate from measurement
validation and geometry calculation.

### Straight glass

- Body: a rectangle.
- Width: `π × diameter`.
- Height: entered glass height.
- Optional tab: a 10 mm-wide extension on one vertical edge.

### Conical glass

- Body: the annular sector that develops from the frustum defined by top
  diameter, bottom diameter, and axial height.
- The two curved boundaries correspond to the top and bottom circumferences;
  the two radial edges meet at the cone apex when extended.
- Use numerically stable calculations and a clear near-equal-diameter fallback
  to the straight-glass rectangle so very shallow tapers do not create invalid
  geometry.
- The optional tab follows one joining edge and adds 10 mm of gluing allowance
  without altering the physical wrap body.

The calculator returns a small, typed geometry model. The SVG renderer consumes
that model and is the only code that emits SVG paths, dimensions, and cut-line
styling. This keeps preview and download identical and avoids duplicated math.

## Implementation plan

### 1. Establish the web app foundation

- Set up a small TypeScript browser app with a local development command, build
  command, and test runner.
- Keep dependencies minimal. Do not add routing, state libraries, a backend, or
  a component system unless the implementation demonstrably needs one.
- Use semantic, accessible form controls and responsive layout that remains
  understandable at common desktop widths.

### 2. Implement the domain layer test-first

- Define measurement and geometry types in a framework-independent module.
- Add tests before implementation for valid straight, valid conical, and invalid
  measurements.
- Test the key invariants: positive dimensions; rectangle circumference for a
  straight glass; matching top/bottom arc lengths for a conical glass; physical
  SVG dimensions in mm; and tab disabled/enabled behavior.
- Include near-equal diameter and small/large valid measurement cases to protect
  against division-by-zero and floating-point failures.

### 3. Render one canonical SVG

- Generate the SVG from the domain geometry once and reuse that output for the
  on-page preview and downloaded file.
- Set explicit millimeter dimensions and an appropriate `viewBox`.
- Draw only the required outer cut outline, with an optional filled cut area;
  no labels, registration marks, or decorative content.
- Make the download filename predictable and generate it client-side.

### 4. Build the user interface

- Default to “Top perimeter (mm)”, “Bottom perimeter (mm)”, and “Glass height
  (mm)”. A Perimeter/Diameter selector updates the edge labels, instructions,
  examples, and validation messages; all measurements follow the selected unit.
- Explain how to measure around the outside with a flexible tape in perimeter
  mode, or across the center in diameter mode. Matching edge measurements create
  a straight wrap and different values create a conical wrap.
- Provide an unchecked “Add 10 mm glue tab” control.
- Update the preview and export availability as inputs become valid.
- Keep validation messages close to the relevant fields and prevent exporting
  invalid geometry.

### 5. Verify and document

- Run the full automated test suite and production build.
- Manually inspect representative straight and conical previews, with and
  without tabs, including the generated SVG attributes and path boundaries.
- Document local run, test, and build commands in the project README.

## Acceptance criteria

- A user can create and download a full-wrap SVG from valid mm measurements.
- Perimeter is selected initially. Equivalent perimeter and diameter inputs
  produce identical previews and exports; switching modes or units preserves
  physical size, empty fields, and glass height (apart from unit conversion).
- Equal diameters produce a rectangular wrap; unequal diameters produce a
  conical developed-surface outline.
- The downloaded SVG has physical mm dimensions and has the same geometry as the
  preview.
- The tab is absent by default and, when enabled, adds exactly 10 mm along one
  joining edge.
- Invalid, missing, zero, or negative values cannot be exported.
- Automated tests cover domain calculations and SVG output invariants.
- The project build and tests pass.

## Deliberate non-goals for v1

- Inches and unit conversion.
- Saving, history, accounts, collaboration, or cloud storage.
- Templates, artwork placement, colors, text, logos, or print-job management.
- Variable tab widths, multiple tabs, or adhesive/material recommendations.
- Native desktop packaging, including Tauri.
- Server-side generation or any external service.
