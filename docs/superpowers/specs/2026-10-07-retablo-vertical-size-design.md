# Retablo Vertical Size Design

## Goal

Make the retablo taller and give its section more vertical presence without widening it or changing its inner content.

## Design

Add responsive minimum heights to the existing `RetabloWrapper` root: approximately 700px on mobile and 900px on desktop. Keep its existing width and max-width classes unchanged. The culture section already has a desktop minimum height of one viewport; do not change its layout, padding, text, inner image, or door animation. The wrapper's current flex layout should distribute the added vertical space to the retablo frame and doors.

## Verification

- Update the focused RetabloWrapper test to assert the two minimum-height classes and unchanged width limits.
- Run the focused test, lint, and production build.
