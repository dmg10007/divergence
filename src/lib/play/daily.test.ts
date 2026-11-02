import { beforeEach, describe, expect, it } from "vitest";
import {
  getDayNumber,
  getDailyDateString,
  getDailyDilemma,
  recordDailyCompletion,
  _resetDailyMemoryForTesting,
} from "./daily";

describe("Daily Fracture Challenge", () => {
  beforeEach(() => {
    _resetDailyMemoryForTesting();
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("calculates deterministic day numbers and date strings", () => {
    const fixedDate = new Date("2026-11-02T12:00:00Z");
    const dayNumber = getDayNumber(fixedDate);
    const dateString = getDailyDateString(fixedDate);

    expect(dayNumber).toBe(33);
    expect(dateString).toBe("2026-11-02");
  });

  it("produces a coherent daily dilemma with two distinct pivots and realistic community split", () => {
    const fixedDate = new Date("2026-11-02T12:00:00Z");
    const dilemma = getDailyDilemma(fixedDate);

    expect(dilemma.dayNumber).toBe(33);
    expect(dilemma.moment.scenarioId).toBeDefined();
    expect(dilemma.featuredPivot).toBeDefined();
    expect(dilemma.alternativePivot).toBeDefined();
    expect(dilemma.featuredPivot.id).not.toBe(dilemma.alternativePivot.id);
    expect(
      dilemma.communitySplit.featuredPercent + dilemma.communitySplit.alternativePercent,
    ).toBe(100);
  });

  it("increments streaks accurately for consecutive daily play", () => {
    const day1 = "2026-11-01";
    const day2 = "2026-11-02";

    const s1 = recordDailyCompletion(day1);
    expect(s1.streak).toBe(1);
    expect(s1.hasPlayedToday).toBe(true);

    const s2 = recordDailyCompletion(day2);
    expect(s2.streak).toBe(2);
  });
});
