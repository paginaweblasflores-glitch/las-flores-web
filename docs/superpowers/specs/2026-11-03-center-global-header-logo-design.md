# Center the global header logo

## Goal

Center the Las Flores logo on the viewport on every page using `SiteHeader`, regardless of different widths in the left and right header controls.

## Design

Keep the navigation menu and action controls anchored to their existing sides. Position the logo link at the horizontal midpoint of the viewport and translate it by half its own width. Preserve existing logo variants, click behavior, responsive sizing, and header styling.

## Verification

Add a focused regression assertion for the centered logo positioning in `SiteHeader`, then run its targeted test and the relevant lint or type validation.
