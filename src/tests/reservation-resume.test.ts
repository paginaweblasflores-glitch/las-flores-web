import { describe, expect, it } from "vitest";
import { getReservationResumeState } from "../lib/reservationResume";

describe("getReservationResumeState", () => {
  it("restores the selected salon and advances to the reservation form", () => {
    const zones = [{ id: "terraza" }, { id: "jardin" }];

    expect(getReservationResumeState("terraza", zones)).toEqual({
      zone: zones[0],
      step: 1,
    });
  });

  it("does not advance when the saved salon no longer exists", () => {
    expect(getReservationResumeState("deleted-zone", [{ id: "terraza" }])).toBeNull();
  });
});
