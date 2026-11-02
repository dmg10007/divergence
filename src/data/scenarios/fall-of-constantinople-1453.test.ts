import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { fallOfConstantinople1453 } from "./fall-of-constantinople-1453";

const FIRST_FORK_ID = "constantinople-aftermath-1453";

const allSeeds = fallOfConstantinople1453.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("fallOfConstantinople1453", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(fallOfConstantinople1453)).toEqual(fallOfConstantinople1453);
    expect(fallOfConstantinople1453.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(fallOfConstantinople1453);
    expect(moment.scenarioId).toBe("fall-of-constantinople-1453");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "venetian-papal-relief-fleet-arrives",
      "giustiniani-holds-romanus-gate",
      "orban-supercannon-catastrophic-failure",
      "hunyadi-danubian-counterinvasion",
      "ottoman-janissary-revolt",
      "constantine-maritime-evacuation-morea",
      "mehmed-slain-at-breach",
      "byzantine-greek-fire-flotilla",
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
    expect(fallOfConstantinople1453.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(fallOfConstantinople1453.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(fallOfConstantinople1453, { basicChoiceId: "venetian-papal-relief-fleet-arrives" });
    const resolved = resolveDecision(initial, fallOfConstantinople1453, { forkId: FIRST_FORK_ID, choiceId: "ratify-council-of-florence-union" });

    expect(deriveEvents(resolved, fallOfConstantinople1453).map(({ id }) => id)).toEqual([
      "evt-1453-venetian-fleet",
      "evt-1453-ratify-union",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(fallOfConstantinople1453, { basicChoiceId: "historical-kerkoporta-breach" });
    const resolved = resolveDecision(initial, fallOfConstantinople1453, { forkId: FIRST_FORK_ID, choiceId: "ratify-council-of-florence-union" });

    expect(resolved.causalFactorValues).toEqual({
      "theodosian-wall-defensive-integrity": 0,
      "western-crusader-naval-relief": 2,
      "ottoman-siege-momentum": 0,
      "silk-road-maritime-access": 1,
    });
  });
});
