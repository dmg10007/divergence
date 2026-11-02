import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { barbarossaMoscow1941 } from "./barbarossa-moscow-1941";

const FIRST_FORK_ID = "moscow-gates-1941";

const allSeeds = barbarossaMoscow1941.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("barbarossaMoscow1941", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(barbarossaMoscow1941)).toEqual(barbarossaMoscow1941);
    expect(barbarossaMoscow1941.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(barbarossaMoscow1941);
    expect(moment.scenarioId).toBe("barbarossa-moscow-1941");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "direct-september-moscow-drive",
      "guderian-tula-rail-severance",
      "zhukov-deep-siberian-envelopment",
      "japanese-kantokuen-strike",
      "early-rasputitsa-autumn-mud",
      "soviet-government-kuibyshev-evacuation",
      "stalin-captured-in-kremlin",
      "red-army-avalanche-berlin-1943",
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
    expect(barbarossaMoscow1941.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(barbarossaMoscow1941.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(barbarossaMoscow1941, { basicChoiceId: "direct-september-moscow-drive" });
    const resolved = resolveDecision(initial, barbarossaMoscow1941, { forkId: FIRST_FORK_ID, choiceId: "concentrated-panzer-pincer" });

    expect(deriveEvents(resolved, barbarossaMoscow1941).map(({ id }) => id)).toEqual([
      "evt-moscow-direct-drive",
      "evt-moscow-final-pincer",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(barbarossaMoscow1941, { basicChoiceId: "historical-kiev-diversion" });
    const resolved = resolveDecision(initial, barbarossaMoscow1941, { forkId: FIRST_FORK_ID, choiceId: "concentrated-panzer-pincer" });

    expect(resolved.causalFactorValues).toEqual({
      "german-logistical-reach": 1,
      "soviet-capital-defense": 0,
      "eastern-front-attrition": 2,
      "japanese-far-east-posture": 0,
    });
  });
});
