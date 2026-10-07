# Retablo Door Opening Design

## Goal

Make the retablo doors open from their center seam outward while preserving the existing 3D animation, automatic scroll trigger, and single entrance image spanning both leaves. The closed image must remain visually continuous at the center with no blank gap.

## Design

Keep the existing two-leaf CSS 3D animation and opening angles. Set the left leaf's transform origin to its outer left edge and the right leaf's transform origin to its outer right edge. Preserve the existing opposite rotation directions so the center edges swing outward. Keep each half of the shared image attached to its corresponding door face, and retain the border-free edges at the center seam.

Do not replace the 3D motion with a slide animation or alter the retablo's automatic opening trigger.

## Verification

- Add or update a focused regression assertion for the outer hinge origins and opening directions.
- Run the focused retablo test file.
- Run lint on the changed component and tests.
- Run a production build if the focused checks pass.
