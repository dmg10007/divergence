import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScenario, replayRun } from "@/lib/runs/replay";
import { SimulationValidationError } from "@/domain/simulation";

// GET /api/runs (list the caller's own runs) is deferred until magic-link auth
// is added. For now every run is anonymous, so there is no session to scope a
// list to; the client tracks its own run IDs in localStorage instead.

export async function POST(request: NextRequest) {
  const { scenarioId, basicChoiceId, advancedVariableOverrides, resolvedCommands } = await request.json();

  try {
    const scenario = getScenario(scenarioId);
    const commands = Array.isArray(resolvedCommands) ? resolvedCommands : [];
    const state = replayRun(scenario.id, scenario.version, basicChoiceId, advancedVariableOverrides ?? {}, commands);

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("runs")
      .insert({
        scenario_id: scenario.id,
        scenario_version: scenario.version,
        basic_choice_id: basicChoiceId,
        advanced_variable_overrides: advancedVariableOverrides ?? {},
        resolved_commands: commands,
        cached_state: state,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert failed for /api/runs:", error);
      throw error;
    }
    return NextResponse.json({ runId: data.id });
  } catch (caught) {
    console.error("POST /api/runs failed:", caught);
    const message = caught instanceof SimulationValidationError
      ? caught.message
      : caught instanceof Error
        ? caught.message
        : "Unable to create run";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
