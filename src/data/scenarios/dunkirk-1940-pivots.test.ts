import { describe, expect, it } from "vitest";
import { scenarioSchema } from "@/domain/scenario";
import { deriveEvents } from "@/lib/runs/narrative";
import { sampleConsequenceSeeds } from "@/lib/runs/seed-sampling";
import { initializeSimulation } from "@/lib/simulation-engine";
import { dunkirk1940 } from "./dunkirk-1940";
import {
  cabinetNegotiatesChoice as originalCabinet,
  noHaltOrderPivot as originalNoHalt,
  reducedEvacuationPivot as originalReduced,
} from "./dunkirk-1940-pivots";

const ORIGINAL_PIVOT_IDS = ["reduced-evacuation", "no-halt-order", "war-cabinet-negotiates"];
const ALL_PIVOT_IDS = [
  "reduced-evacuation",
  "no-halt-order",
  "war-cabinet-negotiates",
  "expanded-evacuation",
  "luftwaffe-mole-bombardment",
  "french-breton-redoubt",
  "goring-luftwaffe-annihilation",
  "fall-seelowe-immediate-airborne",
];

function choiceById(id: string) {
  const choice = dunkirk1940.basicChoices.find((item) => item.id === id);
  if (!choice) throw new Error(`Missing basic choice ${id}`);
  return choice;
}

describe("dunkirk1940 pivots", () => {
  it("offers the eight pivots alongside the historical baseline", () => {
    expect(dunkirk1940.basicChoices.map(({ id }) => id)).toEqual(expect.arrayContaining(["historical", ...ALL_PIVOT_IDS]));
  });

  it("gives only the pivots consequence seeds and a plausibility case", () => {
    const withSeeds = dunkirk1940.basicChoices.filter((choice) => choice.consequenceSeeds.length > 0).map(({ id }) => id);
    expect([...withSeeds].sort()).toEqual([...ALL_PIVOT_IDS].sort());
    ALL_PIVOT_IDS.forEach((id) => expect(choiceById(id).plausibility).toBeDefined());
  });

  it("backs every plausibility case with at least two sources", () => {
    ALL_PIVOT_IDS.forEach((id) => expect(choiceById(id).plausibility?.evidenceIds.length ?? 0).toBeGreaterThanOrEqual(2));
  });

  it("authors consequence seeds for all pivots that cover each horizon", () => {
    ORIGINAL_PIVOT_IDS.forEach((id) => {
      const seeds = choiceById(id).consequenceSeeds;
      const count = (horizon: string) => seeds.filter((seed) => seed.horizon === horizon).length;
      expect([count("aftermath"), count("decade"), count("present")]).toEqual([5, 5, 4]);
    });
    ALL_PIVOT_IDS.forEach((id) => {
      const seeds = choiceById(id).consequenceSeeds;
      expect(seeds.filter((seed) => seed.horizon === "aftermath").length).toBeGreaterThanOrEqual(3);
      expect(seeds.filter((seed) => seed.horizon === "decade").length).toBeGreaterThanOrEqual(2);
      expect(seeds.filter((seed) => seed.horizon === "present").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("draws five seeds for a play of each pivot", () => {
    ALL_PIVOT_IDS.forEach((id) => expect(sampleConsequenceSeeds(choiceById(id), "run-1")).toHaveLength(5));
  });

  it("derives the cabinet pivot's event from the basic choice", () => {
    const state = initializeSimulation(dunkirk1940, { basicChoiceId: "war-cabinet-negotiates" });
    expect(deriveEvents(state, dunkirk1940).map(({ id }) => id)).toEqual(["evt-pivot-cabinet-negotiates"]);
  });

  it("spells out United States in seed text so narration validation can match it", () => {
    dunkirk1940.basicChoices.flatMap((choice) => choice.consequenceSeeds).forEach((seed) => expect(seed.summary).not.toContain("U.S."));
  });

  it("preserves every previously authored seed", () => {
    const pairs = [
      ["no-halt-order", originalNoHalt.consequenceSeeds],
      ["reduced-evacuation", originalReduced.consequenceSeeds],
      ["war-cabinet-negotiates", originalCabinet.consequenceSeeds],
    ] as const;
    pairs.forEach(([id, originals]) => {
      expect(choiceById(id).consequenceSeeds.slice(0, originals.length)).toEqual(originals);
    });
  });

  it("keeps all seed IDs unique and the scenario valid", () => {
    const seeds = dunkirk1940.basicChoices.flatMap((choice) => choice.consequenceSeeds);
    expect(seeds).toHaveLength(76);
    expect(new Set(seeds.map(({ id }) => id)).size).toBe(76);
    expect(scenarioSchema.safeParse(dunkirk1940).success).toBe(true);
  });

  it("gives every new seed a cited basis, a factor and a horizon-appropriate classification", () => {
    const sourceIds = new Set(dunkirk1940.sources.map(({ id }) => id));
    const factorIds = new Set(dunkirk1940.causalFactors.map(({ id }) => id));
    const allowed = {
      aftermath: ["direct-inference", "plausible-projection"],
      decade: ["plausible-projection", "highly-speculative"],
      present: ["highly-speculative"],
    };
    ALL_PIVOT_IDS.forEach((id) => {
      choiceById(id).consequenceSeeds.forEach((seed) => {
        expect(seed.basis.trim().length).toBeGreaterThan(0);
        expect(seed.evidenceIds.length).toBeGreaterThan(0);
        seed.evidenceIds.forEach((sourceId) => expect(sourceIds.has(sourceId)).toBe(true));
        seed.causalFactorIds.forEach((factorId) => expect(factorIds.has(factorId)).toBe(true));
        expect(allowed[seed.horizon]).toContain(seed.classification);
      });
    });
  });

  it("draws deterministically and reaches new seeds across multiple run IDs", () => {
    ORIGINAL_PIVOT_IDS.forEach((id) => {
      const choice = choiceById(id);
      expect(sampleConsequenceSeeds(choice, "same-run")).toEqual(sampleConsequenceSeeds(choice, "same-run"));
      const newIds = new Set(choice.consequenceSeeds.slice(8).map(({ id: seedId }) => seedId));
      const draws = Array.from({ length: 100 }, (_, index) => sampleConsequenceSeeds(choice, `expanded-${index}`));
      expect(draws.flat().some((seed) => newIds.has(seed.id))).toBe(true);
      draws.forEach((draw) => {
        expect(draw.map(({ horizon }) => horizon)).toEqual(["aftermath", "aftermath", "decade", "decade", "present"]);
        expect(new Set(draw.map(({ id: seedId }) => seedId)).size).toBe(5);
      });
    });
  });
});
