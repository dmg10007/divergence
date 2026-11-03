"use client";

import { useState } from "react";
import type { MomentSummary } from "@/lib/play/moments";
import { ScenarioCard } from "./scenario-card";
import styles from "./scenario-library.module.css";

type EraCategory = "all" | "ww2" | "cold-war" | "early-modern" | "ancient";

function getEraForScenario(scenarioId: string): EraCategory {
  if (
    scenarioId.includes("dunkirk") ||
    scenarioId.includes("barbarossa") ||
    scenarioId.includes("midway")
  ) {
    return "ww2";
  }
  if (
    scenarioId.includes("berlin") ||
    scenarioId.includes("cuban") ||
    scenarioId.includes("moon") ||
    scenarioId.includes("petrov")
  ) {
    return "cold-war";
  }
  if (
    scenarioId.includes("yorktown") ||
    scenarioId.includes("gettysburg") ||
    scenarioId.includes("july")
  ) {
    return "early-modern";
  }
  return "ancient";
}

export function ScenarioLibrary({ moments }: { moments: MomentSummary[] }) {
  const [selectedEra, setSelectedEra] = useState<EraCategory>("all");

  const filtered =
    selectedEra === "all"
      ? moments
      : moments.filter((m) => getEraForScenario(m.scenarioId) === selectedEra);

  return (
    <div className={styles.container}>
      <div className={styles.filtersWrapper} role="tablist" aria-label="Era filter">
        <button
          type="button"
          className={`${styles.filterPill} ${selectedEra === "all" ? styles.filterPillActive : ""}`}
          onClick={() => setSelectedEra("all")}
        >
          All ({moments.length})
        </button>
        <button
          type="button"
          className={`${styles.filterPill} ${selectedEra === "ww2" ? styles.filterPillActive : ""}`}
          onClick={() => setSelectedEra("ww2")}
        >
          World War II (3)
        </button>
        <button
          type="button"
          className={`${styles.filterPill} ${selectedEra === "cold-war" ? styles.filterPillActive : ""}`}
          onClick={() => setSelectedEra("cold-war")}
        >
          Cold War (4)
        </button>
        <button
          type="button"
          className={`${styles.filterPill} ${selectedEra === "early-modern" ? styles.filterPillActive : ""}`}
          onClick={() => setSelectedEra("early-modern")}
        >
          18th &bull; 19th C. (3)
        </button>
        <button
          type="button"
          className={`${styles.filterPill} ${selectedEra === "ancient" ? styles.filterPillActive : ""}`}
          onClick={() => setSelectedEra("ancient")}
        >
          Renaissance &bull; Medieval (2)
        </button>
      </div>

      <div className={styles.grid}>
        {filtered.map((moment) => (
          <ScenarioCard key={moment.scenarioId} moment={moment} />
        ))}
      </div>
    </div>
  );
}
