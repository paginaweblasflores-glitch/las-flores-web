# Altitude Badge Design

## Goal

Make each product's altitude visually consistent with the season badge in the
Tesoros de Ayacucho cards.

## Design

Render the altitude directly below the season as a second pill badge. Reuse the
season badge's visual classes: small bold uppercase text, translucent dark
background with backdrop blur, subtle border, rounded-full shape, and matching
horizontal and vertical padding. The altitude badge contains only the altitude
value, for example `2.500 m s. n. m.`; it does not add a “Nivel del mar:” prefix.

Keep both badges in the existing details container so they retain its current
desktop hover reveal and mobile visibility. Preserve the existing season text,
product title, card layout, and animation.

## Alternatives considered

1. **Match the existing badge styling (selected):** minimal change and consistent
   appearance.
2. Keep altitude as plain text with only approximate styling: less consistent.
3. Introduce a shared badge component: unnecessary abstraction for this focused
   visual adjustment.

## Validation

Update the focused Tesoros regression test to assert that altitude follows the
season and uses the same badge styling. Run that test and the production build.
