# Retablo Copy and Actions Layout Design

## Goal

Keep the retablo photograph and its narrative content together while giving the action buttons a distinct row at the bottom of the central panel.

## Approved layout

- **Desktop:** Keep the photograph in the left column and the full narrative block (eyebrow, heading, ornament, and paragraph) in the right column.
- **All sizes:** Place both action buttons together in a centered row beneath the photograph and narrative block, at the bottom of the central panel.
- **Mobile:** Stack the photograph above the narrative block to preserve readable widths; keep the shared button row beneath both.
- Preserve the existing wording, links, image, image framing, retablo dimensions, door artwork, and door animation.
- Limit implementation to the home-page retablo content layout. Do not modify other page sections.

## Implementation boundaries

The existing `RetabloWrapper` should remain responsible for the frame, doors, and animation. Adjust only the grid/layout classes of its home-page children in `src/routes/index.tsx`: the image and narrative stay as siblings in the content row, while the existing CTA group becomes a separate full-width row below them. Preserve responsive ordering as described above.

## Verification

- Add or update a focused regression test to verify the narrative and image remain in the same content row, with both CTAs in the following full-width row.
- Verify the responsive class structure supports side-by-side desktop content and stacked mobile content.
- Run the focused test, lint the touched files with the repository's established Prettier-rule workaround if needed, and run the production build.
