# Retablo Center and Door Height Design

## Goal

Reduce the oversized lower wooden area while keeping the retablo tall and making its center panel and both doors the same height.

## Design

Adjust only the `RetabloWrapper` layout geometry. The central content panel and both door leaves should occupy the same full vertical area beneath the pediment; keep the bottom wooden surround limited to its existing frame border. Preserve the existing responsive width, minimum retablo heights, entrance-image split, inner-door artwork, content, and opening animation. Do not modify the page section or the inner content layout.

## Verification

- Add focused regression assertions that center panel and door leaves share the intended full-height container and that the oversized bottom gap is not introduced by a separate spacer.
- Preserve existing width, min-height, entrance-image, inner-artwork, and animation assertions.
- Run focused tests, lint, and a production build.
