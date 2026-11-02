import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { replayRun } from "@/lib/runs/replay";
import { RunNarrative } from "@/components/run-narrative";
import { FactorGauges } from "@/components/factor-gauges";
import { SimulationValidationError } from "@/domain/simulation";
import type { DeterministicSimulationState, SimulationTraceEntry } from "@/domain/simulation";
import { scenariosById } from "@/data/scenarios";

export async function generateMetadata({ params }: { params: Promise<{ runId: string }> }): Promise<Metadata> {
  const { runId } = await params;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: run } = await supabase.from("runs").select("scenario_id, basic_choice_id").eq("id", runId).maybeSingle();

    if (!run) {
      return {
        title: "Simulation Run | Your Story",
        description: "Alternate history simulation run on Your Story.",
      };
    }

    const scenario = scenariosById.get(run.scenario_id);
    const choice = scenario?.basicChoices.find((c) => c.id === run.basic_choice_id);

    const title = choice ? `${choice.label} — ${scenario?.title ?? "Your Story"}` : "Alternate History Simulation | Your Story";
    const description = choice?.interventionSummary || "Explore this alternate history timeline on Your Story.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Alternate History Run | Your Story",
      description: "Explore this alternate history timeline on Your Story.",
    };
  }
}

function describeTraceEntry(entry: SimulationTraceEntry): string | null {
  switch (entry.type) {
    case "simulation-initialized":
      return `Basic choice: ${entry.basicChoiceId}`;
    case "advanced-variable-set":
      return `${entry.variableId} set to ${entry.value} (${entry.source})`;
    case "decision-resolved":
      return `Choice: ${entry.choiceId} \u2014 ${entry.effects.map((effect) => `${effect.factorId} ${effect.delta > 0 ? "+" : ""}${effect.delta}`).join(", ")}`;
    default:
      return null;
  }
}

export default async function RunReplayPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: run, error } = await supabase.from("runs").select("*").eq("id", runId).single();

  if (error || !run) {
    return <main className="shell run-not-found">
      <p className="eyebrow">Saved run</p>
      <h1>This run could not be found.</h1>
      <p className="lede">The link may be incorrect, or the run may have been removed.</p>
      <Link className="run-back-nav" href="/">&larr; Back to Your Story</Link>
    </main>;
  }

  let state: DeterministicSimulationState | null = null;
  let replayError: string | null = null;

  try {
    state = replayRun(
      run.scenario_id,
      run.scenario_version,
      run.basic_choice_id,
      run.advanced_variable_overrides,
      run.resolved_commands,
    );
  } catch (caught) {
    replayError = caught instanceof SimulationValidationError ? caught.message : "Unable to replay this run.";
  }

  if (replayError || !state) {
    return <main className="shell run-not-found">
      <p className="eyebrow">Saved run</p>
      <h1 role="alert">{replayError}</h1>
      <Link className="run-back-nav" href="/">&larr; Back to Your Story</Link>
    </main>;
  }

  const scenario = scenariosById.get(state.scenarioId);
  const basicChoice = scenario?.basicChoices.find((choice) => choice.id === state.selectedBasicChoiceId);
  const resolvedForks = scenario?.decisionForks.filter((fork) => state.resolvedForkIds.includes(fork.id)) ?? [];

  const factorItems = (scenario?.causalFactors ?? Object.keys(state.causalFactorValues).map((id) => ({ id, label: id }))).map((factor) => ({
    id: factor.id,
    label: factor.label,
    value: state.causalFactorValues[factor.id] ?? 0,
  }));

  return <main className="shell run-page">
    <Link className="run-back-nav" href="/">&larr; Back to Your Story</Link>

    <div className="run-header">
      <p className="eyebrow">Saved deterministic run</p>
      <h1>{scenario?.title ?? state.scenarioId}</h1>
      <p className="lede">{basicChoice?.interventionSummary ?? basicChoice?.description}</p>
      <div className="run-meta">
        <span className="run-meta-pill">Scenario v{state.scenarioVersion}</span>
        <span className="run-meta-pill">{basicChoice?.label ?? state.selectedBasicChoiceId}</span>
        <span className="run-meta-pill">{state.resolvedForkIds.length} decision{state.resolvedForkIds.length === 1 ? "" : "s"} resolved</span>
      </div>
    </div>

    <section className="run-section">
      <h2>Causal factor shifts</h2>
      <FactorGauges factors={factorItems} />
    </section>

    <section className="run-section">
      <h2>Resolved decisions</h2>
      {state.resolvedForkIds.length === 0 ? (
        <p className="fork-empty">No decision forks have been resolved yet.</p>
      ) : (
        <div className="fork-list">
          {resolvedForks.length > 0
            ? resolvedForks.map((fork) => <span className="fork-badge" key={fork.id}>{fork.label}</span>)
            : state.resolvedForkIds.map((id) => <span className="fork-badge" key={id}>{id}</span>)}
        </div>
      )}
    </section>

    <RunNarrative
      runId={runId}
      autoStart
      scenarioTitle={scenario?.title}
      scenarioEra={scenario?.divergence.date}
      choiceId={basicChoice?.id}
      choiceTier={basicChoice?.tier}
      choiceLabel={basicChoice?.label}
      choiceSummary={basicChoice?.interventionSummary}
      factorValues={state.causalFactorValues}
      resolvedForkCount={state.resolvedForkIds.length}
      affectedFactorIds={
        basicChoice
          ? Array.from(
              new Set([
                ...basicChoice.narrativeEvents.flatMap((e) => e.causalFactorIds ?? []),
                ...basicChoice.consequenceSeeds.flatMap((s) => s.causalFactorIds ?? []),
              ]),
            )
          : undefined
      }
      speculativeSeedCount={
        basicChoice?.consequenceSeeds.filter((s) => s.classification === "highly-speculative").length
      }
    />

    <section className="run-section">
      <h2>Audit trace</h2>
      <ol className="trace-timeline">
        {state.trace.map((entry, index) => <li className="trace-entry" key={index}>
          <p className="trace-entry-type">{entry.type}</p>
          <p className="trace-entry-detail">{describeTraceEntry(entry)}</p>
        </li>)}
      </ol>
    </section>
  </main>;
}
