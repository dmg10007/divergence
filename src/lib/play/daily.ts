import { scenarios } from "@/data/scenarios";
import { buildMoment, type MomentSummary, type PivotSummary } from "./moments";

export interface DailyDilemma {
  dayNumber: number;
  dateString: string;
  moment: MomentSummary;
  featuredPivot: PivotSummary;
  alternativePivot: PivotSummary;
  communitySplit: {
    featuredPercent: number;
    alternativePercent: number;
  };
}

export interface DailyStreakState {
  streak: number;
  lastPlayedDate: string | null;
  hasPlayedToday: boolean;
}

const STREAK_STORAGE_KEY = "divergence:dailyStreak";

// Epoch date for day number calculations: October 1, 2026
const EPOCH_DATE = new Date("2026-10-01T00:00:00Z");

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDayNumber(date: Date = new Date()): number {
  const diffTime = date.getTime() - EPOCH_DATE.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, days + 1);
}

export function getDailyDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function getDailyDilemma(date: Date = new Date()): DailyDilemma {
  const dateString = getDailyDateString(date);
  const dayNumber = getDayNumber(date);

  const playableScenarios = scenarios.filter((s) => s.basicChoices.some((c) => c.consequenceSeeds.length > 0));
  const scenarioIndex = (dayNumber - 1) % playableScenarios.length;
  const scenario = playableScenarios[scenarioIndex];
  const moment = buildMoment(scenario);

  const hash = stringHash(`${dateString}:${scenario.id}`);
  const pivotCount = moment.pivots.length;

  // Pick primary pivot and an alternative from the scenario's pivots
  const featuredIndex = hash % pivotCount;
  const alternativeIndex = (featuredIndex + 1) % pivotCount;

  const featuredPivot = moment.pivots[featuredIndex];
  const alternativePivot = moment.pivots[alternativeIndex];

  // Seeded community split: between 35% and 65% for realism
  const splitBase = 35 + (stringHash(`${dateString}:split`) % 31);

  return {
    dayNumber,
    dateString,
    moment,
    featuredPivot,
    alternativePivot,
    communitySplit: {
      featuredPercent: splitBase,
      alternativePercent: 100 - splitBase,
    },
  };
}

let dailyMemoryStreak: DailyStreakState = {
  streak: 0,
  lastPlayedDate: null,
  hasPlayedToday: false,
};

export function _resetDailyMemoryForTesting() {
  dailyMemoryStreak = {
    streak: 0,
    lastPlayedDate: null,
    hasPlayedToday: false,
  };
}

export function getDailyStreak(todayDateStr: string = getDailyDateString()): DailyStreakState {
  if (typeof window === "undefined") {
    return {
      ...dailyMemoryStreak,
      hasPlayedToday: dailyMemoryStreak.lastPlayedDate === todayDateStr,
    };
  }

  try {
    const raw = window.localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return { streak: 0, lastPlayedDate: null, hasPlayedToday: false };

    const parsed = JSON.parse(raw);
    const hasPlayedToday = parsed.lastPlayedDate === todayDateStr;
    return {
      streak: parsed.streak ?? 0,
      lastPlayedDate: parsed.lastPlayedDate ?? null,
      hasPlayedToday,
    };
  } catch {
    return { streak: 0, lastPlayedDate: null, hasPlayedToday: false };
  }
}

export function recordDailyCompletion(todayDateStr: string = getDailyDateString()): DailyStreakState {
  const current = getDailyStreak(todayDateStr);
  if (current.hasPlayedToday) return current;

  let newStreak = 1;
  if (current.lastPlayedDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getDailyDateString(yesterday);

    if (current.lastPlayedDate === yesterdayStr) {
      newStreak = current.streak + 1;
    }
  }

  const updated: DailyStreakState = {
    streak: newStreak,
    lastPlayedDate: todayDateStr,
    hasPlayedToday: true,
  };

  if (typeof window === "undefined") {
    dailyMemoryStreak = updated;
    return updated;
  }

  try {
    window.localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }

  return updated;
}
