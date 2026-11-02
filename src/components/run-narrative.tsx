"use client";

import { useEffect, useRef, useState } from "react";
import { narrationVoiceLabels, narrationVoices, type NarrationVoice } from "@/lib/runs/narration-voices";
import type { NarrativeQuality } from "@/lib/runs/narration-quality";
import { NarrativeQualityNotice } from "./narrative-quality-notice";
import { StoryShareCard } from "./story-share-card";
import { calculateDivergence, calculateArchitectRating } from "@/lib/play/divergence";
import { recordDiscoveredTimeline } from "@/lib/play/codex";
import type { ChoiceTier } from "@/domain/scenario";
import styles from "./run-narrative.module.css";

type Horizon = "aftermath" | "decade" | "present";
type Classification = "documented-fact" | "direct-inference" | "plausible-projection" | "highly-speculative";

interface NarrativeEvent {
  id: string;
  date: string;
  title: string;
  summary: string;
  classification: Classification;
}

interface NarrativeSeed {
  id: string;
  horizon: Horizon;
  title: string;
  summary: string;
  classification: Classification;
}

interface NarrativeSection {
  horizon: Horizon;
  text: string;
  basedOn: string[];
}

interface NarrativeSource {
  id: string;
  title: string;
  author: string;
  sourceUrl: string;
}

interface NarrativeResult {
  narrative: string;
  headline?: string | null;
  voice?: string | null;
  sections?: NarrativeSection[] | null;
  events?: NarrativeEvent[];
  seeds?: NarrativeSeed[] | null;
  sources?: NarrativeSource[];
  modelId?: string;
  generatedAt?: string;
  cached: boolean;
  validation?: NarrativeQuality | null;
}

const HORIZON_LABELS: Record<Horizon, { title: string; badge: string; className: Classification; note: string | null }> = {
  aftermath: { title: "Aftermath", badge: "Anchored in sources", className: "direct-inference", note: null },
  decade: {
    title: "The following decade",
    badge: "Reasoned projection",
    className: "plausible-projection",
    note: "Told as if it happened. A reasoned projection from the changed factors, not established history.",
  },
  present: {
    title: "The world today",
    badge: "Speculation",
    className: "highly-speculative",
    note: "Told as if it happened. An imagined present, not established history.",
  },
};

function paragraphs(text: string): string[] {
  return text.split("\n\n").filter(Boolean);
}

