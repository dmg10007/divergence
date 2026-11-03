"use client";

import Link from "next/link";
import { getDiscoveredCountForScenario } from "@/lib/play/codex";
import type { MomentSummary } from "@/lib/play/moments";
import styles from "./scenario-card.module.css";

interface ScenarioCardProps {
  moment: MomentSummary;
}

export function ScenarioCard({ moment }: ScenarioCardProps) {
  const unlockedCount =
    typeof window !== "undefined" ? getDiscoveredCountForScenario(moment.scenarioId) : 0;

  const totalPivots = moment.pivots.length;

  return (
    <Link className={styles.card} href={`/play/${moment.scenarioId}`}>
      <div>
        <div className={styles.header}>
          <span className={styles.eraTag}>Divergence Point</span>
          <span className={styles.dateTag}>📅 {moment.date}</span>
        </div>
        <h3 className={styles.title}>{moment.title}</h3>
        <p className={styles.hook}>{moment.hook}</p>
      </div>

      <div className={styles.footer}>
        <div className={`${styles.progressPill} ${unlockedCount > 0 ? styles.progressPillActive : ""}`}>
          <span>{unlockedCount > 0 ? "●" : "○"}</span>
          <span>
            {unlockedCount > 0
              ? `${unlockedCount}/${totalPivots} Explored`
              : `${totalPivots} Paths Available`}
          </span>
        </div>
        <div className={styles.actionCta}>
          <span>Play</span>
          <span>&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
