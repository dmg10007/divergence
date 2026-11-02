import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { julyCrisis1914 } from "./july-crisis-1914";

const FIRST_FORK_ID = "july-crisis-aftermath-1914";

const allSeeds = julyCrisis1914.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("julyCrisis1914", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(julyCrisis1914)).toEqual(julyCrisis1914);
    expect(julyCrisis1914.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(julyCrisis1914);
    expect(moment.scenarioId).toBe("july-crisis-1914");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "halt-in-belgrade",
      "british-early-deterrence",
      "russian-localized-mobilization",
      "german-east-only-deployment",
      "sarajevo-princip-misses",
      "italian-triple-alliance-entry",
      "kaiser-tsar-willy-nicky-alliance",
      "schlieffen-lightning-capture-paris",
    ]);
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

  it("makes the first fork available from the start", () => {
    expect(julyCrisis1914.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(julyCrisis1914.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(julyCrisis1914, { basicChoiceId: "halt-in-belgrade" });
    const resolved = resolveDecision(initial, julyCrisis1914, { forkId: FIRST_FORK_ID, choiceId: "halt-at-belgian-frontier" });

    expect(deriveEvents(resolved, julyCrisis1914).map(({ id }) => id)).toEqual([
      "evt-1914-halt-belgrade",
      "evt-1914-halt-belgium",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(julyCrisis1914, { basicChoiceId: "historical-mobilization" });
    const resolved = resolveDecision(initial, julyCrisis1914, { forkId: FIRST_FORK_ID, choiceId: "halt-at-belgian-frontier" });

    expect(resolved.causalFactorValues).toEqual({
      "great-power-escalation": -2,
      "diplomatic-mediation-runway": 2,
      "alliance-automaticity": 0,
      "balkan-containment": 0,
    });
  });
});
