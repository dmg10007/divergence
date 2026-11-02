import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { spanishArmada1588 } from "./spanish-armada-1588";

const FIRST_FORK_ID = "armada-aftermath-1588";

const allSeeds = spanishArmada1588.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("spanishArmada1588", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(spanishArmada1588)).toEqual(spanishArmada1588);
    expect(spanishArmada1588.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(spanishArmada1588);
    expect(moment.scenarioId).toBe("spanish-armada-1588");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "calais-fireship-repulse",
      "parma-army-lands-at-margate",
      "london-captured-catholic-restoration",
      "calm-seas-boarding-action",
      "treaty-of-westminster-spanish-dominion",
      "dutch-sea-beggars-interception",
      "catholic-inquisition-of-london",
      "queen-elizabeth-captured-tilbury",
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
    expect(spanishArmada1588.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(spanishArmada1588.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(spanishArmada1588, { basicChoiceId: "calais-fireship-repulse" });
    const resolved = resolveDecision(initial, spanishArmada1588, { forkId: FIRST_FORK_ID, choiceId: "install-infanta-isabella" });

    expect(deriveEvents(resolved, spanishArmada1588).map(({ id }) => id)).toEqual([
      "evt-armada-fireship-repulse",
      "evt-armada-crown-isabella",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(spanishArmada1588, { basicChoiceId: "historical-gravelines-rout" });
    const resolved = resolveDecision(initial, spanishArmada1588, { forkId: FIRST_FORK_ID, choiceId: "install-infanta-isabella" });

    expect(resolved.causalFactorValues).toEqual({
      "spanish-invading-force-integrity": 1,
      "english-maritime-defense": 0,
      "catholic-habsburg-hegemony": 2,
      "channel-weather-volatility": 0,
    });
  });
});
