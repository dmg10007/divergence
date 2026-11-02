import { describe, expect, it } from "vitest";
import { dunkirk1940 } from "@/data/scenarios/dunkirk-1940";
import { buildMoment, listPlayableMoments } from "./moments";

const PIVOT_IDS = [
  "reduced-evacuation",
  "no-halt-order",
  "war-cabinet-negotiates",
  "expanded-evacuation",
  "luftwaffe-mole-bombardment",
  "french-breton-redoubt",
  "goring-luftwaffe-annihilation",
  "fall-seelowe-immediate-airborne",
];

describe("play moments", () => {
  it("offers only the seeded pivots, not the baseline or unseeded variants", () => {
    const ids = buildMoment(dunkirk1940).pivots.map(({ id }) => id);

    expect([...ids].sort()).toEqual([...PIVOT_IDS].sort());
  });

  it("carries each pivot's minimal-rewrite case and linked sources", () => {
    buildMoment(dunkirk1940).pivots.forEach((pivot) => {
      expect(pivot.minimalRewrite.length).toBeGreaterThan(0);
      expect(pivot.sources.length).toBeGreaterThanOrEqual(2);
      expect(pivot.affectedFactorIds).toBeDefined();
      expect(pivot.affectedFactorIds?.length).toBeGreaterThan(0);
      expect(pivot.speculativeSeedCount).toBeDefined();
      pivot.sources.forEach((source) => expect(source.sourceUrl.startsWith("https://")).toBe(true));
    });
  });

  it("takes the hook and date from the scenario's divergence", () => {
    const moment = buildMoment(dunkirk1940);

    expect(moment.hook).toBe(dunkirk1940.divergence.historicalEvent);
    expect(moment.date).toBe(dunkirk1940.divergence.date);
    expect(moment.scenarioId).toBe("dunkirk-1940");
  });

  it("lists a scenario with pivots and omits one without", () => {
    const withoutPivots = structuredClone(dunkirk1940);
    withoutPivots.basicChoices.forEach((choice) => {
      choice.consequenceSeeds = [];
    });

    expect(listPlayableMoments([dunkirk1940]).map(({ scenarioId }) => scenarioId)).toEqual(["dunkirk-1940"]);
    expect(listPlayableMoments([withoutPivots])).toEqual([]);
  });
});
