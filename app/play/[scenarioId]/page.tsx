import Link from "next/link";
import { notFound } from "next/navigation";
import { scenariosById } from "@/data/scenarios";
import { PlayScreen } from "@/components/play-screen";
import { buildMoment } from "@/lib/play/moments";
import { MobileNav } from "@/components/mobile-nav";

export default async function PlayPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = scenariosById.get(scenarioId);
  if (!scenario) notFound();

  const moment = buildMoment(scenario);
  if (moment.pivots.length === 0) notFound();

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
        <p className="eyebrow" style={{ margin: "0 0 4px" }}>📅 {moment.date}</p>
        <h1 style={{ margin: 0 }}>{moment.title}</h1>
      </section>

      <PlayScreen moment={moment} />
    </main>
  );
}
