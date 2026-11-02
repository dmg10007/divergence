import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { midway1942 } from "./midway-1942";

const allEvents = [
  ...midway1942.basicChoices.flatMap(({ narrativeEvents }) => narrativeEvents),
  ...midway1942.decisionForks.flatMap(({ choices }) => choices.flatMap(({ narrativeEvents }) => narrativeEvents)),
];

const allSeeds = midway1942.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("midway1942", () => {
  it("conforms to the formal scenario contract schema", () => {
    expect(scenarioSchema.parse(midway1942)).toEqual(midway1942);
    expect(midway1942.id).toBe("midway-1942");
    expect(midway1942.eventPackId).toBe("wwii-pacific");
  });

  it("classifies only historical events as documented fact", () => {
    const historicalChoice = midway1942.basicChoices.find((c) => c.id === "historical-midway");
    expect(historicalChoice?.narrativeEvents.every((e) => e.classification === "documented-fact")).toBe(true);

    const counterfactualChoices = midway1942.basicChoices.filter((c) => c.id !== "historical-midway");
    counterfactualChoices.forEach((choice) => {
      expect(choice.narrativeEvents.every((e) => e.classification === "plausible-projection")).toBe(true);
    });
  });

  it("ensures consequence seed classifications decay properly across horizons", () => {
    allSeeds.forEach((seed) => {
      if (seed.horizon === "aftermath") {
        expect(["direct-inference", "plausible-projection"]).toContain(seed.classification);
      } else if (seed.horizon === "decade") {
        expect(["plausible-projection", "highly-speculative"]).toContain(seed.classification);
      } else if (seed.horizon === "present") {
        expect(seed.classification).toBe("highly-speculative");
      }
    });
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(midway1942);
    expect(moment.scenarioId).toBe("midway-1942");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "early-japanese-reconnaissance",
      "retained-combat-air-patrol",
      "immediate-spruance-strike",
      "fletcher-concentrated-fleet",
      "yamamoto-battleship-advance",
      "midway-island-radar-warning",
      "total-pacific-fleet-carrier-annihilation",
      "yamamoto-aleutian-alaska-invasion",
    ]);
  });

  it("applies authored causal factor deltas upon simulation and fork resolution", () => {
    const initial = initializeSimulation(midway1942, { basicChoiceId: "early-japanese-reconnaissance" });
    const resolved = resolveDecision(initial, midway1942, {
      forkId: "spruance-evening-decision-1942",
      choiceId: "turn-east-evasion",
    });

    expect(resolved.causalFactorValues["us-pacific-carrier-strength"]).toBe(1);
    expect(resolved.causalFactorValues["hawaiian-islands-security"]).toBe(1);
  });

  it("spells out United States in all event and seed texts without U.S. abbreviation", () => {
    allEvents.forEach((event) => {
      expect(event.summary).not.toContain("U.S.");
    });
    allSeeds.forEach((seed) => {
      expect(seed.summary).not.toContain("U.S.");
    });
  });
});
