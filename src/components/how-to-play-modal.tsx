"use client";

import styles from "./how-to-play-modal.module.css";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="How to Play">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            <span>⚡</span> How to Play Divergence
          </h3>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close">
            &times;
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Choose Your Divergence</h4>
              <p>
                Step into human history&apos;s greatest near-miss turning points. Pick a razor-thin judgment call that could have bent the course of nations.
              </p>
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Command Crisis Flashpoints</h4>
              <p>
                Navigate cascading tactical crisis forks. Every order shifts regional stability, political resolve, and escalation risk in real time.
              </p>
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Synthesize Reality & Catalog the Codex</h4>
              <p>
                Simulate your alternate timeline forward across three horizons, unlock command achievements, and compare your strategic Architect Rating against history!
              </p>
            </div>
          </div>

          <button className={styles.footerButton} type="button" onClick={onClose}>
            Got It &bull; Let&apos;s Play
          </button>
        </div>
      </div>
    </div>
  );
}
