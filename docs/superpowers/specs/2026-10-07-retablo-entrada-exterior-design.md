# Retablo Entrance Image Design

## Goal

Show `/retablo/entrada.png` across both visible outer door faces when the retablo is closed.

## Design

Use the same image as a background on the two existing outer door faces. Size it to twice one leaf's width, align the left leaf to the left half and the right leaf to the right half, and remove only the outer-face logo/decorative contents that would cover it. Preserve the outer framing where possible. Do not change either inner door face, the door animation, its trigger, or the retablo content.

## Verification

- Add a focused test asserting both outer faces use the shared entrance image and split positioning.
- Assert inner door image markup and animation-related markup remain present.
- Run the focused retablo test, lint, and production build.
