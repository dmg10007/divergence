import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { gettysburg1863 } from "./gettysburg-1863";

const FIRST_FORK_ID = "gettysburg-aftermath-1863";

const allSeeds = gettysburg1863.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("gettysburg1863", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(gettysburg1863)).toEqual(gettysburg1863);
    expect(gettysburg1863.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(gettysburg1863);
    expect(moment.scenarioId).toBe("gettysburg-1863");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "longstreet-flank-maneuver",
      "ewell-culps-hill-assault",
      "stuart-early-reconnaissance",
      "foreign-diplomatic-recognition",
      "meade-counterattack",
      "pipe-creek-defensive-line",
      "lee-captures-washington-dc",
      "total-confederate-annihilation-at-angle",
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
    expect(gettysburg1863.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(gettysburg1863.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(gettysburg1863, { basicChoiceId: "longstreet-flank-maneuver" });
    const resolved = resolveDecision(initial, gettysburg1863, { forkId: FIRST_FORK_ID, choiceId: "aggressive-pursuit-williamsport" });

    expect(deriveEvents(resolved, gettysburg1863).map(({ id }) => id)).toEqual([
      "evt-gb-flank-maneuver",
      "evt-gb-assault-williamsport",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(gettysburg1863, { basicChoiceId: "historical-assault" });
    const resolved = resolveDecision(initial, gettysburg1863, { forkId: FIRST_FORK_ID, choiceId: "aggressive-pursuit-williamsport" });

    expect(resolved.causalFactorValues).toEqual({
      "confederate-tactical-initiative": -2,
      "union-defensive-integrity": 2,
      "foreign-diplomatic-recognition": 0,
      "army-of-potomac-cohesion": 0,
    });
  });
});
