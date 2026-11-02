"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getTimelineCodex,
  getCodexStats,
  getAchievements,
} from "@/lib/play/codex";
import styles from "./timeline-codex-modal.module.css";

interface TimelineCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimelineCodexModal({ isOpen, onClose }: TimelineCodexModalProps) {
  const [activeTab, setActiveTab] = useState<"timelines" | "achievements">("timelines");

  if (!isOpen) return null;

  const codex = getTimelineCodex();
  const stats = getCodexStats(codex);
  const achievements = getAchievements(codex);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Timeline Codex">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <p className="eyebrow" style={{ margin: 0 }}>Archive & Discovery</p>
            <h2>🏛️ Timeline Codex</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close modal">
            &times;
          </button>
        </header>

        {stats && (
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Timelines Cataloged</span>
              <span className={styles.statValue}>
                {stats.totalDiscovered} / {stats.totalAvailable}
              </span>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Completion</span>
              <span className={styles.statValue}>{stats.completionPercentage}%</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Achievements</span>
              <span className={styles.statValue}>
                {stats.achievementsUnlocked} / {stats.achievementsTotal}
              </span>
            </div>
          </div>
        )}

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "timelines"}
            className={`${styles.tab} ${activeTab === "timelines" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("timelines")}
          >
            Discovered Realities ({codex.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "achievements"}
            className={`${styles.tab} ${activeTab === "achievements" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("achievements")}
          >
            Command Badges ({stats?.achievementsUnlocked ?? 0}/{stats?.achievementsTotal ?? 6})
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "timelines" ? (
            codex.length === 0 ? (
              <div className={styles.emptyState}>
                <p style={{ fontSize: "1.2rem", margin: "0 0 8px" }}>No alternate timelines cataloged yet.</p>
                <p>Select any historical scenario and trigger a divergence to log your first reality in the codex.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {codex.map((item, idx) => (
                  <article key={`${item.scenarioId}-${item.choiceId}-${idx}`} className={styles.timelineCard}>
                    <div className={styles.timelineCardHeader}>
                      <span>{item.scenarioTitle}</span>
                      {item.architectRank && (
                        <span className={styles.rankBadge}>Rank {item.architectRank}</span>
                      )}
                    </div>
                    <h4 className={styles.timelineTitle}>{item.choiceLabel}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--accent)" }}>
                        ⚡ {item.divergenceScore}% Divergence
                      </span>
                      {item.runId && (
                        <Link
                          href={`/runs/${item.runId}`}
                          style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "underline" }}
                        >
                          View Run &rarr;
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : (
            <div className={styles.grid}>
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`${styles.achievementCard} ${
                    ach.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                  }`}
                >
                  <div className={styles.achievementIcon}>{ach.icon}</div>
                  <div className={styles.achievementInfo}>
                    <h4>{ach.title} {ach.unlocked ? "✓" : "🔒"}</h4>
                    <p>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
