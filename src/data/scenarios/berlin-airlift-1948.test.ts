import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { berlinAirlift1948 } from "./berlin-airlift-1948";

const allEvents = [
  ...berlinAirlift1948.basicChoices.flatMap(({ narrativeEvents }) => narrativeEvents),
  ...berlinAirlift1948.decisionForks.flatMap(({ choices }) => choices.flatMap(({ narrativeEvents }) => narrativeEvents)),
];

const allSeeds = berlinAirlift1948.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("berlinAirlift1948", () => {
  it("conforms to the formal scenario contract schema", () => {
    expect(scenarioSchema.parse(berlinAirlift1948)).toEqual(berlinAirlift1948);
    expect(berlinAirlift1948.id).toBe("berlin-airlift-1948");
    expect(berlinAirlift1948.eventPackId).toBe("cold-war");
  });

  it("classifies only historical events as documented fact", () => {
    const historicalChoice = berlinAirlift1948.basicChoices.find((c) => c.id === "historical-airlift");
    expect(historicalChoice?.narrativeEvents.every((e) => e.classification === "documented-fact")).toBe(true);

    const counterfactualChoices = berlinAirlift1948.basicChoices.filter((c) => c.id !== "historical-airlift");
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
    const moment = buildMoment(berlinAirlift1948);
    expect(moment.scenarioId).toBe("berlin-airlift-1948");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "armored-convoy-breakthrough",
      "negotiated-berlin-concession",
      "spree-canal-flotilla",
      "four-power-currency-compromise",
      "atomic-b29-deployment",
      "tegel-airfield-rapid-build",
      "tempelhof-air-corridor-dogfight-war",
      "berlin-communist-unification-coup",
    ]);
  });

  it("applies authored causal factor deltas upon simulation and fork resolution", () => {
    const initial = initializeSimulation(berlinAirlift1948, { basicChoiceId: "armored-convoy-breakthrough" });
    const resolved = resolveDecision(initial, berlinAirlift1948, {
      forkId: "soviet-interception-response-1948",
      choiceId: "unarmed-air-corridors",
    });

    expect(resolved.causalFactorValues["superpower-military-friction"]).toBe(-1);
    expect(resolved.causalFactorValues["western-berlin-resolve"]).toBe(1);
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
