"use client";

import { useState } from "react";
import Link from "next/link";
import { RunNarrative } from "@/components/run-narrative";
import { addRunToHistory } from "@/lib/runs/local-run-history";
import type { MomentSummary } from "@/lib/play/moments";
import styles from "./play-screen.module.css";

export function PlayScreen({ moment }: { moment: MomentSummary }) {
  const [tierFilter, setTierFilter] = useState<"all" | "plausible-alternative" | "extreme-divergence">("all");
  const [selectedId, setSelectedId] = useState<string | null>(moment.pivots[0]?.id ?? null);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "starting">("idle");
  const [error, setError] = useState<string | null>(null);

  const filteredPivots = tierFilter === "all"
    ? moment.pivots
    : moment.pivots.filter((p) => p.tier === tierFilter);

  const selected = moment.pivots.find((pivot) => pivot.id === selectedId) ?? null;

  function handleTierFilterChange(newTier: "all" | "plausible-alternative" | "extreme-divergence") {
    setTierFilter(newTier);
    const newPivots = newTier === "all" ? moment.pivots : moment.pivots.filter((p) => p.tier === newTier);
    if (!newPivots.some((p) => p.id === selectedId) && newPivots[0]) {
      setSelectedId(newPivots[0].id);
      setError(null);
    }
  }

  async function rewriteHistory() {
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
        body: JSON.stringify({ scenarioId: moment.scenarioId, basicChoiceId: selected.id }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Unable to start this story.");

      addRunToHistory({ runId: body.runId, scenarioId: moment.scenarioId, createdAt: new Date().toISOString() });
      setRunId(body.runId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start this story.");
    } finally {
      setStatus("idle");
    }
  }

  function reset() {
    setRunId(null);
    setSelectedId(null);
    setError(null);
  }

  if (runId && selected) {
    return (
      <div className={styles.stage}>
        <p className="eyebrow">Your change</p>
        <h2>{selected.label}</h2>
        <p className={styles.hook}>{selected.interventionSummary}</p>
        <RunNarrative
          key={runId}
          runId={runId}
          autoStart
          scenarioTitle={moment.title}
          scenarioEra={moment.date}
          choiceId={selected.id}
          choiceTier={selected.tier}
          choiceLabel={selected.label}
          choiceSummary={selected.interventionSummary}
          affectedFactorIds={selected.affectedFactorIds}
          speculativeSeedCount={selected.speculativeSeedCount}
        />
        <div className={styles.actions}>
          <button className="button" onClick={reset} type="button">Try another turning point</button>
          <Link className="button" style={{ background: "transparent", border: "1px solid var(--line)" }} href="/">
            Choose another scenario
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stage}>
      <p className={styles.hook}>{moment.hook}</p>
      <p className={styles.warning} role="note">{moment.contentWarning}</p>
      <h2>What would you change?</h2>
      <p className={styles.prompt}>Choose between grounded historical near-misses or radical timeline-fracturing divergences.</p>

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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className={isExtreme ? styles.tierBadgeExtreme : styles.tierBadgePlausible}>
                    {isExtreme ? "⚡ Extreme Divergence" : "Plausible Alternative"}
                  </span>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: isSelected ? "var(--accent)" : "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap"
                  }}>
                    {isSelected ? "● Selected" : "○ Select"}
                  </span>
                </div>
                <span className={styles.pivotTitle} style={{ fontWeight: 600 }}>{pivot.label}</span>
                <span className={styles.pivotText}>{pivot.description}</span>
              </button>
              <details className={styles.why}>
                <summary>{isExtreme ? "Historical Catalyst & Critical Tipping Point" : "Why this was plausible"}</summary>
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
      <div className={styles.actions}>
        <button
          className="button"
          onClick={rewriteHistory}
          type="button"
          disabled={status === "starting"}
        >
          {status === "starting" ? "Rewriting history..." : "⚡ Rewrite history"}
        </button>
        {selected ? (
          <span className={styles.share}>
            Ready to simulate: <strong>{selected.label}</strong>
          </span>
        ) : (
          <span className={styles.share}>Pick a turning point above to begin.</span>
        )}
      </div>
      {error && <p role="alert" style={{ color: "#e74c3c", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
