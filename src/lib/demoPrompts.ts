export type DemoPrompt = {
  id: string;
  label: string;
  help: string;
  maxWords: number;
  /** Show the selected decision scenario with this prompt */
  showScenario?: boolean;
};

/**
 * Aptitude / continuity / motivation protocol.
 * Two pairs → synthesis follow-up → audio.
 */
export const demoWrittenPrompts: DemoPrompt[] = [
  {
    id: "stake",
    label: "The stake you refuse to outsource",
    help: "In the scenario you chose: what is the one judgment you would not hand to a metric, a model score, or a senior technical lead? What would you need to see to reverse that refusal? Do not define “digital humanities” — show what you treat as non-delegable.",
    maxWords: 160,
    showScenario: true,
  },
  {
    id: "decide",
    label: "Decide anyway",
    help: "The committee meets tomorrow on the same scenario. Choose one: pause / proceed / proceed-with-constraint. Defend it in concrete terms. Name the strongest objection to your choice. What evidence within 90 days would force you to switch?",
    maxWords: 160,
    showScenario: true,
  },
  {
    id: "claim",
    label: "A paper and a claim you support",
    help: "Name one research paper or chapter (author + title) you have actually read. State one claim from it that you support, in one sentence. Then say why — tied to an argument in the text, not a vibe — and name the strongest objection to that claim.",
    maxWords: 150,
  },
  {
    id: "motive",
    label: "Why a fellowship — and when you would leave",
    help: "Why a fellowship cohort rather than solo research or only a degree programme? Name the scarcest resource you need from it (time, critique, access, legitimacy, peers). Then: what concrete condition in month four would make you leave rather than coast?",
    maxWords: 140,
  },
];

export type DecisionScenario = {
  id: string;
  title: string;
  body: string;
};

/** Dropdown scenarios — choosable decision cases. */
export const decisionScenarios: DecisionScenario[] = [
  {
    id: "colonial-ocr",
    title: "Cleaning a colonial archive",
    body: "A digitisation lab offers to OCR and “clean” a colonial administrative collection so it can be searched. The cleaning step will regularise names, places, and spellings — and discard pages the model calls noise. Historians in your cohort say those irregularities are evidence. The lab can start in 72 hours. You advise: what may be automated, and what must remain an editorial decision.",
  },
  {
    id: "dialect-corpus",
    title: "A corpus that erases dialect",
    body: "A literary project wants a large corpus for distant reading. The cheapest pipeline normalises dialect, code-switching, and non-standard orthography. Without that step, the model’s scores collapse. A linguist on the team says the normalisation is the finding, not a precondition. You must recommend a rule before the scrape runs.",
  },
  {
    id: "llm-essay-marking",
    title: "The department wants an LLM to mark essays",
    body: "A literature department can unlock teaching relief if it adopts a language model to mark undergraduate essays against a rubric. Close readers say the rubric cannot see the argument they actually teach. Leadership wants a yes/no this week. What do you refuse to certify, and what procedure do you offer instead?",
  },
  {
    id: "rejected-map",
    title: "A visualisation the community rejects",
    body: "A polished map of a neighbourhood’s cultural history is ready to launch. Community partners say the categories are wrong and the confidence shading hides dispute. The technical team says changing the schema means starting over. You sit between them. What constraint do you impose this week, and what would lift it?",
  },
  {
    id: "metrics-only-lab",
    title: "Partner lab wants metrics only",
    body: "A university in your region can unlock compute and students, but the partner lab will fund only “performance and delivery” — no interpretive evaluation, no community review. You can take the partnership or walk. What do you negotiate for, what do you give up, and what would make the deal unacceptable?",
  },
  {
    id: "unconsented-translation",
    title: "Translation without speaker consent",
    body: "Engineers can stand up a translation model for a low-resource language using scraped text and a missionary dictionary. Speakers were not asked. A funder wants a demo at the symposium. At which step, if any, do you halt the work — and what must be true before implementation continues?",
  },
];

/** @deprecated Use decisionScenarios — kept for older imports */
export const thoughtExperiments = decisionScenarios;
export type ThoughtExperiment = DecisionScenario;

export const demoGroups = [
  {
    id: "group-1",
    title: "Judgment under pressure",
    elementNote: "Non-delegable stake + decide anyway (same scenario)",
    questionIds: ["stake", "decide"] as const,
    audioAfter: true,
  },
  {
    id: "group-2",
    title: "Commitment & motive",
    elementNote: "A paper and claim you support · why a cohort, and when you’d leave",
    questionIds: ["claim", "motive"] as const,
    audioAfter: true,
  },
] as const;

export const DEMO_AUDIO_COUNT = 3;

export const GOALS_AUDIO_PROMPT =
  "In about 30 seconds: where do you want your research practice to be in six months versus in a few years — and what should this fellowship change in that arc? Stay with intellectual goals, not private life.";

export function getScenario(id: string) {
  return decisionScenarios.find((s) => s.id === id);
}

export function pickScenario(seed: string): DecisionScenario {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % decisionScenarios.length;
  return decisionScenarios[idx]!;
}

/** @deprecated */
export function pickThoughtExperiment(seed: string) {
  return pickScenario(seed);
}

export function getDemoPrompt(id: string) {
  return demoWrittenPrompts.find((q) => q.id === id);
}
