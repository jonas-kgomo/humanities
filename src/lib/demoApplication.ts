import { fellowshipProjects } from "@/lib/content";
import { applicantRoles, type ApplicantRole } from "@/lib/application";
import {
  DEMO_AUDIO_COUNT,
  decisionScenarios,
  demoWrittenPrompts,
} from "@/lib/demoPrompts";

export { DEMO_AUDIO_COUNT, demoWrittenPrompts };

export type TextClarification = {
  groupId: string;
  questionIds: string[];
  prompt: string;
  answer: string;
  source?: string;
};

export type AudioClip = {
  prompt: string;
  transcript: string;
  fallbackText?: string;
  usedFallback: boolean;
};

export type DemoTelemetry = {
  startedAt: string;
  pasteEvents: number;
  pasteChars: number;
  keystrokes: number;
  phaseTimingsMs: Record<string, number>;
  audioFallbackCount: number;
  skipMode?: boolean;
};

export type DemoApplicationPayload = {
  name: string;
  email: string;
  affiliation: string;
  role: string;
  region: string;
  projects: string[];
  answers: Record<string, string>;
  /** Selected decision scenario id */
  scenarioId: string;
  textClarifications: TextClarification[];
  audioClips: AudioClip[];
  attestation: boolean;
  companyWebsite?: string;
  skipMode?: boolean;
  telemetry: DemoTelemetry;
};

export type FieldErrors = Record<string, string>;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const brochure =
  /\b(leverage|synergy|cutting-edge|transformative|unlock|empower|stakeholder engagement|navigate uncertainty)\b/i;

export function validateDemoApplication(
  input: DemoApplicationPayload,
): { ok: true; data: DemoApplicationPayload } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};

  if (input.companyWebsite?.trim()) {
    return { ok: false, errors: { form: "Unable to submit." } };
  }
  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = "Name is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "A valid email is required.";
  }
  if (!input.affiliation.trim()) errors.affiliation = "Affiliation is required.";
  if (!applicantRoles.includes(input.role as ApplicantRole)) {
    errors.role = "Select a role.";
  }
  if (!input.region.trim()) errors.region = "Region or country is required.";
  if (!input.projects.length || input.projects.length > 3) {
    errors.projects = "Choose 1–3 research interests.";
  } else {
    const allowed = new Set<string>(fellowshipProjects.map((p) => p.title));
    if (input.projects.some((p) => !allowed.has(p))) {
      errors.projects = "Select interests from the list.";
    }
  }
  if (!decisionScenarios.some((s) => s.id === input.scenarioId)) {
    errors.scenarioId = "Choose a decision scenario.";
  }

  const skip = Boolean(input.skipMode || input.telemetry.skipMode);

  if (!skip && !input.attestation) {
    errors.attestation = "Confirm the answers are your own words.";
  }

  for (const q of demoWrittenPrompts) {
    const value = (input.answers[q.id] ?? "").trim();
    if (skip) continue;
    if (!value) {
      errors[`answers.${q.id}`] = "This answer is required.";
      continue;
    }
    const words = wordCount(value);
    if (words < 30) {
      errors[`answers.${q.id}`] =
        `Too short — aim for substance (under ${q.maxWords} words).`;
    } else if (words > q.maxWords) {
      errors[`answers.${q.id}`] =
        `Over the limit (${words}/${q.maxWords} words).`;
    }
    if (brochure.test(value)) {
      errors[`answers.${q.id}`] =
        "This reads like brochure language. Rewrite in plain, specific terms.";
    }
  }

  if (!skip) {
    if (input.textClarifications.length !== 2) {
      errors.form = "Finish both group synthesis follow-ups before submitting.";
    } else {
      for (const c of input.textClarifications) {
        if (!c.prompt.trim() || wordCount(c.answer) < 15) {
          errors[`clarify.${c.groupId}`] = "Answer the synthesis follow-up.";
        } else if (wordCount(c.answer) > 100) {
          errors[`clarify.${c.groupId}`] = "Keep the follow-up under 100 words.";
        }
      }
    }

    if (input.audioClips.length !== DEMO_AUDIO_COUNT) {
      errors.audio = `Complete all ${DEMO_AUDIO_COUNT} audio clarifiers.`;
    } else {
      input.audioClips.forEach((clip, i) => {
        const ok =
          clip.transcript.trim().length >= 8 ||
          (clip.usedFallback && (clip.fallbackText?.trim().length ?? 0) >= 20);
        if (!clip.prompt.trim() || !ok) {
          errors[`audio.${i}`] =
            "Record audio for this clarifier, or use the text fallback.";
        }
      });
    }
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      affiliation: input.affiliation.trim(),
      region: input.region.trim(),
      answers: Object.fromEntries(
        demoWrittenPrompts.map((q) => [q.id, (input.answers[q.id] ?? "").trim()]),
      ),
      textClarifications: input.textClarifications.map((c) => ({
        ...c,
        prompt: c.prompt.trim(),
        answer: c.answer.trim(),
      })),
      audioClips: input.audioClips.map((c) => ({
        ...c,
        prompt: c.prompt.trim(),
        transcript: c.transcript.trim(),
        fallbackText: c.fallbackText?.trim() || undefined,
      })),
    },
  };
}

export function summariseTelemetry(t: DemoTelemetry) {
  const flags: string[] = [];
  if (t.skipMode) flags.push("skip-mode");
  if (t.pasteEvents === 0) flags.push("uneventful-paste");
  else if (t.pasteChars > 400) flags.push("paste-heavy");
  else flags.push("some-paste");
  if (t.keystrokes < 80) flags.push("low-keystroke");
  if (t.audioFallbackCount > 0) {
    flags.push(`audio-fallback×${t.audioFallbackCount}`);
  }
  const totalMs = Object.values(t.phaseTimingsMs).reduce((a, b) => a + b, 0);
  if (totalMs > 0 && totalMs < 120_000) flags.push("fast-session");
  return flags;
}

export const SKIP_PLACEHOLDER =
  "[skip mode] Placeholder while editing the demo flow.";
