import type { Metadata } from "next";
import Link from "next/link";
import { getDailyDilemma } from "@/lib/play/daily";
import { DailyScreen } from "@/components/daily-screen";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Daily Fracture | Divergence",
  description: "Play today's featured historical divergence. Make your call and see the global community split.",
};

export default function DailyPage() {
  const dilemma = getDailyDilemma();

  return (
    <main className="shell">
      <MobileNav />

      <div style={{ paddingTop: "12px" }}>
        <Link
          href="/"
          style={{
            color: "var(--muted)",
            fontSize: "0.82rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: 700,
          }}
        >
          &larr; All Scenarios
        </Link>
      </div>

      <section className="hero" style={{ padding: "12px 0 20px" }}>
        <p className="eyebrow" style={{ margin: "0 0 4px" }}>Synchronized Community Challenge</p>
        <h1 style={{ margin: 0 }}>The Daily Fracture</h1>
      </section>

      <DailyScreen dilemma={dilemma} />
    </main>
  );
}
