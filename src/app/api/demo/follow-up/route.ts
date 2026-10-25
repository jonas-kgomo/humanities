import { NextResponse } from "next/server";
import { groqChatCompletionDetailed } from "@/lib/groq";
import { getDemoPrompt } from "@/lib/demoPrompts";

export const runtime = "nodejs";

type PairAnswer = {
  questionId: string;
  label: string;
  answer: string;
};

type Body = {
  groupId?: string;
  groupTitle?: string;
  projects?: string[];
  thoughtExperimentTitle?: string;
  thoughtExperimentBody?: string;
  /** Alias — decision scenario */
  scenarioTitle?: string;
  scenarioBody?: string;
  pair?: PairAnswer[];
};

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const pair = (body.pair ?? [])
    .map((p) => ({ ...p, answer: (p.answer ?? "").trim() }))
    .filter((p) => p.answer.length > 0 && !p.answer.includes("[skip mode]"));

  if (pair.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Need both answers in the group for a synthesis follow-up." },
      { status: 400 },
    );
  }

  const [a, b] = pair;
  const labelA = getDemoPrompt(a.questionId)?.label ?? a.label;
  const labelB = getDemoPrompt(b.questionId)?.label ?? b.label;
  const thin = wordCount(a.answer) < 50 || wordCount(b.answer) < 50;

  const scenarioTitle =
    body.scenarioTitle ?? body.thoughtExperimentTitle;
  const scenarioBody = body.scenarioBody ?? body.thoughtExperimentBody;
  const isGroup2 =
    body.groupId === "group-2" ||
    /commitment|motive|claim/i.test(body.groupTitle ?? "");

  const fallback = isGroup2
    ? `You named a claim you support and a reason to join a fellowship. If defending that claim and staying in the cohort conflicted in month four, which would you drop first — and what would that cost your research?`
    : scenarioTitle
      ? `You drew a hard line in one answer and a decision in the other about “${scenarioTitle}”. Which commitment would you drop first under institutional pressure — and what would that cost the people or systems affected?`
      : `Which should govern a real pause/go call — the stake you refuse to outsource, or the decision you said you’d make tomorrow — and what observable result would reverse you?`;

  const system = isGroup2
    ? `You are a humanities interviewer for a digital-humanities fellowship.

Think carefully, then write ONE follow-up that synthesises answers A and B.

Group 2 is STANDALONE — do not reference any decision vignette from Group 1.

What “good” means:
- Press the paper/claim they support against why they want a fellowship (or when they would leave).
- Force a tradeoff: drop the claim under the objection they named, revise under peer critique, or name a quitting condition.
- If the paper is vague or the claim is vibes-only, demand a textual argument or a concrete leave condition.
- Vary form among: forced drop, month-four exit, peer objection, what they would tell a sceptical reader.
- Do NOT default to “what criterion… what evidence would falsify…”.

Hard bans:
- Incidental proper names from thin/demo answers (ignore them).
- Celebrity face-offs, identity jokes, name puns.
- “Please elaborate”, answer summaries.
- Brochure words: leverage, synergy, transformative, unlock, empower, cutting-edge, navigate, stakeholder, delve.

Output: ONLY the question (30–50 words). No preamble.`
    : `You are a humanities interviewer for a digital-humanities fellowship.

Think carefully, then write ONE follow-up that synthesises answers A and B.

What “good” means:
- Specific to THIS pair + the assigned vignette — not a reusable template.
- Force an application, tradeoff, or public commitment — not an abstract “name your criterion”.
- If they admit ignorance of an idea in the vignette (e.g. Nozick), press that gap against a claim they still made.
- If they mainly cite vibes or self-praise, press for a checkable stake under the vignette.
- Vary form among: apply-to-vignette, forced drop, what to tell the lab tomorrow, what would reverse you in 12 months.
- Do NOT default to “what criterion… what evidence would falsify…”.

Hard bans:
- Incidental proper names from thin/demo answers (ignore them).
- Celebrity face-offs, identity jokes, name puns.
- “Please elaborate”, answer summaries.
- Brochure words: leverage, synergy, transformative, unlock, empower, cutting-edge, navigate, stakeholder, delve.

Output: ONLY the question (30–50 words). No preamble.`;

  try {
    const result = await groqChatCompletionDetailed({
      model: "openai/gpt-oss-120b",
      reasoningEffort: "medium",
      includeReasoning: true,
      temperature: 0.4,
      maxTokens: 1400,
      system,
      user: JSON.stringify({
        group: body.groupTitle ?? body.groupId,
        standalone: isGroup2,
        projects: (body.projects ?? []).slice(0, 3),
        ...(isGroup2
          ? {}
          : {
              vignette: {
                title: scenarioTitle,
                body: (scenarioBody ?? "").slice(0, 700),
              },
            }),
        answerA: {
          label: labelA,
          wordCount: wordCount(a.answer),
          text: a.answer.slice(0, 900),
        },
        answerB: {
          label: labelB,
          wordCount: wordCount(b.answer),
          text: b.answer.slice(0, 900),
        },
        thinAnswers: thin,
        instruction: thin
          ? isGroup2
            ? "Answers are thin. Demand a textual claim from a named paper, or a concrete leave condition."
            : "Answers are thin. Make them apply a claim to the vignette or drop one commitment."
          : isGroup2
            ? "Find the sharpest tension between the claim they support and their fellowship motive / exit condition."
            : "Find the sharpest non-obvious tension and force a decision.",
      }),
    });

    const cleaned = result.content
      .replace(/^["“']|["”']$/g, "")
      .replace(/^(follow-?up|question)\s*:\s*/i, "")
      .trim();

    const templated =
      /what criterion governs/i.test(cleaned) &&
      /what evidence would falsify/i.test(cleaned);

    return NextResponse.json({
      ok: true,
      prompt: templated ? fallback : cleaned || fallback,
      source: templated ? "template-guard" : "gpt-oss-120b",
      groupId: body.groupId,
      reasoningTokens: result.reasoningTokens,
      // Useful while tuning; not shown to applicants by default
      debugReasoning: result.reasoning?.slice(0, 1200),
    });
  } catch (err) {
    console.error("[demo/follow-up]", err);
    return NextResponse.json({
      ok: true,
      prompt: fallback,
      source: "fallback",
      groupId: body.groupId,
    });
  }
}
