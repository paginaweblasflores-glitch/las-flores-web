export function shouldRevealNextCategory(
  activeIndex: number,
  categoryCount: number,
  nextLeft: number,
  containerRight: number,
) {
  return activeIndex < categoryCount - 1 && nextLeft >= containerRight;
}