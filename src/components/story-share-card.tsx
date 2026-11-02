"use client";

import { useState } from "react";
import styles from "./story-share-card.module.css";

export interface StoryShareCardProps {
  runId: string;
  scenarioTitle: string;
  scenarioEra?: string;
  choiceLabel: string;
  choiceSummary?: string;
  headline?: string | null;
  presentEcho?: string | null;
  divergenceScore: number;
  divergenceLabel: string;
  divergenceBadge: string;
  severity?: "subtle" | "moderate" | "radical" | "extreme";
  architectRank?: string;
  architectTitle?: string;
}

export function StoryShareCard({
  runId,
  scenarioTitle,
  scenarioEra = "Alternate History",
  choiceLabel,
  choiceSummary,
  headline,
  presentEcho,
  divergenceScore,
  divergenceLabel,
  divergenceBadge,
  severity = "radical",
  architectRank,
  architectTitle,
}: StoryShareCardProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/runs/${runId}`
    : `https://divergence.app/runs/${runId}`;

  const outcomeHeadline = headline || "History Takes a Divergent Path";

  const rankLine = architectRank ? `🎖️ Command Rating: Rank ${architectRank} (${architectTitle || ""})\n` : "";

  const tweetText = `I just fractured history in Divergence: "${scenarioTitle}"\n\n` +
    `🔀 Divergence: ${choiceLabel}\n` +
    `${divergenceBadge} (${divergenceScore}% Timeline Shift)\n` +
    rankLine +
    `🗞️ Outcome: "${outcomeHeadline}"\n\n` +
    `Explore this alternate timeline:`;

  const discordMarkdown = `📜 **DIVERGENCE: Alternate History Simulation**\n` +
    `🏛️ **Scenario**: ${scenarioTitle} (${scenarioEra})\n` +
    `🔀 **Divergence**: ${choiceLabel}\n` +
    `⚡ **Timeline Divergence**: ${divergenceScore}% — ${divergenceLabel}\n` +
    (architectRank ? `🎖️ **Command Rating**: Rank ${architectRank} (${architectTitle || ""})\n` : "") +
    `🗞️ **Outcome**: *"${outcomeHeadline}"*\n` +
    (presentEcho ? `🌐 **Present Day Reality**: ${presentEcho}\n` : "") +
    `👉 **Explore & Replay**: ${shareUrl}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Could not copy link");
    }
  }

  async function handleCopyDiscord() {
    try {
      await navigator.clipboard.writeText(discordMarkdown);
      showToast("Discord / Reddit card copied!");
    } catch {
      showToast("Could not copy summary");
    }
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;

  const badgeClass =
    severity === "extreme"
      ? styles.badgeExtreme
      : severity === "radical"
      ? styles.badgeRadical
      : severity === "moderate"
      ? styles.badgeModerate
      : styles.badge;

  return (
    <div className={styles.wrapper}>
      <article className={styles.card} aria-label="Timeline Recap Card">
        <header className={styles.header}>
          <span className={styles.scenarioTag}>
            <span>🏛️</span>
            <span>{scenarioEra} &bull; {scenarioTitle}</span>
          </span>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            {architectRank && (
              <span style={{
                background: "rgba(207, 81, 59, 0.2)",
                border: "1px solid var(--accent)",
                color: "var(--ink)",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "3px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Rank {architectRank}
              </span>
            )}
            <span className={`${styles.badge} ${badgeClass}`}>
              {divergenceBadge}
            </span>
          </div>
        </header>

        <div className={styles.meterContainer}>
          <div className={styles.meterHeader}>
            <span>Timeline Divergence</span>
            <span className={styles.scoreNumber}>{divergenceScore}% &mdash; {divergenceLabel}</span>
          </div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${divergenceScore}%` }} />
          </div>
        </div>

        <div className={styles.mainDivergence}>
          <div className={styles.choiceTitle}>Your Turning Point</div>
          <h3 className={styles.choiceName}>{choiceLabel}</h3>
          {choiceSummary && <p className="lede" style={{ fontSize: "0.95rem", margin: 0 }}>{choiceSummary}</p>}
        </div>

        {headline && (
          <div className={styles.headlineBox}>
            <div className={styles.headlineLabel}>Transmitted Headline</div>
            <p className={styles.headlineText}>&ldquo;{headline}&rdquo;</p>
          </div>
        )}

        {presentEcho && (
          <div className={styles.modernEcho}>
            <strong>Present Day Echo:</strong> {presentEcho}
          </div>
        )}

        <footer className={styles.footer}>
          <span>SIMULATION ARCHIVE</span>
          <span className={styles.watermark}>run:{runId.slice(0, 8)}</span>
        </footer>
      </article>

      <div className={styles.actions}>
        <a
          href={twitterIntentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.shareBtn} ${styles.shareBtnTwitter}`}
        >
          <span>𝕏</span> Share on X
        </a>
        <button
          type="button"
          onClick={handleCopyDiscord}
          className={styles.shareBtn}
        >
          <span>💬</span> Copy for Discord / Reddit
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className={`${styles.shareBtn} ${styles.shareBtnPrimary}`}
        >
          <span>🔗</span> Copy Story Link
        </button>
        {toastMessage && <span className={styles.toast}>✓ {toastMessage}</span>}
      </div>
    </div>
  );
}