export function RunNarrative({
  runId,
  autoStart = false,
  scenarioId,
  scenarioTitle = "Alternate History",
  scenarioEra,
  choiceId,
  choiceTier,
  choiceLabel,
  choiceSummary,
  factorValues,
  resolvedForkCount,
  affectedFactorIds,
  speculativeSeedCount,
}: {
  runId: string;
  autoStart?: boolean;
  scenarioId?: string;
  scenarioTitle?: string;
  scenarioEra?: string;
  choiceId?: string;
  choiceTier?: ChoiceTier;
  choiceLabel?: string;
  choiceSummary?: string;
  factorValues?: Record<string, number>;
  resolvedForkCount?: number;
  affectedFactorIds?: string[];
  speculativeSeedCount?: number;
}) {
  const [result, setResult] = useState<NarrativeResult | null>(null);
  const [voice, setVoice] = useState<NarrationVoice | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "regenerating" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  async function fetchNarrative(regenerate: boolean) {
    setStatus(regenerate ? "regenerating" : "loading");
    setError(null);
    try {
      const response = await fetch(`/api/runs/${runId}/narrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerate, ...(voice ? { voice } : {}) }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Unable to generate narrative.");
      setResult(body as NarrativeResult);
      setStatus("idle");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate narrative.");
      setStatus("error");
    }
  }

  useEffect(() => {
    if (!autoStart || started.current) return;
    started.current = true;
    void fetchNarrative(false);
    // Start once per mount; the ref also keeps React strict mode from sending two requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const isBusy = status === "loading" || status === "regenerating";
  const hasNarrative = Boolean(result && result.narrative);
  const sections = result?.sections ?? [];
  const events = result?.events ?? [];
  const seeds = result?.seeds ?? [];
  const sources = result?.sources ?? [];
  const voiceLabel = result?.voice ? narrationVoiceLabels[result.voice as NarrationVoice] ?? result.voice : null;

  const presentSection = sections.find((s) => s.horizon === "present");
  const presentEcho = presentSection ? presentSection.text.split("\n\n")[0] : null;

  const divergence = calculateDivergence({
    choiceId: choiceId ?? choiceLabel ?? "divergence",
    tier: choiceTier,
    factorValues,
    resolvedForkCount,
    affectedFactorIds,
    speculativeSeedCount:
      speculativeSeedCount ??
      (seeds.length > 0
        ? seeds.filter((s) => s.classification === "highly-speculative").length
        : undefined),
    seedCount: seeds.length > 0 ? seeds.length : undefined,
  });

  const architectRating = calculateArchitectRating({
    score: divergence.score,
    factorValues,
    resolvedForkCount,
  });

  useEffect(() => {
    if (result && hasNarrative && choiceId && choiceLabel) {
      recordDiscoveredTimeline({
        scenarioId: scenarioId ?? choiceId,
        scenarioTitle,
        choiceId,
        choiceLabel,
        runId,
        divergenceScore: divergence.score,
        architectRank: architectRating.rank,
        architectTitle: architectRating.title,
      });
    }
  }, [result, hasNarrative, scenarioId, choiceId, choiceLabel, scenarioTitle, runId, divergence.score, architectRating.rank, architectRating.title]);

  return (
    <section className="run-section run-narrative">
      <h2>Narrative</h2>
      <div className={styles.body}>
        {!hasNarrative && !isBusy && (
          <p className="fork-empty">
            Render the approved, cited events and consequence seeds above into prose. The aftermath stays within the
            evidence; the decade and present sections follow the changed factors forward as an imagined timeline.
          </p>
        )}
        <div className={styles.controls}>
          <label className={styles.voiceLabel}>
            Voice{" "}
            <select value={voice} onChange={(event) => setVoice(event.target.value as NarrationVoice | "")} disabled={isBusy}>
              <option value="">Surprise me</option>
              {narrationVoices.map((item) => (
                <option key={item} value={item}>{narrationVoiceLabels[item]}</option>
              ))}
            </select>
          </label>
          {!hasNarrative && !isBusy && (
            <button className="button" onClick={() => fetchNarrative(false)} type="button">Generate narrative</button>
          )}
        </div>
        {status === "loading" && <p className={styles.loading}>The timeline is shifting...</p>}
        {status === "regenerating" && <p className={styles.loading}>Rewriting the story...</p>}
        {error && <p role="alert">{error}</p>}
        {result && hasNarrative && (
          <>
            <NarrativeQualityNotice validation={result.validation} onRegenerate={() => void fetchNarrative(true)} disabled={isBusy} />
            <StoryShareCard
              runId={runId}
              scenarioTitle={scenarioTitle}
              scenarioEra={scenarioEra}
              choiceLabel={choiceLabel || "Alternate Timeline"}
              choiceSummary={choiceSummary}
              headline={result.headline}
              presentEcho={presentEcho}
              divergenceScore={divergence.score}
              divergenceLabel={divergence.label}
              divergenceBadge={divergence.badge}
              severity={divergence.severity}
              architectRank={architectRating.rank}
              architectTitle={architectRating.title}
            />
            <div className={styles.story}>
              {result.headline && <h3 className={styles.headline}>{result.headline}</h3>}
              {sections.length > 0 ? (
                sections.map((section) => {
                  const label = HORIZON_LABELS[section.horizon];
                  return (
                    <section key={section.horizon} className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionHeading}>{label.title}</h3>
                        <span className={`event-classification ${label.className}`}>{label.badge}</span>
                      </div>
                      {label.note && <p className={styles.sectionNote}>{label.note}</p>}
                      <div className={styles.prose}>
                        {paragraphs(section.text).map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  );
                })
              ) : (
                <div className={styles.prose}>
                  {paragraphs(result.narrative).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
              <p className={styles.notice}>
                AI-generated from the sourced material listed below. The decade and present sections are imagined
                timelines told as if they happened.
              </p>
            </div>
            <div className={styles.meta}>
              {result.cached && <span className={styles.cachedBadge}>Cached</span>}
              {voiceLabel && <span className={styles.metaText}>Voice: {voiceLabel}</span>}
              {result.modelId && <span className={styles.metaText}>Model: {result.modelId}</span>}
              {result.generatedAt && (
                <span className={styles.metaText}>Generated {new Date(result.generatedAt).toLocaleString()}</span>
              )}
              <button className="button" onClick={() => fetchNarrative(true)} type="button" disabled={isBusy}>
                {isBusy ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
            <details className="narrative-sources">
              <summary>How we know ({events.length + seeds.length} items, {sources.length} sources)</summary>
              <ul className="narrative-source-list">
                {events.map((event) => (
                  <li key={event.id}>
                    <span className={`event-classification ${event.classification}`}>{event.classification}</span>
                    {" "}{event.date} - {event.title}
                  </li>
                ))}
                {seeds.map((seed) => (
                  <li key={seed.id}>
                    <span className={`event-classification ${seed.classification}`}>{seed.classification}</span>
                    {" "}{HORIZON_LABELS[seed.horizon].title} - {seed.title}
                  </li>
                ))}
              </ul>
              {sources.length > 0 && (
                <ul className="narrative-source-list">
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.title}</a>
                      {" "}({source.author})
                    </li>
                  ))}
                </ul>
              )}
            </details>
          </>
        )}
      </div>
    </section>
  );
}
