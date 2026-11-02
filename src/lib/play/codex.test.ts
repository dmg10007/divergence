import { beforeEach, describe, expect, it } from "vitest";
import {
  getTimelineCodex,
  recordDiscoveredTimeline,
  isTimelineDiscovered,
  getCodexStats,
  getAchievements,
  _resetMemoryStoreForTesting,
} from "./codex";

describe("Timeline Codex", () => {
  beforeEach(() => {
    _resetMemoryStoreForTesting();
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("records and retrieves discovered timelines in order", () => {
    const entry = recordDiscoveredTimeline({
      scenarioId: "dunkirk-1940",
      scenarioTitle: "Dunkirk 1940",
      choiceId: "no-halt-order",
      choiceLabel: "Panzers Press the Pocket",
      divergenceScore: 84,
      architectRank: "A",
      architectTitle: "Tactical Mastermind",
    });

    expect(entry.unlockedAt).toBeDefined();
    expect(isTimelineDiscovered("dunkirk-1940", "no-halt-order")).toBe(true);
    expect(isTimelineDiscovered("dunkirk-1940", "other-choice")).toBe(false);

    const codex = getTimelineCodex();
    expect(codex.length).toBe(1);
    expect(codex[0].choiceId).toBe("no-halt-order");
  });

  it("calculates accurate stats and unlocks achievements as milestones are met", () => {
    recordDiscoveredTimeline({
      scenarioId: "dunkirk-1940",
      scenarioTitle: "Dunkirk 1940",
      choiceId: "no-halt-order",
      choiceLabel: "Panzers Press",
      divergenceScore: 86,
      architectRank: "S",
      architectTitle: "Grand Architect",
    });

    recordDiscoveredTimeline({
      scenarioId: "midway-1942",
      scenarioTitle: "Battle of Midway 1942",
      choiceId: "spruance-dawn-strike",
      choiceLabel: "Dawn Strike",
      divergenceScore: 78,
      architectRank: "A",
    });

    recordDiscoveredTimeline({
      scenarioId: "cuban-missile-crisis-1962",
      scenarioTitle: "Cuban Missile Crisis 1962",
      choiceId: "b59-nuclear-torpedo",
      choiceLabel: "B-59 Torpedo Release",
      divergenceScore: 94,
      architectRank: "Ω",
    });

    const stats = getCodexStats();
    expect(stats.totalDiscovered).toBe(3);
    expect(stats.unlockedByScenario["dunkirk-1940"]).toBe(1);
    expect(stats.unlockedByScenario["midway-1942"]).toBe(1);

    const achievements = getAchievements();
    const firstFracture = achievements.find((a) => a.id === "first-fracture");
    const butterflyEffect = achievements.find((a) => a.id === "butterfly-effect");
    const grandArchitect = achievements.find((a) => a.id === "grand-architect");
    const temporalVoyager = achievements.find((a) => a.id === "temporal-voyager");

    expect(firstFracture?.unlocked).toBe(true);
    expect(butterflyEffect?.unlocked).toBe(true);
    expect(grandArchitect?.unlocked).toBe(true);
    expect(temporalVoyager?.unlocked).toBe(true);
  });
});
