import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { sovietMoonLanding1969 } from "./soviet-moon-landing-1969";

const FIRST_FORK_ID = "lunar-aftermath-1969";

const allSeeds = sovietMoonLanding1969.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("sovietMoonLanding1969", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(sovietMoonLanding1969)).toEqual(sovietMoonLanding1969);
    expect(sovietMoonLanding1969.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(sovietMoonLanding1969);
    expect(moment.scenarioId).toBe("soviet-moon-landing-1969");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "n1-engine-cluster-success",
      "leonov-lunar-landing-may-1969",
      "apollo-11-landing-abort",
      "joint-us-soviet-lunar-treaty",
      "permanent-militarized-moon-race",
      "project-a119-lunar-detonation",
      "apollo-11-descent-explosion",
      "first-lunar-cislunar-battle",
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
    expect(sovietMoonLanding1969.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(sovietMoonLanding1969.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(sovietMoonLanding1969, { basicChoiceId: "n1-engine-cluster-success" });
    const resolved = resolveDecision(initial, sovietMoonLanding1969, { forkId: FIRST_FORK_ID, choiceId: "mars-expedition-commitment" });

    expect(deriveEvents(resolved, sovietMoonLanding1969).map(({ id }) => id)).toEqual([
      "evt-moon-n1-success",
      "evt-moon-mars-commitment",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(sovietMoonLanding1969, { basicChoiceId: "historical-n1-explosion" });
    const resolved = resolveDecision(initial, sovietMoonLanding1969, { forkId: FIRST_FORK_ID, choiceId: "mars-expedition-commitment" });

    expect(resolved.causalFactorValues).toEqual({
      "soviet-lunar-propulsion-reliability": 0,
      "american-apollo-momentum": 0,
      "space-industrialization-commitment": 2,
      "superpower-prestige-balance": 1,
    });
  });
});
