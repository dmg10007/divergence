import { z } from "zod";

const historicalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}(-\d{2})?$/, "Use YYYY-MM or YYYY-MM-DD")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    if (month < 1 || month > 12) return false;
    if (day === undefined) return true;
    return new Date(Date.UTC(year, month - 1, day)).getUTCFullYear() === year
      && new Date(Date.UTC(year, month - 1, day)).getUTCMonth() === month - 1
      && new Date(Date.UTC(year, month - 1, day)).getUTCDate() === day;
  }, "Use a real calendar date");

const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  kind: z.enum(["primary", "secondary", "reference"]),
  version: z.string().min(1),
  publishedYear: z.number().int().min(1),
  sourceUrl: z.string().url(),
  locator: z.string().min(1),
  claimsSupported: z.array(z.string().min(1)).min(1),
  rightsNote: z.string().min(1),
  reviewStatus: z.enum(["draft", "reviewed", "approved"]),
});

const classificationSchema = z.enum(["documented-fact", "direct-inference", "plausible-projection", "highly-speculative"]);

type Classification = z.infer<typeof classificationSchema>;

const narrativeEventSchema = z.object({
  id: z.string().min(1),
  date: historicalDateSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  classification: classificationSchema,
  evidenceIds: z.array(z.string().min(1)).min(1),
  causalFactorIds: z.array(z.string().min(1)),
});

export const narrativeHorizons = ["aftermath", "decade", "present"] as const;

export type NarrativeHorizon = (typeof narrativeHorizons)[number];

/**
 * Consequence seeds are counterfactual, so none may be documented fact. Evidence
 * strength must decay with distance from the pivot: near-term seeds are inferences
 * or projections, decade seeds are projections or speculation, and anything that
 * reaches the present day is speculation.
 */
export const seedClassificationsByHorizon: Record<NarrativeHorizon, readonly Classification[]> = {
  aftermath: ["direct-inference", "plausible-projection"],
  decade: ["plausible-projection", "highly-speculative"],
  present: ["highly-speculative"],
};

const consequenceSeedSchema = z.object({
  id: z.string().min(1),
  horizon: z.enum(narrativeHorizons),
  title: z.string().min(1),
  summary: z.string().min(1),
  classification: classificationSchema,
  basis: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)).min(1),
  causalFactorIds: z.array(z.string().min(1)),
});

export type ConsequenceSeed = z.infer<typeof consequenceSeedSchema>;

const seedSelectionSchema = z.object({
  aftermath: z.number().int().min(0).default(2),
  decade: z.number().int().min(0).default(2),
  present: z.number().int().min(0).default(1),
});

const plausibilitySchema = z.object({
  minimalRewrite: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)).min(1),
});

const factorEffectSchema = z.object({
  factorId: z.string().min(1),
  delta: z.number(),
});

const availabilityConditionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("choice-resolved"),
    forkId: z.string().min(1),
    choiceIds: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal("factor-at-least"),
    factorId: z.string().min(1),
    value: z.number(),
  }),
]);

export type AvailabilityCondition = z.infer<typeof availabilityConditionSchema>;

export const choiceTiers = ["plausible-alternative", "extreme-divergence"] as const;
export type ChoiceTier = (typeof choiceTiers)[number];

const basicChoiceSchema = z.object({
  id: z.string().min(1),
  tier: z.enum(choiceTiers).default("plausible-alternative"),
  label: z.string().min(1),
  description: z.string().min(1),
  interventionSummary: z.string().min(1),
  narrativeEvents: z.array(narrativeEventSchema).default([]),
  plausibility: plausibilitySchema.optional(),
  consequenceSeeds: z.array(consequenceSeedSchema).default([]),
  seedSelection: seedSelectionSchema.default({}),
});

const decisionChoiceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  effects: z.array(factorEffectSchema).min(1),
  narrativeEvents: z.array(narrativeEventSchema).default([]),
});

