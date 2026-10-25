"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  curriculumModules,
  fellowshipAiBaitParagraph,
  fellowshipApplicationQuestions,
  fellowshipProjects,
} from "@/lib/content";
import { applicantRoles } from "@/lib/application";

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const initialAnswers = Object.fromEntries(
  fellowshipApplicationQuestions.map((q) => [q.id, ""]),
) as Record<string, string>;

export function FellowshipApplyForm() {
  const startedAt = useMemo(() => new Date().toISOString(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [moduleSlug, setModuleSlug] = useState("");
  const [answers, setAnswers] = useState(initialAnswers);
  const [attestation, setAttestation] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [refId, setRefId] = useState<string | null>(null);

  function toggleProject(title: string) {
    setProjects((prev) => {
      if (prev.includes(title)) return prev.filter((p) => p !== title);
      if (prev.length >= 3) return prev;
      return [...prev, title];
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    try {
      const res = await fetch("/api/fellowship-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          affiliation,
          role,
          region,
          projects,
          moduleSlug,
          answers,
          attestation,
          companyWebsite,
          startedAt,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        id?: string;
        errors?: Record<string, string>;
      };

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? { form: "Submission failed." });
        setStatus("error");
        return;
      }

      setRefId(data.id ?? null);
      setStatus("done");
    } catch {
      setErrors({ form: "Network error — try again." });
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-line bg-paper-deep/30 px-6 py-10 sm:px-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
          Application received
        </p>
        <h2 className="mt-3 font-display text-2xl text-ink">Thank you.</h2>
        <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
          We read for specificity and judgment, not polish. If shortlisted, we
          will follow up at the email you provided.
          {refId ? (
            <>
              {" "}
              Reference:{" "}
              <span className="font-mono text-sm text-ink">{refId}</span>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  const field =
    "w-full border border-line bg-paper px-3 py-2.5 text-[1rem] text-ink outline-none transition-colors focus:border-ink";
  const label = "block font-sans text-sm font-semibold text-ink";
  const help = "mt-1.5 text-sm leading-relaxed text-mute";
  const err = "mt-1.5 text-sm text-[#8b3a2a]";

  return (
    <form onSubmit={onSubmit} className="relative space-y-12" noValidate>
      <div className="border border-line bg-paper-deep/25 px-5 py-5 sm:px-6">
        <p className="font-sans text-sm font-semibold text-ink">
          How we read applications
        </p>
        <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">
          These prompts are hard to answer well with a generic language model.
          We look for concrete scenes, named texts, and stakes in your own
          context. Short answers that are specific beat long answers that are
          smooth. Write in your own words.
        </p>
      </div>

      {errors.form && <p className={err}>{errors.form}</p>}

      <fieldset className="space-y-6">
        <legend className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
          Basics
        </legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Full name
            </label>
            <input
              id="name"
              className={`${field} mt-2`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
            {errors.name && <p className={err}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className={label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`${field} mt-2`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            {errors.email && <p className={err}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="affiliation" className={label}>
              Affiliation
            </label>
            <input
              id="affiliation"
              className={`${field} mt-2`}
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="University, lab, or organisation"
              required
            />
            {errors.affiliation && <p className={err}>{errors.affiliation}</p>}
          </div>
          <div>
            <label htmlFor="region" className={label}>
              Country / region
            </label>
            <input
              id="region"
              className={`${field} mt-2`}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
            {errors.region && <p className={err}>{errors.region}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="role" className={label}>
              Role
            </label>
            <select
              id="role"
              className={`${field} mt-2`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select…</option>
              {applicantRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && <p className={err}>{errors.role}</p>}
          </div>
        </div>
      </fieldset>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] opacity-0"
      >
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
          Guided projects — choose 1 to 3
        </legend>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {fellowshipProjects.map((project) => {
            const checked = projects.includes(project.title);
            return (
              <li key={project.title}>
                <label
                  className={`flex cursor-pointer gap-3 border px-4 py-3 transition-colors ${
                    checked
                      ? "border-ink bg-paper-deep/40"
                      : "border-line hover:border-ink/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    onChange={() => toggleProject(project.title)}
                  />
                  <span>
                    <span className="block font-sans text-sm font-semibold text-ink">
                      {project.title}
                    </span>
                    <span className="mt-1 block text-sm text-mute">
                      {project.body}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {errors.projects && <p className={err}>{errors.projects}</p>}
      </fieldset>

      <div>
        <label htmlFor="moduleSlug" className={label}>
          Curriculum module you will push against
        </label>
        <p className={help}>
          Used in the “weakest assumption” question below.
        </p>
        <select
          id="moduleSlug"
          className={`${field} mt-3`}
          value={moduleSlug}
          onChange={(e) => setModuleSlug(e.target.value)}
          required
        >
          <option value="">Select a module…</option>
          {curriculumModules.map((m) => (
            <option key={m.slug} value={m.slug}>
              {String(m.number).padStart(2, "0")} · {m.title}
            </option>
          ))}
        </select>
        {errors.moduleSlug && <p className={err}>{errors.moduleSlug}</p>}
      </div>

      <fieldset className="space-y-10">
        <legend className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
          Written prompts
        </legend>

        {fellowshipApplicationQuestions.map((q) => {
          const words = countWords(answers[q.id] ?? "");
          return (
            <div key={q.id}>
              <label htmlFor={q.id} className={label}>
                {q.label}
              </label>
              <p className={help}>{q.help}</p>
              {"showBait" in q && q.showBait && (
                <blockquote className="mt-4 border border-line bg-paper-deep/35 px-4 py-4 font-display text-[1.05rem] leading-relaxed text-ink-soft">
                  {fellowshipAiBaitParagraph}
                </blockquote>
              )}
              <textarea
                id={q.id}
                rows={6}
                className={`${field} mt-3 resize-y`}
                value={answers[q.id]}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                required
              />
              <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
                <p
                  className={`font-mono text-[0.7rem] uppercase tracking-[0.08em] ${
                    words > q.maxWords ? "text-[#8b3a2a]" : "text-mute"
                  }`}
                >
                  {words} / {q.maxWords} words
                </p>
                {errors[`answers.${q.id}`] && (
                  <p className={err}>{errors[`answers.${q.id}`]}</p>
                )}
              </div>
            </div>
          );
        })}
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={attestation}
            onChange={(e) => setAttestation(e.target.checked)}
            required
          />
          <span className="text-[0.98rem] leading-relaxed text-ink-soft">
            I wrote these answers myself. I did not submit unedited text from a
            language model as my own judgment.
          </span>
        </label>
        {errors.attestation && <p className={err}>{errors.attestation}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98] disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
