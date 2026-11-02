# Divergence

**Divergence** is a source-grounded strategic alternate-history simulation game. A player steps into human history's greatest near-miss turning points, changes one crucial decision, navigates cascading tactical crisis forks, and watches the timeline fracture forward through evidence-based geopolitical causal modeling and source-anchored narration.

> This is a narrative simulation game, not a predictive engine. The product strictly separates established primary sources, structured causal inference, and long-range speculative projections.

## Core Gameplay Features

- **12 Curated Eras & 72 Playable Pivots**: From Constantinople 1453 and Spanish Armada 1588 to Dunkirk 1940, the Cuban Missile Crisis 1962, and Petrov 1983.
- **Interactive Crisis Command**: Step into the decision room. Navigate sequential tactical decision forks that dynamically alter regional stability, casualty thresholds, and escalation risk before synthesizing timeline reality.
- **Dynamic Geopolitical Factor Gauges**: Live +/- meters tracking causal variables (military force availability, political resolve, escalation thresholds).
- **Timeline Divergence Index & Architect Ratings**: Real-time divergence scoring (0–100%) and command performance evaluations (S-Rank Master Strategist down to Ω-Rank Timeline Catastrophe).
- **The Timeline Codex & Achievement System**: Catalog discovered alternate timelines, track completion across 72 branches, and unlock command badges.
- **The Daily Fracture**: A daily synchronized community challenge where players make their call on a featured historical dilemma and compare their decision against the global historian consensus split.
- **Exportable Story Cards**: High-impact recap cards formatted with Web Share API, clipboard permalinks, and Reddit/Discord markdown cards.

## Architecture

```text
Point of Divergence → Decision Chain → Causal Graph & Factor Shifts → Sampled Seeds → Grounded Narration → Timeline Codex
```

## Local Development

Requires Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Repository Layout

```text
app/                  Next.js App Router routes, API handlers, and styles
src/components/       Tactical UI components (PlayScreen, FactorGauges, DailyScreen, TimelineCodexModal)
src/data/             12 historical scenarios, 72 turning points, consequence seeds, and primary sources
src/domain/           Framework-independent domain contracts (Scenario, Simulation, Availability)
src/lib/play/         Divergence calculation, Daily Fracture engine, Timeline Codex, and Moments
src/lib/runs/         Deterministic engine replay, Groq LLM narration pipeline, and quality validation
docs/                 Product and architectural documentation
```

## Environment

Copy `.env.example` to `.env.local` to configure narration API providers (Groq) or database sync (Supabase).
