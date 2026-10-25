import { NextResponse } from "next/server";
import { groqChatCompletionDetailed } from "@/lib/groq";
import { DEMO_AUDIO_COUNT, GOALS_AUDIO_PROMPT } from "@/lib/demoPrompts";

export const runtime = "nodejs";

type PriorClip = { prompt: string; transcript: string };

type Body = {
  index?: number;
  projects?: string[];
  thoughtExperimentTitle?: string;
  thoughtExperimentBody?: string;
  scenarioTitle?: string;
  scenarioBody?: string;
  answers?: Record<string, string>;
  textClarifications?: {
    groupId: string;
    prompt: string;
    answer: string;
  }[];
  priorAudio?: PriorClip[];
};

function bankPrompt(index: number) {
  if (index === 2) return GOALS_AUDIO_PROMPT;
  if (index === 0) {
    return "In about 25 seconds: in the scenario you chose, what would you tell the committee to do tomorrow — and what result in 90 days would reverse you?";
  }
  return "In about 25 seconds: name the claim from your paper you would drop first under pressure — or the month-four condition that would make you leave the fellowship.";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const index = Math.max(0, Math.min(DEMO_AUDIO_COUNT - 1, body.index ?? 0));
  const fallback = bankPrompt(index);
  const scenarioTitle =
    body.scenarioTitle ?? body.thoughtExperimentTitle;
  const scenarioBody = body.scenarioBody ?? body.thoughtExperimentBody;

  if (index === 2) {
    return NextResponse.json({
      ok: true,
      prompt: GOALS_AUDIO_PROMPT,
      source: "fixed-goals",
      index,
    });
  }

  const role =
    index === 0
      ? "You are pressing GROUP 1: the stake they refuse to outsource + their decide-anyway call, plus their synthesis follow-up."
      : "You are pressing GROUP 2: the paper/claim they support + why they want a fellowship (and when they would leave). Do not require Group 1.";

  try {
    const result = await groqChatCompletionDetailed({
      model: "openai/gpt-oss-120b",
      reasoningEffort: "medium",
      includeReasoning: true,
      temperature: 0.4,
      maxTokens: 1200,
      system: `You write spoken clarifier #${index + 1} of ${DEMO_AUDIO_COUNT} for a digital-humanities fellowship applicant.

${role}

Output ONE question they can answer aloud in 20–30 seconds.

Good questions:
- For audio 2: press the paper/claim they support or their fellowship motive — not Group 1.
- Test whether they can defend a textual claim, or stay under a real quitting condition.
- Force a decision: drop the claim, revise under the objection, or name what would make them leave.
- Short enough to speak: 22–38 words.

Hard bans:
- Generic “what do digital humanities mean to you?”
- Generic reconcile-progress-with-innovation essays.
- Incidental demo/test proper names — ignore them.
- Celebrity face-offs, salary/family/private life.
- “Please elaborate”, brochure words (leverage, synergy, transformative, unlock, empower, cutting-edge).
- Repeating a prior audio prompt.

Output ONLY the spoken question. No preamble.`,
      user: JSON.stringify({
        audioIndex: index + 1,
        projects: (body.projects ?? []).slice(0, 3),
        scenario: {
          title: scenarioTitle,
          body: (scenarioBody ?? "").slice(0, 650),
        },
        answers: {
          stake: (body.answers?.stake ?? "").slice(0, 280),
          decide: (body.answers?.decide ?? "").slice(0, 280),
          claim: (body.answers?.claim ?? body.answers?.year ?? "").slice(0, 280),
          motive: (body.answers?.motive ?? body.answers?.friction ?? "").slice(
            0,
            240,
          ),
        },
        synthesisFollowUps: (body.textClarifications ?? []).map((c) => ({
          group: c.groupId,
          ask: (c.prompt ?? "").slice(0, 200),
          said: (c.answer ?? "").slice(0, 240),
        })),
        priorAudio: (body.priorAudio ?? []).map((p) => {
          const row = p as PriorClip & { said?: string };
          return {
            ask: (row.prompt ?? "").slice(0, 140),
            said: (row.transcript ?? row.said ?? "").slice(0, 200),
          };
        }),
      }),
    });

    const cleaned = result.content
      .replace(/^["“']|["”']$/g, "")
      .replace(/^(follow-?up|question|clarifier)\s*:\s*/i, "")
      .trim();

    const tooGeneric =
      /what do digital humanities mean/i.test(cleaned) ||
      /reconcile.*(innovation|culture).*(engineering|technical|advancement)/i.test(
        cleaned,
      ) ||
      /value of technical advancements/i.test(cleaned);

    return NextResponse.json({
      ok: true,
      prompt: tooGeneric ? fallback : cleaned || fallback,
      source: tooGeneric ? "generic-guard" : "gpt-oss-120b",
      index,
      reasoningTokens: result.reasoningTokens,
      debugReasoning: result.reasoning?.slice(0, 1000),
    });
  } catch (err) {
    console.error("[demo/clarifier]", err);
    return NextResponse.json({
      ok: true,
      prompt: fallback,
      source: "bank",
      index,
    });
  }
}
