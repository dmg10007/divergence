import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { buildMoment } from "@/lib/play/moments";
import { deriveEvents } from "@/lib/runs/narrative";
import { initializeSimulation, resolveDecision } from "@/lib/simulation-engine";
import { petrovFalseAlarm1983 } from "./petrov-false-alarm-1983";

const FIRST_FORK_ID = "nuclear-standoff-1983";

const allSeeds = petrovFalseAlarm1983.basicChoices.flatMap(({ consequenceSeeds }) => consequenceSeeds);

describe("petrovFalseAlarm1983", () => {
  it("conforms to the scenario contract", () => {
    expect(scenarioSchema.parse(petrovFalseAlarm1983)).toEqual(petrovFalseAlarm1983);
    expect(petrovFalseAlarm1983.status).toBe("reviewed");
  });

  it("builds playable moment with all eight counterfactual pivots", () => {
    const moment = buildMoment(petrovFalseAlarm1983);
    expect(moment.scenarioId).toBe("petrov-false-alarm-1983");
    expect(moment.pivots.length).toBe(8);
    const pivotIds = moment.pivots.map((p) => p.id);
    expect(pivotIds).toEqual([
      "petrov-follows-protocol",
      "automated-oko-preemption",
      "direct-hotline-deescalation",
      "able-archer-defcon-escalation",
      "satellite-sensor-sun-glint-lag",
      "tactical-nuclear-forward-alert",
      "full-scale-thermonuclear-holocaust",
      "dead-hand-uncontrolled-launch",
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
    expect(petrovFalseAlarm1983.decisionForks[0].id).toBe(FIRST_FORK_ID);
    expect(petrovFalseAlarm1983.decisionForks[0].availableWhen).toEqual([]);
  });

  it("derives the basic-choice and fork events in order", () => {
    const initial = initializeSimulation(petrovFalseAlarm1983, { basicChoiceId: "petrov-follows-protocol" });
    const resolved = resolveDecision(initial, petrovFalseAlarm1983, { forkId: FIRST_FORK_ID, choiceId: "retaliatory-launch-on-warning" });

    expect(deriveEvents(resolved, petrovFalseAlarm1983).map(({ id }) => id)).toEqual([
      "evt-petrov-follows-protocol",
      "evt-petrov-full-launch",
    ]);
  });

  it("applies the authored effects of the chosen response", () => {
    const initial = initializeSimulation(petrovFalseAlarm1983, { basicChoiceId: "historical-petrov-refusal" });
    const resolved = resolveDecision(initial, petrovFalseAlarm1983, { forkId: FIRST_FORK_ID, choiceId: "retaliatory-launch-on-warning" });

    expect(resolved.causalFactorValues).toEqual({
      "nuclear-escalation-threshold": 2,
      "early-warning-system-trust": 0,
      "superpower-crisis-diplomacy": 0,
      "strategic-retaliation-speed": 2,
    });
  });
});
