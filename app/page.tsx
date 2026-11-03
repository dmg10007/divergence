import Link from "next/link";
import { scenarios } from "@/data/scenarios";
import { listPlayableMoments } from "@/lib/play/moments";
import { getDailyDilemma } from "@/lib/play/daily";
import { MobileNav } from "@/components/mobile-nav";
import { ScenarioLibrary } from "@/components/scenario-library";

export default function HomePage() {
  const moments = listPlayableMoments(scenarios);
  const daily = getDailyDilemma();

  return (
    <main className="shell">
      <MobileNav />

      <section className="hero">
        <p className="eyebrow">⚡ Alternate History Simulation Game</p>
        <h1>Change one call.<br />Fracture history.</h1>
        <p className="lede">
          Step into human history&apos;s greatest razor-thin turning points. Navigate cascading tactical crises and explore the alternate realities that could have been.
        </p>
      </section>

      {/* DAILY FRACTURE HERO CARD */}
      <section style={{ margin: "12px 0 24px" }}>
        <Link
          href="/daily"
          style={{
            display: "block",
            background: "linear-gradient(135deg, rgba(207, 81, 59, 0.18) 0%, rgba(26, 32, 34, 0.95) 100%)",
            border: "1px solid var(--accent)",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 10px 28px rgba(207, 81, 59, 0.15)",
            touchAction: "manipulation",
            transition: "transform 120ms ease, box-shadow 120ms ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              ⚡ Daily Challenge #{daily.dayNumber}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              📅 Today
            </span>
          </div>

          <h3 style={{ margin: "0 0 6px", fontSize: "1.25rem", color: "#fff", fontWeight: 800 }}>
            {daily.moment.title}
          </h3>

          <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.45 }}>
            {daily.featuredPivot.label} vs. {daily.alternativePivot.label}.
          </p>

          <div
            className="button"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "0.92rem",
            }}
          >
            Play Today&apos;s Dilemma &rarr;
          </div>
        </Link>
      </section>

      {/* SCENARIO CATALOG WITH ERA TABS */}
      <section className="event-section" id="play" style={{ padding: "8px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
          <div>
            <p className="eyebrow" style={{ margin: "0 0 2px" }}>Scenario Library</p>
            <h2 style={{ margin: 0 }}>Turning Points</h2>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            {moments.length} Available
          </span>
        </div>

        <ScenarioLibrary moments={moments} />
      </section>
    </main>
  );
}
