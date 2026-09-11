export function shouldRevealNextCategory(
  activeIndex: number,
  categoryCount: number,
  activeRight: number,
  containerRight: number,
  threshold = 8,
) {
  return activeIndex < categoryCount - 1 && activeRight >= containerRight - threshold;
}