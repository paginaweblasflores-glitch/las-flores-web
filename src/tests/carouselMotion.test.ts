import { describe, expect, it } from "vitest";
import { advanceCarouselMotion, type CarouselMotionState } from "../lib/carouselMotion";

describe("timed carousel motion", () => {
  it("holds the current group for five seconds before starting the transition", () => {
    const initial: CarouselMotionState = { phase: "pause", elapsedMs: 0, offset: 0 };
    const beforePauseEnds = advanceCarouselMotion(initial, 4_999, 1_000, 200);
    const pauseEnds = advanceCarouselMotion(beforePauseEnds.state, 1, 1_000, 200);

    expect(beforePauseEnds.scrollLeft).toBe(0);
    expect(beforePauseEnds.state.phase).toBe("pause");
    expect(pauseEnds.state.phase).toBe("transition");
    expect(pauseEnds.scrollLeft).toBe(0);
  });

  it("moves by exactly two card strides over two seconds", () => {
    const initial: CarouselMotionState = { phase: "pause", elapsedMs: 0, offset: 0 };
    const transition = advanceCarouselMotion(initial, 5_000, 1_000, 200);
    const halfway = advanceCarouselMotion(transition.state, 1_000, 1_000, 200);
    const complete = advanceCarouselMotion(halfway.state, 1_000, 1_000, 200);

    expect(halfway.scrollLeft).toBe(100);
    expect(complete.scrollLeft).toBe(200);
    expect(complete.state).toEqual({ phase: "pause", elapsedMs: 0, offset: 200 });
  });

  it("wraps to the start of the duplicated track without stopping at the end", () => {
    const initial: CarouselMotionState = { phase: "pause", elapsedMs: 0, offset: 900 };
    const transition = advanceCarouselMotion(initial, 5_000, 1_000, 200);
    const halfway = advanceCarouselMotion(transition.state, 1_000, 1_000, 200);
    const complete = advanceCarouselMotion(halfway.state, 1_000, 1_000, 200);

    expect(halfway.scrollLeft).toBe(0);
    expect(complete.scrollLeft).toBe(100);
  });
});
