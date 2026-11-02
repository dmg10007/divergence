import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { SimulationValidationError } from "@/domain/simulation";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { cubanMissileCrisis1962 } from "./cuban-missile-crisis-1962";

const FIRST_FORK_ID = "excomm-first-response-1962";

const allEvents = [
  ...cubanMissileCrisis1962.basicChoices.flatMap(({ narrativeEvents }) => narrativeEvents),
  ...cubanMissileCrisis1962.decisionForks.flatMap(({ choices }) => choices.flatMap(({ narrativeEvents }) => narrativeEvents)),
];

const allSeeds = cubanMissileCrisis1962.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("cubanMissileCrisis1962", () => {
  it("conforms to the scenario contract and stays in draft until reviewed", () => {
    expect(scenarioSchema.parse(cubanMissileCrisis1962)).toEqual(cubanMissileCrisis1962);
    expect(cubanMissileCrisis1962.status).toBe("draft");
  });

  it("classifies only the historical outcomes as documented fact", () => {
    const fork = cubanMissileCrisis1962.decisionForks[0];
    const forkClassifications = Object.fromEntries(fork.choices.map((choice) => [choice.id, choice.narrativeEvents.map((event) => event.classification)]));
    const basicClassifications = Object.fromEntries(cubanMissileCrisis1962.basicChoices.map((choice) => [choice.id, choice.narrativeEvents.map((event) => event.classification)]));

    expect(forkClassifications).toEqual({
      "naval-quarantine": ["documented-fact"],
      "air-strike": ["plausible-projection"],
      "air-strike-and-invasion": ["plausible-projection"],
      "stern-warnings": ["plausible-projection"],
    });
    expect(basicClassifications).toEqual({
      "historical-discovery": ["documented-fact"],
      "delayed-discovery": ["plausible-projection"],
      "early-discovery": ["plausible-projection"],
      "preemptive-airstrike": ["plausible-projection"],
      "b59-nuclear-torpedo": ["plausible-projection"],
      "un-emergency-summit": ["plausible-projection"],
      "full-scale-invasion-oplan": ["plausible-projection"],
      "guantanamo-tactical-nuclear-annihilation": ["plausible-projection"],
      "operation-jupiter-first-strike": ["plausible-projection"],
    });
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(cubanMissileCrisis1962);
    expect(moment.scenarioId).toBe("cuban-missile-crisis-1962");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "delayed-discovery",
      "early-discovery",
      "preemptive-airstrike",
      "b59-nuclear-torpedo",
      "un-emergency-summit",
      "full-scale-invasion-oplan",
      "guantanamo-tactical-nuclear-annihilation",
      "operation-jupiter-first-strike",
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
    expect(cubanMissileCrisis1962.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(cubanMissileCrisis1962.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(cubanMissileCrisis1962, { basicChoiceId: "delayed-discovery" });
    const resolved = resolveDecision(initial, cubanMissileCrisis1962, { forkId: FIRST_FORK_ID, choiceId: "naval-quarantine" });

    expect(deriveEvents(resolved, cubanMissileCrisis1962).map(({ id }) => id)).toEqual(["evt-discovery-delayed", "evt-quarantine"]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(cubanMissileCrisis1962, { basicChoiceId: "historical-discovery" });
    const resolved = resolveDecision(initial, cubanMissileCrisis1962, { forkId: FIRST_FORK_ID, choiceId: "air-strike-and-invasion" });

    expect(resolved.causalFactorValues).toEqual({
      "discovery-lead-time": 0,
      "us-military-pressure": 2,
      "soviet-face-saving-room": -2,
      "escalation-risk": 2,
    });
  });

  it("accepts only discovery delays aligned to its step and range", () => {
    const accepted = initializeSimulation(cubanMissileCrisis1962, { basicChoiceId: "delayed-discovery", advancedVariableOverrides: { "discovery-delay": 7 } });

    expect(accepted.advancedVariableValues["discovery-delay"]).toBe(7);
    expect(() => initializeSimulation(cubanMissileCrisis1962, { basicChoiceId: "delayed-discovery", advancedVariableOverrides: { "discovery-delay": 3 } })).toThrow(SimulationValidationError);
    expect(() => initializeSimulation(cubanMissileCrisis1962, { basicChoiceId: "delayed-discovery", advancedVariableOverrides: { "discovery-delay": 21 } })).toThrow(SimulationValidationError);
  });

  it("spells out United States in event text so narration validation can match it", () => {
    allEvents.forEach((event) => {
      expect(event.summary).not.toContain("U.S.");
    });
  });
});
