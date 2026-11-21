# Familias Las Flores Placement

## Goal

Restore the “Familia Las Flores” section on the restaurant history page immediately below “Recomendado por quienes nos visitan”.

## Final section order

1. Tres generaciones
2. Recomendaciones del chef
3. Recomendado por quienes nos visitan
4. Familia Las Flores
5. Ubicación y reservas

## Layout

Restore the existing family block:

- Green `eucalipto` background with white text.
- The team photo on the left at desktop size and full-width above the text on mobile.
- Desktop layout using twelve grid columns: photo spans eight columns and text spans four.
- Preserve the `NUESTRO EQUIPO` label, the “Familia Las Flores” heading, its description, and the “CONOCE A LA FAMILIA” button.
- The button continues to navigate to `/familia-las-flores`.

## Scope

This change is limited to the `/restaurante` route. It does not modify the family page or the existing customer and chef sections.

## Verification

Update the focused restaurant route test to verify that the family section follows the client testimonial section and that the route links to the family page.
