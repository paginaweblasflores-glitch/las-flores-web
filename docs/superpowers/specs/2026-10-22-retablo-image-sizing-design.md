# Retablo image sizing design

## Goal

Make the photograph in the home page's retablo more visible while preserving the existing wooden frame.

## Design

- Keep the outer frame's size, placement, color, texture, and shadow unchanged.
- Enlarge and center only the photograph to approximately 85% of the frame's inner width, leaving equal side margins.
- Preserve the image's 4:5 crop and `object-fit: cover`.
- Keep the existing viewport-height constraints so the image does not overlap the narrative or overflow on short screens.
- Do not change the retablo, its text, or its responsive section layout.

## Validation

Update the retablo layout regression test to verify the image-width rule and preserved frame treatment, then run the focused retablo tests.
