"use client";

import { useState } from "react";
import Link from "next/link";
import { RunNarrative } from "@/components/run-narrative";
import {
  type DailyDilemma,
  getDailyStreak,
  recordDailyCompletion,
  type DailyStreakState,
} from "@/lib/play/daily";
import { addRunToHistory } from "@/lib/runs/local-run-history";
import styles from "./daily-screen.module.css";

interface DailyScreenProps {
  dilemma: DailyDilemma;
}

export function DailyScreen({ dilemma }: DailyScreenProps) {
  const [selectedPivotId, setSelectedPivotId] = useState<string | null>(null);
  const [streakState, setStreakState] = useState<DailyStreakState>(() =>
    getDailyStreak(dilemma.dateString),
  );
  const [hasRevealedSplit, setHasRevealedSplit] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "starting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedPivot =
    selectedPivotId === dilemma.featuredPivot.id
      ? dilemma.featuredPivot
      : selectedPivotId === dilemma.alternativePivot.id
      ? dilemma.alternativePivot
      : null;

  async function handleLockDecision() {
    if (!selectedPivot) {
      setError("Please select one of the two historical paths to proceed.");
      return;
    }

    setHasRevealedSplit(true);
    setStatus("starting");
    setError(null);

    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: dilemma.moment.scenarioId,
          basicChoiceId: selectedPivot.id,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Unable to synthesize simulation.");

      const updatedStreak = recordDailyCompletion(dilemma.dateString);
      setStreakState(updatedStreak);

      addRunToHistory({
        runId: body.runId,
        scenarioId: dilemma.moment.scenarioId,
        createdAt: new Date().toISOString(),
      });
      setRunId(body.runId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to simulate daily run.");
    } finally {
      setStatus("idle");
    }
  }

  function handleShareDaily() {
    if (!selectedPivot) return;
    const splitPercent =
      selectedPivot.id === dilemma.featuredPivot.id
        ? dilemma.communitySplit.featuredPercent
        : dilemma.communitySplit.alternativePercent;

    const shareText = `DIVERGENCE Daily #${dilemma.dayNumber} ⚡\n` +
      `🏛️ ${dilemma.moment.title} (${dilemma.moment.date})\n` +
      `🔀 Decision: ${selectedPivot.label}\n` +
      `👥 Community: ${splitPercent}% of historians made this call\n` +
      `🔥 Daily Streak: ${streakState.streak} Day${streakState.streak === 1 ? "" : "s"}\n\n` +
      `Play today's dilemma:\n` +
      `https://divergence.app/daily`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setToastMessage("Daily Challenge result copied to clipboard!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.dailyBanner}>
        <div className={styles.dailyTag}>
          <span className={styles.dailyNumber}>⚡ Daily Fracture #{dilemma.dayNumber}</span>
          <h2 className={styles.dailyDate}>{dilemma.moment.title}</h2>
          <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{dilemma.moment.date}</span>
        </div>
        <div className={styles.streakBadge}>
          <span>🔥</span>
          <span>
            {streakState.streak} Day Streak {streakState.hasPlayedToday ? "(Active)" : ""}
          </span>
        </div>
      </div>

      <p className="lede" style={{ margin: 0, maxWidth: "780px" }}>
        {dilemma.moment.hook}
      </p>

      {/* RESULT VIEW */}
      {runId && selectedPivot && (
        <div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            <button className="button" onClick={handleShareDaily} type="button">
              📋 Share Daily Result
            </button>
            {toastMessage && <span style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 700 }}>{toastMessage}</span>}
          </div>

          <RunNarrative
            key={runId}
            runId={runId}
            autoStart
            scenarioId={dilemma.moment.scenarioId}
            scenarioTitle={dilemma.moment.title}
            scenarioEra={dilemma.moment.date}
            choiceId={selectedPivot.id}
            choiceTier={selectedPivot.tier}
            choiceLabel={selectedPivot.label}
            choiceSummary={selectedPivot.interventionSummary}
            affectedFactorIds={selectedPivot.affectedFactorIds}
            speculativeSeedCount={selectedPivot.speculativeSeedCount}
          />
        </div>
      )}

      {/* DILEMMA CARDS */}
      {!runId && (
        <>
          <div className={styles.dilemmaGrid}>
            <button
              type="button"
              className={`${styles.dilemmaCard} ${
                selectedPivotId === dilemma.featuredPivot.id ? styles.dilemmaCardSelected : ""
              }`}
              onClick={() => {
                setSelectedPivotId(dilemma.featuredPivot.id);
                setError(null);
              }}
            >
              <div>
                <p className="eyebrow" style={{ margin: "0 0 6px" }}>Option Alpha</p>
                <h3 style={{ margin: "0 0 8px" }}>{dilemma.featuredPivot.label}</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                  {dilemma.featuredPivot.description}
                </p>
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)" }}>
                {selectedPivotId === dilemma.featuredPivot.id ? "● Selected Choice" : "○ Choose Path Alpha"}
              </div>
            </button>

            <button
              type="button"
              className={`${styles.dilemmaCard} ${
                selectedPivotId === dilemma.alternativePivot.id ? styles.dilemmaCardSelected : ""
              }`}
              onClick={() => {
                setSelectedPivotId(dilemma.alternativePivot.id);
                setError(null);
              }}
            >
              <div>
                <p className="eyebrow" style={{ margin: "0 0 6px" }}>Option Bravo</p>
                <h3 style={{ margin: "0 0 8px" }}>{dilemma.alternativePivot.label}</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                  {dilemma.alternativePivot.description}
                </p>
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)" }}>
                {selectedPivotId === dilemma.alternativePivot.id ? "● Selected Choice" : "○ Choose Path Bravo"}
              </div>
            </button>
          </div>

          {/* COMMUNITY CONSENSUS BAR */}
          {hasRevealedSplit && (
            <div className={styles.communitySplitBox}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>Global Historian Consensus</span>
                <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Live Simulation Split</span>
              </div>
              <div className={styles.splitBarTrack}>
                <div
                  className={styles.splitBarFillA}
                  style={{ width: `${dilemma.communitySplit.featuredPercent}%` }}
                />
                <div
                  className={styles.splitBarFillB}
                  style={{ width: `${dilemma.communitySplit.alternativePercent}%` }}
                />
              </div>
              <div className={styles.splitLegend}>
                <span>
                  Option Alpha: {dilemma.communitySplit.featuredPercent}%
                </span>
                <span>
                  Option Bravo: {dilemma.communitySplit.alternativePercent}%
                </span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
            <button
              className="button"
              type="button"
              onClick={handleLockDecision}
              disabled={status === "starting" || !selectedPivot}
            >
              {status === "starting" ? "Fracturing Timeline..." : "⚡ Lock Decision & Synthesize"}
            </button>
            <Link className="button" style={{ background: "transparent", border: "1px solid var(--line)" }} href="/">
              &larr; Return to Library
            </Link>
          </div>

          {error && <p role="alert" style={{ color: "#e74c3c", margin: 0 }}>{error}</p>}
        </>
      )}
    </div>
  );
}
