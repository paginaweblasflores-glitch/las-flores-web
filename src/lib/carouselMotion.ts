export type CarouselMotionState =
  | { phase: "pause"; elapsedMs: number; offset: number }
  | { phase: "transition"; elapsedMs: number; from: number };

export const CAROUSEL_PAUSE_MS = 5_000;
export const CAROUSEL_TRANSITION_MS = 2_000;

export function advanceCarouselMotion(
  state: CarouselMotionState,
  elapsedMs: number,
  cycleWidth: number,
  stepWidth: number,
) {
  let remaining = Math.max(0, elapsedMs);
  let nextState = state;

  while (true) {
    if (nextState.phase === "pause") {
      const timeUntilTransition = CAROUSEL_PAUSE_MS - nextState.elapsedMs;
      if (remaining < timeUntilTransition) {
        const pausedState = { ...nextState, elapsedMs: nextState.elapsedMs + remaining };
        return { state: pausedState, scrollLeft: pausedState.offset };
      }

      remaining -= timeUntilTransition;
      nextState = { phase: "transition", elapsedMs: 0, from: nextState.offset };
      if (remaining === 0) return { state: nextState, scrollLeft: nextState.from };
      continue;
    }

    const timeUntilPause = CAROUSEL_TRANSITION_MS - nextState.elapsedMs;
    if (remaining < timeUntilPause) {
      const transitionElapsed = nextState.elapsedMs + remaining;
      const progress = transitionElapsed / CAROUSEL_TRANSITION_MS;
      const scrollLeft = (nextState.from + stepWidth * progress) % cycleWidth;
      return {
        state: { ...nextState, elapsedMs: transitionElapsed },
        scrollLeft: (scrollLeft + cycleWidth) % cycleWidth,
      };
    }

    const offset = (nextState.from + stepWidth) % cycleWidth;
    remaining -= timeUntilPause;
    nextState = { phase: "pause", elapsedMs: 0, offset: (offset + cycleWidth) % cycleWidth };
    if (remaining === 0) return { state: nextState, scrollLeft: nextState.offset };
  }
}
