import { describe, expect, it } from "vitest";
import { calculateDivergence } from "./divergence";

describe("calculateDivergence", () => {
  it("returns 0% divergence for historical baseline choices", () => {
    const historicalDunkirk = calculateDivergence({ choiceId: "historical" });
    expect(historicalDunkirk.score).toBe(0);
    expect(historicalDunkirk.severity).toBe("subtle");

    const historicalCuba = calculateDivergence({ choiceId: "historical-discovery" });
    expect(historicalCuba.score).toBe(0);
  });

  it("calculates elevated divergence for counterfactual choices", () => {
    const result = calculateDivergence({
      choiceId: "no-halt-order",
      factorValues: { "evacuation-capacity": -2, "allied-trained-force": -1 },
      resolvedForkCount: 1,
    });

    expect(result.score).toBeGreaterThanOrEqual(74);
    expect(result.badge).toContain("⚡");
  });

  it("scales divergence when decision forks are resolved", () => {
    const low = calculateDivergence({
      choiceId: "delayed-discovery",
      factorValues: { "escalation-risk": 1 },
      resolvedForkCount: 0,
    });

    const high = calculateDivergence({
      choiceId: "delayed-discovery",
      factorValues: { "escalation-risk": 3, "soviet-face-saving-room": -2 },
      resolvedForkCount: 3,
    });

    expect(high.score).toBeGreaterThan(low.score);
    expect(high.score).toBeLessThanOrEqual(96);
  });

  it("produces distinct, dynamic scores across different plausible alternative choices rather than a flat number", () => {
    const choiceA = calculateDivergence({
      choiceId: "stuart-early-reconnaissance",
      tier: "plausible-alternative",
      affectedFactorIds: ["confederate-tactical-initiative"],
    });

    const choiceB = calculateDivergence({
      choiceId: "foreign-diplomatic-recognition",
      tier: "plausible-alternative",
      affectedFactorIds: ["foreign-diplomatic-recognition", "confederate-tactical-initiative", "union-defensive-integrity"],
      speculativeSeedCount: 2,
    });

    // Choices should not have the same flat score
    expect(choiceA.score).not.toBe(choiceB.score);
    // Choice B has broader factor breadth and speculative reach
    expect(choiceB.score).toBeGreaterThan(choiceA.score);
    // Plausible alternatives stay within their calibrated spectrum
    expect(choiceA.score).toBeGreaterThanOrEqual(42);
    expect(choiceB.score).toBeLessThanOrEqual(78);
  });

  it("assigns high-tier radical and extreme divergence to extreme-divergence choices", () => {
    const extremeChoice = calculateDivergence({
      choiceId: "full-scale-thermonuclear-holocaust",
      tier: "extreme-divergence",
      affectedFactorIds: ["nuclear-escalation-threshold", "strategic-retaliation-speed"],
      speculativeSeedCount: 2,
    });

    expect(extremeChoice.score).toBeGreaterThanOrEqual(88);
    expect(extremeChoice.severity).toBe("extreme");
    expect(extremeChoice.badge).toBe("⚡ Extreme Divergence");
    expect(extremeChoice.label).toBe("Existential Reality Reordering");
  });
});
