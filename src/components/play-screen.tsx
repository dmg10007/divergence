"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RunNarrative } from "@/components/run-narrative";
import { FactorGauges } from "@/components/factor-gauges";
import { addRunToHistory } from "@/lib/runs/local-run-history";
import { calculateDivergence } from "@/lib/play/divergence";
import type { MomentSummary, DecisionForkSummary } from "@/lib/play/moments";
import styles from "./play-screen.module.css";

interface ResolvedCommand {
  forkId: string;
  choiceId: string;
}

export function PlayScreen({ moment }: { moment: MomentSummary }) {
  const [tierFilter, setTierFilter] = useState<"all" | "plausible-alternative" | "extreme-divergence">("all");
  const [selectedId, setSelectedId] = useState<string | null>(moment.pivots[0]?.id ?? null);
  const [mode, setMode] = useState<"pivot-selection" | "crisis-command">("pivot-selection");
  const [resolvedCommands, setResolvedCommands] = useState<ResolvedCommand[]>([]);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "starting">("idle");
  const [error, setError] = useState<string | null>(null);

  const filteredPivots = tierFilter === "all"
    ? moment.pivots
    : moment.pivots.filter((p) => p.tier === tierFilter);

  const selected = moment.pivots.find((pivot) => pivot.id === selectedId) ?? null;
  const decisionForks = useMemo(() => moment.decisionForks ?? [], [moment.decisionForks]);

  // Compute live factor values from resolved commands
  const currentFactorValues = useMemo(() => {
    const values: Record<string, number> = {};
    moment.causalFactors?.forEach((f) => {
      values[f.id] = 0;
    });

    resolvedCommands.forEach((cmd) => {
      const fork = decisionForks.find((f) => f.id === cmd.forkId);
      const choice = fork?.choices.find((c) => c.id === cmd.choiceId);
      choice?.effects.forEach((eff) => {
        values[eff.factorId] = (values[eff.factorId] ?? 0) + eff.delta;
      });
    });

    return values;
  }, [moment.causalFactors, decisionForks, resolvedCommands]);

  // Determine which decision forks are currently unlocked
  const availableForks: DecisionForkSummary[] = useMemo(() => {
    if (decisionForks.length === 0) return [];
    const resolvedMap = new Map(resolvedCommands.map((c) => [c.forkId, c.choiceId]));

    return decisionForks.filter((fork) => {
      return fork.availableWhen.every((cond) => {
        if (cond.type === "choice-resolved") {
          const resolvedChoice = resolvedMap.get(cond.forkId);
          return resolvedChoice ? cond.choiceIds.includes(resolvedChoice) : false;
        }
        if (cond.type === "factor-at-least") {
          return (currentFactorValues[cond.factorId] ?? 0) >= cond.value;
        }
        return true;
      });
    });
  }, [decisionForks, resolvedCommands, currentFactorValues]);

  // Live divergence calculation during crisis command
  const previewDivergence = useMemo(() => {
    if (!selected) return null;
    return calculateDivergence({
      choiceId: selected.id,
      tier: selected.tier,
      factorValues: currentFactorValues,
      resolvedForkCount: resolvedCommands.length,
      affectedFactorIds: selected.affectedFactorIds,
      speculativeSeedCount: selected.speculativeSeedCount,
    });
  }, [selected, currentFactorValues, resolvedCommands.length]);

  function handleTierFilterChange(newTier: "all" | "plausible-alternative" | "extreme-divergence") {
    setTierFilter(newTier);
    const newPivots = newTier === "all" ? moment.pivots : moment.pivots.filter((p) => p.tier === newTier);
    if (!newPivots.some((p) => p.id === selectedId) && newPivots[0]) {
      setSelectedId(newPivots[0].id);
      setError(null);
    }
  }

  function handleForkChoiceSelect(forkId: string, choiceId: string) {
    setResolvedCommands((prev) => {
      const filtered = prev.filter((cmd) => cmd.forkId !== forkId);
      return [...filtered, { forkId, choiceId }];
    });
  }

  async function executeSimulation(commandsToUse: ResolvedCommand[] = resolvedCommands) {
    if (!selected) {
      setError("Please select one of the turning points above to rewrite history.");
      return;
    }
    setStatus("starting");
    setError(null);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: moment.scenarioId,
          basicChoiceId: selected.id,
          resolvedCommands: commandsToUse,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Unable to start this simulation.");

      addRunToHistory({ runId: body.runId, scenarioId: moment.scenarioId, createdAt: new Date().toISOString() });
      setRunId(body.runId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start this simulation.");
    } finally {
      setStatus("idle");
    }
  }

  function reset() {
    setRunId(null);
    setSelectedId(moment.pivots[0]?.id ?? null);
    setResolvedCommands([]);
    setMode("pivot-selection");
    setError(null);
  }

  // --- RESULT VIEW ---
  if (runId && selected) {
    return (
      <div className={styles.stage}>
        <div style={{ marginBottom: "8px" }}>
          <p className="eyebrow" style={{ margin: 0 }}>Timeline Synthesized</p>
          <h2 style={{ margin: "4px 0 8px" }}>{selected.label}</h2>
          <p className={styles.hook}>{selected.interventionSummary}</p>
        </div>

        <RunNarrative
          key={runId}
          runId={runId}
          autoStart
          scenarioId={moment.scenarioId}
          scenarioTitle={moment.title}
          scenarioEra={moment.date}
          choiceId={selected.id}
          choiceTier={selected.tier}
          choiceLabel={selected.label}
          choiceSummary={selected.interventionSummary}
          factorValues={currentFactorValues}
          resolvedForkCount={resolvedCommands.length}
          affectedFactorIds={selected.affectedFactorIds}
          speculativeSeedCount={selected.speculativeSeedCount}
        />

        <div className={styles.actions} style={{ marginTop: "16px" }}>
          <button className="button" onClick={reset} type="button">
            Try another tactical branch
          </button>
          <Link
            className="button"
            style={{ background: "transparent", border: "1px solid var(--line)" }}
            href="/"
          >
            &larr; Choose another scenario
          </Link>
        </div>
      </div>
    );
  }

  // --- CRISIS COMMAND ROOM MODE ---
  if (mode === "crisis-command" && selected) {
    const factorItems = Object.entries(currentFactorValues).map(([id, val]) => {
      const label = moment.causalFactors?.find((f) => f.id === id)?.label ?? id;
      return { id, label, value: val };
    });

    return (
      <div className={styles.stage}>
        <div className={styles.crisisRoom}>
          <div className={styles.crisisTopBanner}>
            <div className={styles.crisisDivergenceTag}>
              <span>Point of Divergence</span>
              <span>{selected.label}</span>
            </div>
            {previewDivergence && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Estimated Shift
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent)" }}>
                  {previewDivergence.score}%
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow" style={{ margin: "0 0 4px" }}>Theater Status</p>
            <h3 style={{ margin: "0 0 14px", fontSize: "1.1rem" }}>Dynamic Geopolitical Factors</h3>
            {factorItems.length > 0 ? (
              <FactorGauges factors={factorItems} />
            ) : (
              <p className={styles.hook}>No regional factors defined for this divergence.</p>
            )}
          </div>

          <div className={styles.forkContainer}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <p className="eyebrow" style={{ margin: "0 0 2px" }}>Decision Chain</p>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Tactical Flashpoints</h3>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                {resolvedCommands.length} of {availableForks.length} Resolved
              </span>
            </div>

            {availableForks.map((fork, index) => {
              const currentChoiceId = resolvedCommands.find((c) => c.forkId === fork.id)?.choiceId;

              return (
                <div key={fork.id} className={styles.forkBlock}>
                  <div className={styles.forkHeader}>
                    <h4 className={styles.forkHeading}>
                      {index + 1}. {fork.label}
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{fork.date}</span>
                  </div>

                  <div className={styles.forkChoiceGrid}>
                    {fork.choices.map((choice) => {
                      const isChosen = currentChoiceId === choice.id;

                      return (
                        <button
                          key={choice.id}
                          type="button"
                          className={`${styles.forkChoiceButton} ${isChosen ? styles.forkChoiceButtonSelected : ""}`}
                          onClick={() => handleForkChoiceSelect(fork.id, choice.id)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{choice.label}</span>
                            <span style={{ fontSize: "0.72rem", color: isChosen ? "var(--accent)" : "var(--muted)" }}>
                              {isChosen ? "● Active" : "○ Select"}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.4 }}>
                            {choice.description}
                          </p>
                          {choice.effects.length > 0 && (
                            <div className={styles.effectList}>
                              {choice.effects.map((eff) => {
                                const factorLabel =
                                  moment.causalFactors?.find((f) => f.id === eff.factorId)?.label ?? eff.factorId;
                                const isPos = eff.delta > 0;
                                return (
                                  <span
                                    key={eff.factorId}
                                    className={`${styles.effectPill} ${isPos ? styles.effectPositive : styles.effectNegative}`}
                                  >
                                    {factorLabel}: {isPos ? `+${eff.delta}` : eff.delta}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR (Thumb Zone in Crisis Room) */}
        <div className={styles.stickyBottomBar}>
          <div className={styles.bottomBarInner}>
            <div className={styles.selectedSummaryBar}>
              <span>Status: <strong>{resolvedCommands.length} of {availableForks.length} Resolved</strong></span>
              {previewDivergence && <span>⚡ {previewDivergence.score}% Divergence</span>}
            </div>
            <button
              className={styles.primaryActionBtn}
              type="button"
              onClick={() => executeSimulation()}
              disabled={status === "starting"}
            >
              {status === "starting" ? "Synthesizing reality..." : "⚡ Synthesize Timeline Reality"}
            </button>
            <button
              className={styles.secondaryActionBtn}
              type="button"
              onClick={() => setMode("pivot-selection")}
              disabled={status === "starting"}
            >
              &larr; Back to Divergence Points
            </button>
            {error && <p role="alert" style={{ color: "#e74c3c", margin: 0, fontSize: "0.8rem", textAlign: "center" }}>{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // --- PIVOT SELECTION MODE ---
  const hasDecisionForks = decisionForks.length > 0;

  return (
    <div className={styles.stage}>
      <p className={styles.hook}>{moment.hook}</p>
      <p className={styles.warning} role="note">{moment.contentWarning}</p>

      <div style={{ margin: "4px 0" }}>
        <h2 style={{ margin: "0 0 4px" }}>What would you change?</h2>
        <p className={styles.prompt}>
          Choose between grounded near-misses or radical timeline fractures.
        </p>
      </div>

      <div className={styles.filterTabs} role="tablist" aria-label="Change point category filter">
        <button
          type="button"
          role="tab"
          aria-selected={tierFilter === "all"}
          className={`${styles.filterTab} ${tierFilter === "all" ? styles.filterTabActive : ""}`}
          onClick={() => handleTierFilterChange("all")}
        >
          All ({moment.pivots.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tierFilter === "plausible-alternative"}
          className={`${styles.filterTab} ${tierFilter === "plausible-alternative" ? styles.filterTabActive : ""}`}
          onClick={() => handleTierFilterChange("plausible-alternative")}
        >
          Plausible Alternatives ({moment.pivots.filter((p) => p.tier === "plausible-alternative").length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tierFilter === "extreme-divergence"}
          className={`${styles.filterTab} ${tierFilter === "extreme-divergence" ? styles.filterTabActive : ""}`}
          onClick={() => handleTierFilterChange("extreme-divergence")}
        >
          ⚡ Extreme Divergences ({moment.pivots.filter((p) => p.tier === "extreme-divergence").length})
        </button>
      </div>

      <ul className={styles.pivotList}>
        {filteredPivots.map((pivot) => {
          const isSelected = pivot.id === selectedId;
          const isExtreme = pivot.tier === "extreme-divergence";
          return (
            <li className={styles.pivotCard} key={pivot.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                className={`${styles.pivotButton} ${isSelected ? styles.pivotButtonSelected : ""}`}
                onClick={() => {
                  setSelectedId(pivot.id);
                  setError(null);
                }}
                disabled={status === "starting"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "0.5rem" }}>
                  <span className={isExtreme ? styles.tierBadgeExtreme : styles.tierBadgePlausible}>
                    {isExtreme ? "⚡ Extreme" : "Plausible"}
                  </span>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: isSelected ? "var(--accent)" : "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}>
                    {isSelected ? "● Selected" : "○ Select"}
                  </span>
                </div>
                <span className={styles.pivotTitle}>{pivot.label}</span>
                <span className={styles.pivotText}>{pivot.description}</span>
              </button>
              <details className={styles.why}>
                <summary>{isExtreme ? "Critical Tipping Point" : "Historical Evidence"}</summary>
                <p>{pivot.minimalRewrite}</p>
                <ul className={styles.sourceList}>
                  {pivot.sources.map((source) => (
                    <li key={source.id}>
                      <a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.title}</a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>

      {/* STICKY BOTTOM ACTION BAR (Thumb Zone in Pivot Mode) */}
      <div className={styles.stickyBottomBar}>
        <div className={styles.bottomBarInner}>
          {selected && (
            <div className={styles.selectedSummaryBar}>
              <span>Selected: <strong>{selected.label}</strong></span>
              <span>{hasDecisionForks ? `${decisionForks.length} Decisions Ahead` : "Ready"}</span>
            </div>
          )}

          {hasDecisionForks ? (
            <>
              <button
                className={styles.primaryActionBtn}
                onClick={() => {
                  if (!selected) {
                    setError("Please select one of the turning points above to proceed.");
                    return;
                  }
                  setMode("crisis-command");
                }}
                type="button"
                disabled={status === "starting"}
              >
                ⚡ Enter Crisis Command ({decisionForks.length} Decisions)
              </button>
              <button
                className={styles.secondaryActionBtn}
                onClick={() => executeSimulation([])}
                type="button"
                disabled={status === "starting"}
              >
                {status === "starting" ? "Simulating..." : "🎲 Quick Synthesize"}
              </button>
            </>
          ) : (
            <button
              className={styles.primaryActionBtn}
              onClick={() => executeSimulation([])}
              type="button"
              disabled={status === "starting"}
            >
              {status === "starting" ? "Rewriting history..." : "⚡ Rewrite history"}
            </button>
          )}

          {error && <p role="alert" style={{ color: "#e74c3c", margin: 0, fontSize: "0.8rem", textAlign: "center" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
