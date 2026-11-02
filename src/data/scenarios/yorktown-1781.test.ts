import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { yorktown1781 } from "./yorktown-1781";

const FIRST_FORK_ID = "yorktown-aftermath-1781";

const allSeeds = yorktown1781.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("yorktown1781", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(yorktown1781)).toEqual(yorktown1781);
    expect(yorktown1781.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(yorktown1781);
    expect(moment.scenarioId).toBe("yorktown-1781");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "british-naval-breakthrough",
      "york-river-evacuation",
      "clinton-timely-relief",
      "french-financial-collapse",
      "dominion-peace-compromise",
      "washington-southern-delay",
      "washington-captured-at-gloucester",
      "great-virginia-hurricane-1781",
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
    expect(yorktown1781.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(yorktown1781.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(yorktown1781, { basicChoiceId: "british-naval-breakthrough" });
    const resolved = resolveDecision(initial, yorktown1781, { forkId: FIRST_FORK_ID, choiceId: "lord-north-resignation" });

    expect(deriveEvents(resolved, yorktown1781).map(({ id }) => id)).toEqual([
      "evt-yt-naval-breakthrough",
      "evt-yt-north-resigns",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(yorktown1781, { basicChoiceId: "historical-surrender" });
    const resolved = resolveDecision(initial, yorktown1781, { forkId: FIRST_FORK_ID, choiceId: "lord-north-resignation" });

    expect(resolved.causalFactorValues).toEqual({
      "british-naval-dominance": -1,
      "continental-allied-cohesion": 0,
      "colonial-independence-momentum": 2,
      "french-naval-logistics": 0,
    });
  });
});