export const scenarioSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    eventPackId: z.string().min(1),
    status: z.enum(["draft", "reviewed", "available"]),
    version: z.string().min(1),
    sourceLibraryVersion: z.string().min(1),
    divergence: z.object({
      date: historicalDateSchema,
      historicalEvent: z.string().min(1),
      counterfactualPremise: z.string().min(1),
      initialConditions: z.array(z.string().min(1)).min(1),
    }),
    contentWarning: z.string().min(1),
    baselineSummary: z.string().min(1),
    sources: z.array(sourceSchema).min(1),
    basicChoices: z.array(basicChoiceSchema).min(2),
    advancedVariables: z.array(z.object({
      id: z.string().min(1),
      category: z.enum(["politics", "military", "leadership", "publicOpinion", "technology", "economy", "diplomacy"]),
      label: z.string().min(1),
      baseline: z.number(),
      minimum: z.number(),
      maximum: z.number(),
      step: z.number().positive(),
      affectedFactorIds: z.array(z.string().min(1)).min(1),
    })).min(1),
    causalFactors: z.array(z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      evidenceIds: z.array(z.string().min(1)).min(1),
    })).min(1),
    decisionForks: z.array(z.object({
      id: z.string().min(1),
      date: historicalDateSchema,
      label: z.string().min(1),
      availableWhen: z.array(availabilityConditionSchema).default([]),
      choices: z.array(decisionChoiceSchema).min(2),
    })),
  })
  .superRefine((scenario, ctx) => {
    const addDuplicateIssues = (items: { id: string }[], path: string) => {
      const ids = new Set<string>();
      items.forEach((item, index) => {
        if (ids.has(item.id)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path, index, "id"], message: `Duplicate ${path} ID: ${item.id}` });
        }
        ids.add(item.id);
      });
    };

    addDuplicateIssues(scenario.sources, "sources");
    addDuplicateIssues(scenario.basicChoices, "basicChoices");
    addDuplicateIssues(scenario.advancedVariables, "advancedVariables");
    addDuplicateIssues(scenario.causalFactors, "causalFactors");
    addDuplicateIssues(scenario.decisionForks, "decisionForks");

    const sourceIds = new Set(scenario.sources.map(({ id }) => id));
    const factorIds = new Set(scenario.causalFactors.map(({ id }) => id));

    scenario.advancedVariables.forEach((variable, index) => {
      if (variable.minimum > variable.maximum) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["advancedVariables", index], message: "minimum must not exceed maximum" });
      }
      if (variable.baseline < variable.minimum || variable.baseline > variable.maximum) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["advancedVariables", index, "baseline"], message: "baseline must be within minimum and maximum" });
      }
      if ((variable.baseline - variable.minimum) % variable.step !== 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["advancedVariables", index, "step"], message: "baseline must align with step from minimum" });
      }
      variable.affectedFactorIds.forEach((factorId, factorIndex) => {
        if (!factorIds.has(factorId)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["advancedVariables", index, "affectedFactorIds", factorIndex], message: `Unknown causal factor: ${factorId}` });
        }
      });
    });

    scenario.causalFactors.forEach((factor, index) => {
      factor.evidenceIds.forEach((evidenceId, evidenceIndex) => {
        if (!sourceIds.has(evidenceId)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["causalFactors", index, "evidenceIds", evidenceIndex], message: `Unknown source: ${evidenceId}` });
        }
      });
    });

    const validateNarrativeEvents = (events: { evidenceIds: string[]; causalFactorIds: string[] }[], path: (string | number)[]) => {
      events.forEach((event, eventIndex) => {
        event.evidenceIds.forEach((evidenceId, evidenceIndex) => {
          if (!sourceIds.has(evidenceId)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...path, eventIndex, "evidenceIds", evidenceIndex], message: `Unknown source: ${evidenceId}` });
          }
        });
        event.causalFactorIds.forEach((factorId, factorIndex) => {
          if (!factorIds.has(factorId)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...path, eventIndex, "causalFactorIds", factorIndex], message: `Unknown causal factor: ${factorId}` });
          }
        });
      });
    };

    scenario.basicChoices.forEach((choice, choiceIndex) => {
      validateNarrativeEvents(choice.narrativeEvents, ["basicChoices", choiceIndex, "narrativeEvents"]);
    });

    const eventIds = new Set<string>([
      ...scenario.basicChoices.flatMap((choice) => choice.narrativeEvents.map(({ id }) => id)),
      ...scenario.decisionForks.flatMap((fork) => fork.choices.flatMap((choice) => choice.narrativeEvents.map(({ id }) => id))),
    ]);
    const seedIds = new Set<string>();

    scenario.basicChoices.forEach((choice, choiceIndex) => {
      const choicePath = ["basicChoices", choiceIndex];

      choice.plausibility?.evidenceIds.forEach((evidenceId, evidenceIndex) => {
        if (!sourceIds.has(evidenceId)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...choicePath, "plausibility", "evidenceIds", evidenceIndex], message: `Unknown source: ${evidenceId}` });
        }
      });

      if (choice.consequenceSeeds.length > 0 && !choice.plausibility) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...choicePath, "plausibility"], message: "A choice with consequence seeds must document its minimal-rewrite plausibility" });
      }

      choice.consequenceSeeds.forEach((seed, seedIndex) => {
        const seedPath = [...choicePath, "consequenceSeeds", seedIndex];
        if (seedIds.has(seed.id)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...seedPath, "id"], message: `Duplicate consequenceSeeds ID: ${seed.id}` });
        }
        seedIds.add(seed.id);
        if (eventIds.has(seed.id)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...seedPath, "id"], message: `Seed ID collides with a narrative event ID: ${seed.id}` });
        }
        if (!seedClassificationsByHorizon[seed.horizon].includes(seed.classification)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...seedPath, "classification"], message: `A ${seed.horizon} seed cannot be classified ${seed.classification}` });
        }
        seed.evidenceIds.forEach((evidenceId, evidenceIndex) => {
          if (!sourceIds.has(evidenceId)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...seedPath, "evidenceIds", evidenceIndex], message: `Unknown source: ${evidenceId}` });
          }
        });
        seed.causalFactorIds.forEach((factorId, factorIndex) => {
          if (!factorIds.has(factorId)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...seedPath, "causalFactorIds", factorIndex], message: `Unknown causal factor: ${factorId}` });
          }
        });
      });

      if (choice.consequenceSeeds.length > 0) {
        narrativeHorizons.forEach((horizon) => {
          const available = choice.consequenceSeeds.filter((seed) => seed.horizon === horizon).length;
          if (available < choice.seedSelection[horizon]) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...choicePath, "seedSelection", horizon], message: `seedSelection.${horizon} requests ${choice.seedSelection[horizon]} seeds but only ${available} are authored` });
          }
        });
      }
    });

    scenario.decisionForks.forEach((fork, forkIndex) => {
      addDuplicateIssues(fork.choices, `decisionForks.${forkIndex}.choices`);
      fork.availableWhen.forEach((condition, conditionIndex) => {
        const conditionPath = ["decisionForks", forkIndex, "availableWhen", conditionIndex];
        if (condition.type === "choice-resolved") {
          const priorIndex = scenario.decisionForks.findIndex(({ id }) => id === condition.forkId);
          if (priorIndex === -1) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...conditionPath, "forkId"], message: `Unknown decision fork: ${condition.forkId}` });
          } else if (priorIndex >= forkIndex) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...conditionPath, "forkId"], message: `A fork may only depend on a fork declared before it: ${condition.forkId}` });
          } else {
            const priorFork = scenario.decisionForks[priorIndex];
            condition.choiceIds.forEach((choiceId, choiceIdIndex) => {
              if (!priorFork.choices.some(({ id }) => id === choiceId)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...conditionPath, "choiceIds", choiceIdIndex], message: `Unknown choice ${choiceId} for decision fork ${condition.forkId}` });
              }
            });
          }
        } else if (!factorIds.has(condition.factorId)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [...conditionPath, "factorId"], message: `Unknown causal factor: ${condition.factorId}` });
        }
      });
      fork.choices.forEach((choice, choiceIndex) => {
        choice.effects.forEach((effect, effectIndex) => {
          if (!factorIds.has(effect.factorId)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["decisionForks", forkIndex, "choices", choiceIndex, "effects", effectIndex, "factorId"], message: `Unknown causal factor: ${effect.factorId}` });
          }
        });
        validateNarrativeEvents(choice.narrativeEvents, ["decisionForks", forkIndex, "choices", choiceIndex, "narrativeEvents"]);
      });
    });

    if (scenario.status !== "draft") {
      scenario.sources.forEach((source, index) => {
        if (source.reviewStatus === "draft") {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sources", index, "reviewStatus"], message: "Reviewed or available scenarios cannot use draft sources" });
        }
      });
    }
  });

export type ScenarioDefinition = z.infer<typeof scenarioSchema>;

export function safeParseScenario(input: unknown) {
  return scenarioSchema.safeParse(input);
}
