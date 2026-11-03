"use client";

import { useState } from "react";
import Link from "next/link";
import { TimelineCodexModal } from "./timeline-codex-modal";
import { HowToPlayModal } from "./how-to-play-modal";
import { getCodexStats } from "@/lib/play/codex";
import { getDailyStreak } from "@/lib/play/daily";
import styles from "./mobile-nav.module.css";

export function MobileNav() {
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const streak = typeof window !== "undefined" ? getDailyStreak().streak : 0;
  const codexCount = typeof window !== "undefined" ? getCodexStats().totalDiscovered : 0;

  return (
    <>
      <header className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandGlyph}>⚡</span>
          <span>DIVERGENCE</span>
        </Link>

        <div className={styles.actions}>
          <Link
            className={`${styles.actionPill} ${streak > 0 ? styles.streakActive : ""}`}
            href="/daily"
            title="Daily Challenge"
          >
            <span>🔥</span>
            <span>{streak > 0 ? streak : "Daily"}</span>
          </Link>

          <button
            type="button"
            className={styles.actionPill}
            onClick={() => setIsCodexOpen(true)}
            title="Timeline Codex"
          >
            <span>🏛️</span>
            <span>{codexCount > 0 ? codexCount : "Codex"}</span>
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsHowToPlayOpen(true)}
            aria-label="How to play"
            title="How to Play"
          >
            ?
          </button>
        </div>
      </header>

      <TimelineCodexModal isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
    </>
  );
}
