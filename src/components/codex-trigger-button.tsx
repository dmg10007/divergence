"use client";

import { useState } from "react";
import { TimelineCodexModal } from "./timeline-codex-modal";
import { getCodexStats, type CodexStats } from "@/lib/play/codex";

export function CodexTriggerButton({
  style,
  className = "button",
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<CodexStats | null>(() =>
    typeof window !== "undefined" ? getCodexStats() : null,
  );

  function handleOpen() {
    setStats(getCodexStats());
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setStats(getCodexStats());
  }

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={handleOpen}
      >
        🏛️ Codex {stats && stats.totalDiscovered > 0 ? `(${stats.totalDiscovered})` : ""}
      </button>

      <TimelineCodexModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
