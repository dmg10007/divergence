import Link from "next/link";
import { eventPacks } from "@/data/event-packs";
import { scenarios } from "@/data/scenarios";
import { listPlayableMoments } from "@/lib/play/moments";
import { getDailyDilemma } from "@/lib/play/daily";
import { CodexTriggerButton } from "@/components/codex-trigger-button";

export default function HomePage() {
  const moments = listPlayableMoments(scenarios);
  const daily = getDailyDilemma();

  return (
    <main className="shell">
      <nav className="nav">
        <a className="brand" href="#top">DIVERGENCE</a>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link
            href="/daily"
            style={{
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ⚡ Daily #{daily.dayNumber}
          </Link>
          <CodexTriggerButton
            style={{
              padding: "6px 14px",
              fontSize: "0.82rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--line)",
            }}
          />
        </div>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">⚡ Strategic Alternate History Sandbox</p>
        <h1>Change one decision.<br />Fracture history.</h1>
        <p className="lede">
          Step into human history&apos;s greatest near-miss turning points. Change one crucial call, navigate cascading tactical crises, and explore the alternate world that could have been &mdash; fully grounded in historical sources.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <Link className="button" href="/daily">
            ⚡ Play Daily Fracture #{daily.dayNumber}
          </Link>
          <a
            className="button"
            style={{ background: "rgba(240, 228, 200, 0.08)", border: "1px solid var(--line)" }}
            href="#play"
          >
            Explore 12 Turning Points
          </a>
          <CodexTriggerButton
            style={{ background: "transparent", border: "1px solid var(--line)" }}
          />
        </div>
      </section>

      {/* DAILY FRACTURE PROMINENT BANNER */}
      <section style={{ margin: "2.5rem 0" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(207, 81, 59, 0.16) 0%, rgba(23, 28, 29, 0.95) 100%)",
            border: "1px solid var(--accent)",
            borderRadius: "16px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            boxShadow: "0 12px 32px rgba(207, 81, 59, 0.12)",
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              ⚡ Today&apos;s Global Dilemma &bull; Daily Fracture #{daily.dayNumber}
            </span>
            <h3 style={{ margin: "6px 0 8px", fontSize: "1.35rem" }}>{daily.moment.title} ({daily.moment.date})</h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>
              {daily.featuredPivot.label} vs. {daily.alternativePivot.label}. Make your tactical call and see the global historian consensus split.
            </p>
          </div>
          <Link className="button" href="/daily" style={{ whiteSpace: "nowrap" }}>
            Step into Command &rarr;
          </Link>
        </div>
      </section>

      <section className="event-section" id="play">
        <p className="eyebrow">Playable Turning Points</p>
        <h2>Pick a moment. Fracture the timeline.</h2>
        <div className="event-grid">
          {moments.map((moment) => (
            <article className="event-card" key={moment.scenarioId} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className="event-era">
                  <span>📅 {moment.date}</span> &bull; <span>{moment.pivots.length} alternate paths</span>
                </p>
                <h3>{moment.title}</h3>
                <p>{moment.hook}</p>
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "10px", alignItems: "center" }}>
                <Link className="button" href={`/play/${moment.scenarioId}`}>
                  Launch Simulation &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="principles">
        <article>
          <span>01</span>
          <h2>Curated Near-Misses</h2>
          <p>Real historical divergence moments where the fate of nations hung on a single judgment call.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Crisis Command & Causality</h2>
          <p>Navigate multi-stage tactical crisis forks with dynamic geopolitical factor tracking and architect rankings.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Timeline Codex & Daily Play</h2>
          <p>Catalog alternate realities, unlock command badges, and compete in the daily synchronized community dilemma.</p>
        </article>
      </section>

      <section className="event-section" id="event-packs">
        <p className="eyebrow">Scenario Library</p>
        <h2>Eras of divergence</h2>
        <div className="event-grid">
          {eventPacks.map((eventPack) => (
            <article className="event-card" key={eventPack.id}>
              <p className="event-era">{eventPack.era}</p>
              <h3>{eventPack.title}</h3>
              <p>{eventPack.description}</p>
              <span className="pill">{eventPack.status === "in-development" ? "In development" : eventPack.status === "available" ? "Available" : "Planned"}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
