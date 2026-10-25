import {
  curriculumModules,
  fellowshipApplicationQuestions,
  fellowshipProjects,
} from "@/lib/content";

export const applicantRoles = [
  "Doctoral student",
  "Postdoctoral researcher",
  "Early-career faculty",
  "Practitioner / policy",
  "Other",
] as const;

export type ApplicantRole = (typeof applicantRoles)[number];

export type FellowshipApplicationInput = {
  name: string;
  email: string;
  affiliation: string;
  role: string;
  region: string;
  projects: string[];
  moduleSlug: string;
  answers: Record<string, string>;
  attestation: boolean;
  /** Honeypot — must stay empty */
  companyWebsite?: string;
  startedAt: string;
};

export type FieldErrors = Record<string, string>;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function validateFellowshipApplication(
  input: FellowshipApplicationInput,
): { ok: true; data: FellowshipApplicationInput } | { ok: false; errors: FieldErrors } {
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
  if (!input.affiliation.trim()) {
    errors.affiliation = "Affiliation is required.";
  }
  if (!applicantRoles.includes(input.role as ApplicantRole)) {
    errors.role = "Select a role.";
  }
  if (!input.region.trim()) {
    errors.region = "Region or country is required.";
  }
  if (!input.projects.length || input.projects.length > 3) {
    errors.projects = "Choose 1–3 guided research projects.";
  } else {
    const allowed = new Set<string>(fellowshipProjects.map((p) => p.title));
    if (input.projects.some((p) => !allowed.has(p))) {
      errors.projects = "Select projects from the list.";
    }
  }
  if (!curriculumModules.some((m) => m.slug === input.moduleSlug)) {
    errors.moduleSlug = "Select a curriculum module.";
  }
  if (!input.attestation) {
    errors.attestation = "Confirm the answers are your own words.";
  }

  const started = Date.parse(input.startedAt);
  if (!Number.isFinite(started)) {
    errors.form = "Session expired — reload and try again.";
  } else {
    const elapsedMs = Date.now() - started;
    if (elapsedMs < 45_000) {
      errors.form =
        "Please spend a bit longer with the questions before submitting.";
    }
  }

  for (const q of fellowshipApplicationQuestions) {
    const value = (input.answers[q.id] ?? "").trim();
    if (!value) {
      errors[`answers.${q.id}`] = "This answer is required.";
      continue;
    }
    const words = wordCount(value);
    if (words < 40) {
      errors[`answers.${q.id}`] = `Too short — aim for substance (under ${q.maxWords} words, not under 40).`;
    } else if (words > q.maxWords) {
      errors[`answers.${q.id}`] = `Over the limit (${words}/${q.maxWords} words). Cut toward the concrete.`;
    }

    // Soft signal: heavy hedge / brochure vocabulary
    const brochure =
      /\b(leverage|synergy|cutting-edge|transformative|unlock|empower|stakeholder engagement|navigate uncertainty)\b/i;
    if (q.id !== "critique" && brochure.test(value)) {
      errors[`answers.${q.id}`] =
        "This reads like brochure language. Rewrite in plain, specific terms.";
    }
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      affiliation: input.affiliation.trim(),
      region: input.region.trim(),
      answers: Object.fromEntries(
        fellowshipApplicationQuestions.map((q) => [
          q.id,
          (input.answers[q.id] ?? "").trim(),
        ]),
      ),
    },
  };
}
