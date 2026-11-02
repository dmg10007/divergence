import type { Metadata } from "next";
import Link from "next/link";
import { getDailyDilemma } from "@/lib/play/daily";
import { DailyScreen } from "@/components/daily-screen";

export const metadata: Metadata = {
  title: "Daily Fracture | Divergence",
  description: "Play today's featured historical divergence. Make your call and see the global community split.",
};

export default function DailyPage() {
  const dilemma = getDailyDilemma();

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">DIVERGENCE</Link>
        <Link href="/" style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
          &larr; All Historical Scenarios
        </Link>
      </nav>

      <section className="hero">
        <p className="eyebrow">Synchronized Community Challenge</p>
        <h1>The Daily Fracture</h1>
      </section>

      <DailyScreen dilemma={dilemma} />
    </main>
  );
}
