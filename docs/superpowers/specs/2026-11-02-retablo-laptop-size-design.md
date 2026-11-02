# Retablo laptop size design

## Goal

Keep the retablo at its previous size on laptop-width screens while retaining
the existing 2 cm pediment increase on larger screens.

## Design

Move the existing `min-width: 1440px` breakpoint for the +2 cm adjustment to
`min-width: 1600px`. Preserve all current CSS properties, measurements, and
other breakpoints. Update the focused test to assert the new threshold and
existing adjustment.

## Acceptance criteria

- Viewports below 1600 px retain the prior pediment size.
- At 1600 px and wider, the existing +2 cm adjustment remains aligned across
  pediment height, content padding, and frame clipping.
- No other layout or style changes are included.
- The focused retablo test and project checks pass.
