import type { ArchitectRank } from "./divergence";

export interface DiscoveredTimeline {
  scenarioId: string;
  scenarioTitle: string;
  choiceId: string;
  choiceLabel: string;
  runId?: string;
  divergenceScore: number;
  architectRank?: ArchitectRank;
  architectTitle?: string;
  unlockedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CodexStats {
  totalDiscovered: number;
  totalAvailable: number;
  completionPercentage: number;
  unlockedByScenario: Record<string, number>;
  achievementsUnlocked: number;
  achievementsTotal: number;
}

const CODEX_STORAGE_KEY = "divergence:codex";

let memoryStore: DiscoveredTimeline[] = [];

export function _resetMemoryStoreForTesting() {
  memoryStore = [];
}

export function getTimelineCodex(): DiscoveredTimeline[] {
  if (typeof window === "undefined") return memoryStore;
  try {
    const raw = window.localStorage.getItem(CODEX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : memoryStore;
  } catch {
    return memoryStore;
  }
}

export function recordDiscoveredTimeline(entry: Omit<DiscoveredTimeline, "unlockedAt">): DiscoveredTimeline {
  const fullEntry: DiscoveredTimeline = {
    ...entry,
    unlockedAt: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    const existingIndex = memoryStore.findIndex(
      (item) => item.scenarioId === entry.scenarioId && item.choiceId === entry.choiceId,
    );
    if (existingIndex >= 0) {
      if (entry.divergenceScore >= memoryStore[existingIndex].divergenceScore) {
        memoryStore[existingIndex] = fullEntry;
      }
    } else {
      memoryStore.push(fullEntry);
    }
    return fullEntry;
  }

  try {
    const codex = getTimelineCodex();
    const existingIndex = codex.findIndex(
      (item) => item.scenarioId === entry.scenarioId && item.choiceId === entry.choiceId,
    );

    if (existingIndex >= 0) {
      if (entry.divergenceScore >= codex[existingIndex].divergenceScore) {
        codex[existingIndex] = fullEntry;
      }
    } else {
      codex.push(fullEntry);
    }

    window.localStorage.setItem(CODEX_STORAGE_KEY, JSON.stringify(codex));
  } catch {
    // Ignore storage errors in private mode / strict quotas
  }

  return fullEntry;
}

export function isTimelineDiscovered(scenarioId: string, choiceId: string): boolean {
  const codex = getTimelineCodex();
  return codex.some((item) => item.scenarioId === scenarioId && item.choiceId === choiceId);
}

export function getDiscoveredCountForScenario(scenarioId: string): number {
  const codex = getTimelineCodex();
  return codex.filter((item) => item.scenarioId === scenarioId).length;
}

const TOTAL_CATALOG_TIMELINES = 72; // 12 scenarios * 6 playable turning points

export function getAchievements(codex: DiscoveredTimeline[] = getTimelineCodex()): Achievement[] {
  const hasFirst = codex.length >= 1;
  const hasHighDivergence = codex.some((t) => t.divergenceScore >= 85);
  const hasSRank = codex.some((t) => t.architectRank === "S");
  const uniqueScenarios = new Set(codex.map((t) => t.scenarioId));
  const hasMultipleEras = uniqueScenarios.size >= 3;
  const hasFiveTimelines = codex.length >= 5;
  const hasTenTimelines = codex.length >= 10;

  return [
    {
      id: "first-fracture",
      title: "Timeline Splicer",
      description: "Fracture history by synthesizing your first alternate timeline.",
      icon: "⚡",
      unlocked: hasFirst,
    },
    {
      id: "butterfly-effect",
      title: "The Butterfly Effect",
      description: "Trigger an Existential Reality Reordering with 85%+ Timeline Divergence.",
      icon: "🦋",
      unlocked: hasHighDivergence,
    },
    {
      id: "grand-architect",
      title: "Grand Architect",
      description: "Attain an S-Rank strategic mastery evaluation on a simulation run.",
      icon: "👑",
      unlocked: hasSRank,
    },
    {
      id: "temporal-voyager",
      title: "Temporal Voyager",
      description: "Command turning points across at least 3 distinct historical scenarios.",
      icon: "🧭",
      unlocked: hasMultipleEras,
    },
    {
      id: "codex-chronicler",
      title: "Codex Chronicler",
      description: "Discover and catalog 5 unique alternate timeline branches.",
      icon: "📜",
      unlocked: hasFiveTimelines,
    },
    {
      id: "master-of-time",
      title: "Master of Realities",
      description: "Discover and catalog 10 unique alternate timeline branches.",
      icon: "🌌",
      unlocked: hasTenTimelines,
    },
  ];
}

export function getCodexStats(codex: DiscoveredTimeline[] = getTimelineCodex()): CodexStats {
  const unlockedByScenario: Record<string, number> = {};
  for (const item of codex) {
    unlockedByScenario[item.scenarioId] = (unlockedByScenario[item.scenarioId] ?? 0) + 1;
  }

  const achievements = getAchievements(codex);
  const achievementsUnlocked = achievements.filter((a) => a.unlocked).length;

  return {
    totalDiscovered: codex.length,
    totalAvailable: TOTAL_CATALOG_TIMELINES,
    completionPercentage: Math.min(100, Math.round((codex.length / TOTAL_CATALOG_TIMELINES) * 100)),
    unlockedByScenario,
    achievementsUnlocked,
    achievementsTotal: achievements.length,
  };
}
