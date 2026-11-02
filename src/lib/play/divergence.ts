import type { ChoiceTier } from "@/domain/scenario";

export interface DivergenceResult {
  score: number;
  label: string;
  badge: string;
  severity: "subtle" | "moderate" | "radical" | "extreme";
}

export interface DivergenceParams {
  choiceId: string;
  tier?: ChoiceTier;
  factorValues?: Record<string, number>;
  resolvedForkCount?: number;
  affectedFactorIds?: string[];
  seedCount?: number;
  speculativeSeedCount?: number;
}

/**
 * Deterministic hash-based variation (+/- 3%) so individual counterfactuals
 * reflect a unique, reproducible numerical footprint on the scale.
 */
function deterministicChoiceOffset(choiceId: string): number {
  let hash = 0;
  for (let i = 0; i < choiceId.length; i++) {
    hash = (hash << 5) - hash + choiceId.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 7) - 3;
}

/**
 * Calculates a thematic "Timeline Divergence" percentage (0-100%) and dramatic
 * classification based on the choice tier, causal factor breadth, speculative reach,
 * dynamic factor shifts, and resolved forks.
 */
export function calculateDivergence(params: DivergenceParams): DivergenceResult {
  const {
    choiceId,
    tier,
    factorValues = {},
    resolvedForkCount = 0,
    affectedFactorIds,
    speculativeSeedCount,
    seedCount,
  } = params;

  // Historical baseline choice has minimal divergence
  if (choiceId === "historical" || choiceId.startsWith("historical-")) {
    return {
      score: 0,
      label: "Recorded Timeline (Historical)",
      badge: "Historical Baseline",
      severity: "subtle",
    };
  }

  const isExtreme = tier === "extreme-divergence";

  // Tier base anchors: 82 for extreme divergence, 48 for plausible alternatives
  let score = isExtreme ? 82 : 48;

  // Breadth of causal pillars affected by the choice (+3% per factor, up to +12%)
  const factorBreadth = affectedFactorIds ? affectedFactorIds.length : 0;
  if (factorBreadth > 0) {
    score += Math.min(12, factorBreadth * 3);
  }

  // Speculative reach into decade and present horizons
  if (speculativeSeedCount !== undefined && speculativeSeedCount > 0) {
    score += Math.min(6, speculativeSeedCount * 2);
  } else if (seedCount !== undefined && seedCount > 0) {
    score += Math.min(4, Math.floor(seedCount / 2));
  }

  // Add weight from dynamic causal factor shifts (from decision fork effects or overrides)
  const factorDeltas = Object.values(factorValues);
  const totalFactorShift = factorDeltas.reduce((acc, val) => acc + Math.abs(val), 0);
  score += Math.min(28, totalFactorShift * 7);

  // Add weight for resolved decision forks
  score += Math.min(18, resolvedForkCount * 6);

  // Apply deterministic choice-specific offset
  score += deterministicChoiceOffset(choiceId);

  // Clamp score within calibrated bounds
  const minScore = isExtreme ? 80 : 42;
  score = Math.max(minScore, Math.min(96, Math.round(score)));

  if (score >= 90) {
    return {
      score,
      label: "Existential Reality Reordering",
      badge: "⚡ Extreme Divergence",
      severity: "extreme",
    };
  }
  if (score >= 78) {
    return {
      score,
      label: "Radical Historical Fracture",
      badge: "⚡ Radical Shift",
      severity: "radical",
    };
  }
  if (score >= 63) {
    return {
      score,
      label: "Significant Timeline Fracture",
      badge: "⚡ Major Fracture",
      severity: "moderate",
    };
  }
  if (score >= 50) {
    return {
      score,
      label: "Moderate Geopolitical Ripple",
      badge: "⚡ Moderate Ripple",
      severity: "moderate",
    };
  }
  return {
    score,
    label: "Localized Historical Variance",
    badge: "⚡ Localized Shift",
    severity: "subtle",
  };
}

export type ArchitectRank = "S" | "A" | "B" | "C" | "Ω";

export interface ArchitectRating {
  rank: ArchitectRank;
  title: string;
  badge: string;
  summary: string;
}

export interface ArchitectRatingParams {
  score: number;
  factorValues?: Record<string, number>;
  resolvedForkCount?: number;
  isCatastrophicEscalation?: boolean;
}

/**
 * Calculates a strategic "Architect Rating" (S, A, B, C, Ω) based on the timeline divergence,
 * dynamic crisis factor management, and escalation control.
 */
export function calculateArchitectRating(params: ArchitectRatingParams): ArchitectRating {
  const { score, factorValues = {}, resolvedForkCount = 0, isCatastrophicEscalation } = params;

  // Check for critical escalation breach in factors
  const hasCriticalEscalation =
    isCatastrophicEscalation ||
    Object.entries(factorValues).some(
      ([key, val]) => (key.includes("escalation") || key.includes("casualt") || key.includes("crisis")) && val >= 2,
    );

  if (hasCriticalEscalation && score >= 80) {
    return {
      rank: "Ω",
      title: "Timeline Catastrophe",
      badge: "Ω Rank // Catastrophic",
      summary: "Cascading crisis escalation breached historical safety limits, triggering systemic geopolitical collapse.",
    };
  }

  if (score >= 85) {
    return {
      rank: "S",
      title: "Grand Architect",
      badge: "S Rank // Grand Architect",
      summary: "Achieved profound historical reordering through decisive command while maintaining strategic balance.",
    };
  }

  if (score >= 70 || resolvedForkCount >= 2) {
    return {
      rank: "A",
      title: "Tactical Mastermind",
      badge: "A Rank // Mastermind",
      summary: "Executed sharp tactical interventions that forced a structural realignment of the historical era.",
    };
  }

  if (score >= 50 || resolvedForkCount >= 1) {
    return {
      rank: "B",
      title: "Pragmatic Deflector",
      badge: "B Rank // Pragmatic",
      summary: "Plausible historical deviation maintained within credible regional boundaries.",
    };
  }

  return {
    rank: "C",
    title: "Subtle Perturbation",
    badge: "C Rank // Subtle",
    summary: "Localized historical variance; the broader timeline currents remained largely self-correcting.",
  };
}
