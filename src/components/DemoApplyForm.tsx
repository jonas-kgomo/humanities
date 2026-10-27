"use client";

import {
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
} from "react";
import { fellowshipProjects } from "@/lib/content";
import { applicantRoles } from "@/lib/application";
import {
  DEMO_AUDIO_COUNT,
  SKIP_PLACEHOLDER,
  demoWrittenPrompts,
  type AudioClip,
  type DemoTelemetry,
  type TextClarification,
} from "@/lib/demoApplication";
import {
  GOALS_AUDIO_PROMPT,
  decisionScenarios,
  demoGroups,
  getDemoPrompt,
  getScenario,
  pickScenario,
} from "@/lib/demoPrompts";
import { AudioRecorder } from "@/components/AudioRecorder";

type Phase = "setup" | "written" | "synth" | "audio" | "done";

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const initialAnswers = Object.fromEntries(
  demoWrittenPrompts.map((q) => [q.id, ""]),
) as Record<string, string>;

export function DemoApplyForm() {
  const startedAt = useMemo(() => new Date().toISOString(), []);
  const seed = useMemo(
    () => `${startedAt}-${Math.random().toString(36).slice(2)}`,
    [startedAt],
  );
  const phaseEntered = useRef(Date.now());
  const telemetry = useRef<DemoTelemetry>({
    startedAt,
    pasteEvents: 0,
    pasteChars: 0,
    keystrokes: 0,
    phaseTimingsMs: {},
    audioFallbackCount: 0,
    skipMode: false,
  });

  const [skipMode, setSkipMode] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");
  const [groupIndex, setGroupIndex] = useState(0);
  const [pairIndex, setPairIndex] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [scenarioId, setScenarioId] = useState("");
  const [scenarioLocked, setScenarioLocked] = useState(false);
  const [answers, setAnswers] = useState(initialAnswers);

  const [clarifications, setClarifications] = useState<TextClarification[]>([]);
  const [activeSynthPrompt, setActiveSynthPrompt] = useState("");
  const [activeSynthSource, setActiveSynthSource] = useState("");
  const [activeSynthAnswer, setActiveSynthAnswer] = useState("");

  const [audioIndex, setAudioIndex] = useState(0);
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [activeAudioPrompt, setActiveAudioPrompt] = useState("");
  const [activeTranscript, setActiveTranscript] = useState("");
  const [audioApproved, setAudioApproved] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [audioFallbackText, setAudioFallbackText] = useState("");
  const [awaitingFinalSubmit, setAwaitingFinalSubmit] = useState(false);

  const [attestation, setAttestation] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);
  const [reviewerFlags, setReviewerFlags] = useState<string[]>([]);
  const [reviewPacket, setReviewPacket] = useState<Record<string, unknown> | null>(
    null,
  );

  const field =
    "w-full border border-line bg-paper px-3 py-2.5 text-[1rem] text-ink outline-none transition-colors focus:border-ink";
  const labelCls = "block font-sans text-sm font-semibold text-ink";
  const help = "mt-1.5 text-sm leading-relaxed text-mute";
  const err = "mt-1.5 text-sm text-[#8b3a2a]";

  const group = demoGroups[groupIndex]!;
  const currentQuestionId = group.questionIds[pairIndex]!;
  const currentQ = getDemoPrompt(currentQuestionId)!;
  const scenario = scenarioId ? getScenario(scenarioId) : undefined;

  function markPhase(next: Phase) {
    const now = Date.now();
    telemetry.current.phaseTimingsMs[phase] =
      (telemetry.current.phaseTimingsMs[phase] ?? 0) + (now - phaseEntered.current);
    phaseEntered.current = now;
    setPhase(next);
  }

  function trackPaste(e: ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const text = e.clipboardData.getData("text") ?? "";
    telemetry.current.pasteEvents += 1;
    telemetry.current.pasteChars += text.length;
  }

  function trackKeys() {
    telemetry.current.keystrokes += 1;
  }

  function toggleProject(title: string) {
    setProjects((prev) => {
      if (prev.includes(title)) return prev.filter((p) => p !== title);
      if (prev.length >= 3) return prev;
      return [...prev, title];
    });
  }

  function applySkipBasics() {
    if (name.trim().length < 2) setName("Skip Tester");
    if (!email.trim()) setEmail("skip@example.com");
    if (!affiliation.trim()) setAffiliation("CHT demo");
    if (!role) setRole(applicantRoles[0]);
    if (!region.trim()) setRegion("Testland");
    if (!projects.length) setProjects([fellowshipProjects[0]!.title]);
    if (!scenarioId) setScenarioId(pickScenario(seed).id);
  }

  function validateSetup() {
    if (skipMode) {
      applySkipBasics();
      setErrors({});
      return true;
    }
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "A valid email is required.";
    }
    if (!affiliation.trim()) e.affiliation = "Affiliation is required.";
    if (!role) e.role = "Select a role.";
    if (!region.trim()) e.region = "Region or country is required.";
    if (!projects.length) e.projects = "Choose 1–3 research interests.";
    if (!scenarioId || !getScenario(scenarioId)) {
      e.scenarioId = "Choose a decision scenario.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateCurrentAnswer() {
    if (skipMode) {
      setErrors({});
      return true;
    }
    const e: Record<string, string> = {};
    const words = countWords(answers[currentQ.id] ?? "");
    if (words < 30) {
      e.answer = `Too short — aim for substance (under ${currentQ.maxWords}).`;
    } else if (words > currentQ.maxWords) {
      e.answer = `Over the limit (${words}/${currentQ.maxWords}).`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function continueFromSetup() {
    if (!validateSetup()) return;
    setGroupIndex(0);
    setPairIndex(0);
    setClarifications([]);
    setAudioClips([]);
    setAwaitingFinalSubmit(false);
    setScenarioLocked(false);
    markPhase("written");
  }

  function withFilledAnswer(id: string, prev: Record<string, string>) {
    if (prev[id]?.trim()) return prev;
    return { ...prev, [id]: `${SKIP_PLACEHOLDER} (${id})` };
  }

  async function loadAudioPrompt(
    index: number,
    prior: AudioClip[],
    clarifyOverride?: TextClarification[],
  ) {
    setBusy(true);
    setErrors({});
    setAwaitingFinalSubmit(false);
    try {
      const res = await fetch("/api/demo/clarifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          index,
          projects,
          thoughtExperimentTitle: scenario?.title,
          thoughtExperimentBody: scenario?.body,
          scenarioTitle: scenario?.title,
          scenarioBody: scenario?.body,
          answers,
          textClarifications: clarifyOverride ?? clarifications,
          priorAudio: prior.map((c) => ({
            prompt: c.prompt ?? "",
            transcript: c.usedFallback
              ? (c.fallbackText ?? c.transcript ?? "")
              : (c.transcript ?? c.fallbackText ?? ""),
          })),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        prompt?: string;
        error?: string;
        source?: string;
        reasoningTokens?: number;
        debugReasoning?: string;
      };
      if (!res.ok || !data.ok || !data.prompt) {
        setErrors({ form: data.error ?? "Could not generate audio clarifier." });
        return false;
      }
      if (skipMode && data.debugReasoning) {
        console.info(
          "[demo audio reasoning]",
          data.source,
          data.reasoningTokens,
          data.debugReasoning,
        );
      }
      setActiveAudioPrompt(data.prompt);
      setActiveTranscript("");
      setAudioApproved(false);
      setUseFallback(false);
      setAudioFallbackText("");
      setAudioIndex(index);
      markPhase("audio");
      return true;
    } catch {
      setErrors({ form: "Network error generating audio clarifier." });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function requestSynthFollowUp(answerOverride?: Record<string, string>) {
    setBusy(true);
    setErrors({});
    const ids = group.questionIds;
    const src = answerOverride ?? answers;
    const pair = ids.map((id) => {
      const q = getDemoPrompt(id)!;
      return {
        questionId: id,
        label: q.label,
        answer: src[id] ?? "",
      };
    });

    try {
      const res = await fetch("/api/demo/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id,
          groupTitle: group.title,
          projects,
          thoughtExperimentTitle: scenario?.title,
          thoughtExperimentBody: scenario?.body,
          scenarioTitle: scenario?.title,
          scenarioBody: scenario?.body,
          pair,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        prompt?: string;
        source?: string;
        error?: string;
        reasoningTokens?: number;
        debugReasoning?: string;
      };
      if (!res.ok || !data.ok || !data.prompt) {
        setErrors({ form: data.error ?? "Could not generate synthesis follow-up." });
        return;
      }
      const sourceLabel = [
        data.source,
        data.reasoningTokens != null ? `${data.reasoningTokens} think-tok` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      setActiveSynthPrompt(data.prompt);
      setActiveSynthSource(sourceLabel);
      setActiveSynthAnswer("");
      if (skipMode && data.debugReasoning) {
        console.info("[demo synth reasoning]", data.debugReasoning);
      }
      markPhase("synth");
    } catch {
      setErrors({ form: "Network error generating follow-up." });
    } finally {
      setBusy(false);
    }
  }

  async function advanceAfterAnswer() {
    let nextAnswers = answers;
    if (skipMode) {
      nextAnswers = withFilledAnswer(currentQ.id, answers);
      setAnswers(nextAnswers);
      setErrors({});
    } else if (!validateCurrentAnswer()) {
      return;
    }
    // Lock scenario once they leave the first Group 1 question
    if (groupIndex === 0 && pairIndex === 0) {
      setScenarioLocked(true);
    }
    if (pairIndex === 0) {
      setPairIndex(1);
      setErrors({});
      return;
    }

    // Always call Groq when either answer has real text — even thin/generic.
    // Only use a canned skip stub if BOTH are pure skip placeholders.
    const a = (nextAnswers[group.questionIds[0]] ?? "").trim();
    const b = (nextAnswers[group.questionIds[1]] ?? "").trim();
    const bothPlaceholders =
      a.includes("[skip mode]") && b.includes("[skip mode]");
    if (skipMode && bothPlaceholders) {
      setActiveSynthPrompt(
        `[skip] Synthesis tension between ${group.questionIds.join(" + ")} — what would you drop first?`,
      );
      setActiveSynthSource("skip");
      setActiveSynthAnswer("");
      markPhase("synth");
      return;
    }

    await requestSynthFollowUp(nextAnswers);
  }

  async function skipSynthToAudio() {
    if (!skipMode) return;
    const entry: TextClarification = {
      groupId: group.id,
      questionIds: [...group.questionIds],
      prompt: activeSynthPrompt || `[skip] follow-up for ${group.id}`,
      answer: activeSynthAnswer.trim() || SKIP_PLACEHOLDER,
      source: "skip",
    };
    const nextClarifications = [
      ...clarifications.filter((c) => c.groupId !== group.id),
      entry,
    ];
    setClarifications(nextClarifications);
    const ok = await loadAudioPrompt(groupIndex, audioClips, nextClarifications);
    if (!ok) {
      setActiveAudioPrompt(`[skip] audio ${groupIndex + 1}`);
      setAudioIndex(groupIndex);
      markPhase("audio");
    }
  }

  async function confirmSynth() {
    if (!skipMode) {
      if (countWords(activeSynthAnswer) < 15) {
        setErrors({ synth: "Answer the synthesis follow-up (15+ words)." });
        return;
      }
      if (countWords(activeSynthAnswer) > 100) {
        setErrors({ synth: "Keep under 100 words." });
        return;
      }
    }

    const entry: TextClarification = {
      groupId: group.id,
      questionIds: [...group.questionIds],
      prompt: activeSynthPrompt,
      answer: activeSynthAnswer.trim(),
      source: activeSynthSource,
    };
    const nextClarifications = [
      ...clarifications.filter((c) => c.groupId !== group.id),
      entry,
    ];
    setClarifications(nextClarifications);
    setErrors({});

    // Audio after each group (indices 0 and 1)
    await loadAudioPrompt(groupIndex, audioClips, nextClarifications);
  }

  async function confirmAudioClip(forceSkip = false) {
    const skipping = skipMode && forceSkip;
    const usedFallback = skipping ? true : useFallback;
    const transcript = usedFallback ? "" : activeTranscript.trim();
    const fallbackText = skipping
      ? SKIP_PLACEHOLDER
      : usedFallback
        ? audioFallbackText.trim()
        : undefined;

    if (!skipping) {
      if (!usedFallback && !audioApproved) {
        setErrors({
          audio: "Approve your voice take before continuing (or use fallback).",
        });
        return;
      }
      if (!usedFallback && transcript.length < 8) {
        setErrors({
          audio: "Record and approve a take first.",
        });
        return;
      }
      if (usedFallback && (fallbackText?.length ?? 0) < 20) {
        setErrors({ audio: "Fallback answer is too short." });
        return;
      }
    }

    const clip: AudioClip = {
      prompt:
        activeAudioPrompt ||
        (audioIndex === 2 ? GOALS_AUDIO_PROMPT : `[skip] audio ${audioIndex + 1}`),
      transcript,
      fallbackText,
      usedFallback,
    };
    const nextClips = [...audioClips, clip];
    setAudioClips(nextClips);
    if (usedFallback) telemetry.current.audioFallbackCount += 1;
    setErrors({});

    // After audio 0 → group 2 written
    if (audioIndex === 0) {
      setGroupIndex(1);
      setPairIndex(0);
      markPhase("written");
      return;
    }

    // After audio 1 → final audio 2
    if (audioIndex === 1) {
      await loadAudioPrompt(2, nextClips);
      return;
    }

    // After audio 2 → submit
    setAwaitingFinalSubmit(true);
  }

  async function finalSubmit() {
    if (!skipMode && audioClips.length !== DEMO_AUDIO_COUNT) {
      setErrors({ audio: `Complete all ${DEMO_AUDIO_COUNT} audio clarifiers.` });
      return;
    }
    if (!skipMode && !attestation) {
      setErrors({ attestation: "Confirm the answers are your own words." });
      return;
    }

    setBusy(true);
    setErrors({});
    const now = Date.now();
    telemetry.current.phaseTimingsMs.audio =
      (telemetry.current.phaseTimingsMs.audio ?? 0) + (now - phaseEntered.current);
    telemetry.current.skipMode = skipMode;

    // Pad skipped state so the packet is inspectable
    let clips = audioClips;
    if (skipMode && clips.length < DEMO_AUDIO_COUNT) {
      clips = [...clips];
      while (clips.length < DEMO_AUDIO_COUNT) {
        const i = clips.length;
        clips.push({
          prompt: i === 2 ? GOALS_AUDIO_PROMPT : `[skip] audio ${i + 1}`,
          transcript: "",
          fallbackText: SKIP_PLACEHOLDER,
          usedFallback: true,
        });
      }
    }
    let clarifies = clarifications;
    if (skipMode) {
      clarifies = demoGroups.map((g) => {
        const existing = clarifies.find((c) => c.groupId === g.id);
        return (
          existing ?? {
            groupId: g.id,
            questionIds: [...g.questionIds],
            prompt: `[skip] synthesis for ${g.id}`,
            answer: SKIP_PLACEHOLDER,
            source: "skip",
          }
        );
      });
    }
    const filledAnswers = { ...answers };
    if (skipMode) {
      for (const q of demoWrittenPrompts) {
        if (!filledAnswers[q.id]?.trim()) {
          filledAnswers[q.id] = `${SKIP_PLACEHOLDER} (${q.id})`;
        }
      }
    }

    try {
      const res = await fetch("/api/demo/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Skip Tester",
          email: email || "skip@example.com",
          affiliation: affiliation || "CHT demo",
          role: role || applicantRoles[0],
          region: region || "Testland",
          projects: projects.length ? projects : [fellowshipProjects[0]!.title],
          answers: filledAnswers,
          scenarioId: scenarioId || pickScenario(seed).id,
          textClarifications: clarifies,
          audioClips: clips,
          attestation: skipMode ? true : attestation,
          companyWebsite,
          skipMode,
          telemetry: telemetry.current,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        id?: string;
        errors?: Record<string, string>;
        reviewerFlags?: string[];
        textClarifications?: TextClarification[];
        audioClips?: AudioClip[];
      };
      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? { form: "Submission failed." });
        setBusy(false);
        return;
      }
      setRefId(data.id ?? null);
      setReviewerFlags(data.reviewerFlags ?? []);
      setReviewPacket(data);
      setPhase("done");
    } catch {
      setErrors({ form: "Network error — try again." });
    } finally {
      setBusy(false);
    }
  }

  if (phase === "done") {
    return (
      <div className="space-y-8">
        <div className="border border-line bg-paper-deep/30 px-6 py-10 sm:px-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
            Demo application received
          </p>
          <h2 className="mt-3 font-display text-2xl text-ink">Trace complete.</h2>
          <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
            Two groups · synthesis follow-ups · {DEMO_AUDIO_COUNT} audio
            clarifiers with transcripts.
            {refId ? (
              <>
                {" "}
                Reference:{" "}
                <span className="font-mono text-sm text-ink">{refId}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="border border-line px-5 py-6 sm:px-6 space-y-8">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Reviewer flags (advisory)
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {reviewerFlags.map((f) => (
                <li
                  key={f}
                  className="border border-line bg-paper-deep/40 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-ink">
              Synthesis follow-ups
            </h3>
            {clarifications.map((c) => (
              <div key={c.groupId} className="border-t border-line pt-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-mute">
                  {c.groupId} · {c.questionIds.join(" + ")}
                </p>
                <p className="mt-2 text-ink">{c.prompt}</p>
                <p className="mt-2 text-ink-soft">{c.answer}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold text-ink">
              Audio + transcripts
            </h3>
            {audioClips.map((clip, i) => (
              <div key={i} className="border-t border-line pt-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-mute">
                  Audio {i + 1}
                  {clip.usedFallback ? " · fallback" : ""}
                </p>
                <p className="mt-2 text-ink">{clip.prompt}</p>
                <div className="mt-3 border border-line bg-paper-deep/25 px-3 py-3">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-mute">
                    Transcript
                  </p>
                  <p className="mt-2 text-ink-soft">
                    {clip.usedFallback ? clip.fallbackText : clip.transcript}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {reviewPacket ? (
            <details>
              <summary className="cursor-pointer font-sans text-sm font-semibold text-ink">
                Raw packet JSON
              </summary>
              <pre className="mt-3 max-h-80 overflow-auto border border-line bg-paper p-3 text-[0.7rem] text-mute">
                {JSON.stringify(reviewPacket, null, 2)}
              </pre>
            </details>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-10">
      <div
        className={`sticky top-[4.25rem] z-40 -mx-1 border px-4 py-3 backdrop-blur-md ${
          skipMode
            ? "border-[#8b3a2a]/40 bg-[#f7efe8]/95"
            : "border-line bg-paper/95"
        }`}
      >
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={skipMode}
            onChange={(e) => {
              const on = e.target.checked;
              setSkipMode(on);
              telemetry.current.skipMode = on;
            }}
          />
          <span className="text-sm text-ink">
            <span className="font-semibold">Skip mode</span>
            <span className="text-mute">
              {" "}
              — bypass length checks; skip buttons appear while we edit the
              flow. Flagged in the reviewer packet.
            </span>
          </span>
        </label>
      </div>

      <ol className="flex flex-wrap gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
        {(
          [
            ["setup", "Setup"],
            ["written", "Group Qs"],
            ["synth", "Synth follow-up"],
            ["audio", "Audio"],
          ] as const
        ).map(([id, text]) => (
          <li
            key={id}
            className={`border px-2.5 py-1 ${
              phase === id ? "border-ink bg-ink text-paper" : "border-line"
            }`}
          >
            {text}
          </li>
        ))}
      </ol>

      <div className="border border-line bg-paper-deep/25 px-5 py-5 sm:px-6">
        <p className="font-sans text-sm font-semibold text-ink">
          Aptitude · continuity · motivation
        </p>
        <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">
          Group 1: pick a scenario, name a stake you will not outsource, then
          decide. Group 2 (standalone): a paper and claim you support, then why
          a fellowship — and when you would leave. Hard synthesis follow-ups,
          then audio.
        </p>
      </div>

      {errors.form && <p className={err}>{errors.form}</p>}

      {phase === "setup" && (
        <div className="space-y-10">
          <fieldset className="space-y-6">
            <legend className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Basics
            </legend>
            <div className="grid gap-6 sm:grid-cols-2">
              {(
                [
                  ["name", "Full name", name, setName],
                  ["email", "Email", email, setEmail],
                  ["affiliation", "Affiliation", affiliation, setAffiliation],
                  ["region", "Country / region", region, setRegion],
                ] as const
              ).map(([id, lab, value, set]) => (
                <div key={id}>
                  <label htmlFor={`demo-${id}`} className={labelCls}>
                    {lab}
                  </label>
                  <input
                    id={`demo-${id}`}
                    type={id === "email" ? "email" : "text"}
                    className={`${field} mt-2`}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    onKeyDown={trackKeys}
                  />
                  {errors[id] && <p className={err}>{errors[id]}</p>}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label htmlFor="demo-role" className={labelCls}>
                  Role
                </label>
                <select
                  id="demo-role"
                  className={`${field} mt-2`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] opacity-0"
          >
            <input
              tabIndex={-1}
              autoComplete="off"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
            />
          </div>

          <fieldset>
            <legend className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Research interests — choose 1 to 3
            </legend>
            <p className={help}>
              Soft signal only — your ideal project question comes later.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {fellowshipProjects.map((project) => {
                const checked = projects.includes(project.title);
                return (
                  <li key={project.title}>
                    <label
                      className={`flex cursor-pointer gap-3 border px-4 py-3 ${
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

          <fieldset className="space-y-4">
            <legend className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Decision scenario
            </legend>
            <p className={help}>
              Choose the case Group 1 will press you on. Locked after your first
              answer in that group.
            </p>
            <div className="flex flex-wrap gap-3">
              <select
                id="demo-scenario"
                className={`${field} min-w-[16rem] flex-1`}
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
              >
                <option value="">Select a scenario…</option>
                {decisionScenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  setScenarioId(
                    pickScenario(`${seed}-${Date.now()}`).id,
                  )
                }
                className="inline-flex border border-line-strong px-4 py-2.5 font-sans text-sm font-semibold text-ink hover:border-ink"
              >
                Surprise me
              </button>
            </div>
            {scenario && (
              <blockquote className="border border-line bg-paper-deep/35 px-4 py-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                  {scenario.title}
                </p>
                <p className="mt-3 font-display text-[1.05rem] leading-relaxed text-ink-soft">
                  {scenario.body}
                </p>
              </blockquote>
            )}
            {errors.scenarioId && <p className={err}>{errors.scenarioId}</p>}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={continueFromSetup}
              className="inline-flex bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-accent"
            >
              Begin group 1
            </button>
            {skipMode && (
              <button
                type="button"
                onClick={() => {
                  applySkipBasics();
                  continueFromSetup();
                }}
                className="inline-flex border border-[#8b3a2a]/50 px-5 py-3 font-sans text-sm font-semibold text-[#8b3a2a]"
              >
                Skip setup
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "written" && (
        <div className="space-y-8">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Group {groupIndex + 1} / {demoGroups.length} · {group.title}
            </p>
            <p className="mt-2 text-sm text-mute">{group.elementNote}</p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-mute">
              Question {pairIndex + 1} of 2 in this pair
            </p>
          </div>

          <div>
            <h2 className="font-display text-[clamp(1.45rem,2.5vw,1.9rem)] leading-tight text-ink">
              {currentQ.label}
            </h2>
            <p className={`mt-3 ${help}`}>{currentQ.help}</p>

            {groupIndex === 0 && !scenarioLocked && pairIndex === 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                <select
                  className={`${field} min-w-[16rem] flex-1`}
                  value={scenarioId}
                  onChange={(e) => setScenarioId(e.target.value)}
                >
                  {decisionScenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <p className="w-full text-sm text-mute">
                  You can still change the scenario before answering.
                </p>
              </div>
            )}

            {currentQ.showScenario && scenario && (
              <blockquote className="mt-5 border border-line bg-paper-deep/35 px-4 py-5">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
                  Scenario · {scenario.title}
                  {scenarioLocked ? " · locked" : ""}
                </p>
                <p className="mt-3 font-display text-[1.05rem] leading-relaxed text-ink-soft">
                  {scenario.body}
                </p>
              </blockquote>
            )}

            <textarea
              rows={8}
              className={`${field} mt-4 resize-y`}
              value={answers[currentQ.id]}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [currentQ.id]: e.target.value,
                }))
              }
              onPaste={trackPaste}
              onKeyDown={trackKeys}
            />
            <p
              className={`mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] ${
                countWords(answers[currentQ.id] ?? "") > currentQ.maxWords
                  ? "text-[#8b3a2a]"
                  : "text-mute"
              }`}
            >
              {countWords(answers[currentQ.id] ?? "")} / {currentQ.maxWords}{" "}
              words
            </p>
            {errors.answer && <p className={err}>{errors.answer}</p>}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (pairIndex > 0) {
                  setPairIndex(0);
                  return;
                }
                if (groupIndex > 0) {
                  // Don't unwind prior audio easily — go back within group only
                  return;
                }
                markPhase("setup");
              }}
              className="inline-flex border border-line-strong px-5 py-3 font-sans text-sm font-semibold text-ink disabled:opacity-40"
              disabled={groupIndex > 0 && pairIndex === 0}
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void advanceAfterAnswer()}
              className="inline-flex bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-accent disabled:opacity-60"
            >
              {busy
                ? "Synthesising follow-up…"
                : pairIndex === 0
                  ? "Next question in pair"
                  : "Next — synthesis follow-up"}
            </button>
            {skipMode && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void advanceAfterAnswer()}
                className="inline-flex border border-[#8b3a2a]/50 px-5 py-3 font-sans text-sm font-semibold text-[#8b3a2a]"
              >
                Skip question
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "synth" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {group.questionIds.map((id) => {
              const q = getDemoPrompt(id)!;
              return (
                <div
                  key={id}
                  className="border border-line bg-paper-deep/20 px-4 py-4"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-mute">
                    {q.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-6">
                    {answers[id]}
                  </p>
                </div>
              );
            })}
          </div>
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
              Difficult follow-up · synthesis of both
              {activeSynthSource ? ` · ${activeSynthSource}` : ""}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.35rem,2.4vw,1.8rem)] leading-tight text-ink">
              {activeSynthPrompt}
            </h2>
            <p className={help}>
              This question is generated from the tension between your two
              answers — not a paraphrase of either. 15–100 words.
            </p>
            <textarea
              rows={5}
              className={`${field} mt-4 resize-y`}
              value={activeSynthAnswer}
              onChange={(e) => setActiveSynthAnswer(e.target.value)}
              onPaste={trackPaste}
              onKeyDown={trackKeys}
            />
            <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-mute">
              {countWords(activeSynthAnswer)} / 100 words
            </p>
            {errors.synth && <p className={err}>{errors.synth}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void confirmSynth()}
              className="inline-flex bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-accent disabled:opacity-60"
            >
              {busy ? "Preparing audio…" : "Continue to audio clarifier"}
            </button>
            {skipMode && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void skipSynthToAudio()}
                className="inline-flex border border-[#8b3a2a]/50 px-5 py-3 font-sans text-sm font-semibold text-[#8b3a2a]"
              >
                Skip follow-up
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "audio" && (
        <div className="space-y-8">
          {!awaitingFinalSubmit && (
            <>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                Audio clarifier {audioIndex + 1} / {DEMO_AUDIO_COUNT}
              </p>
              <h2 className="font-display text-[clamp(1.4rem,2.5vw,1.85rem)] leading-tight text-ink">
                {activeAudioPrompt || (busy ? "Preparing clarifier…" : "")}
              </h2>

              {!useFallback && activeAudioPrompt && (
                <AudioRecorder
                  key={`audio-${audioIndex}-${activeAudioPrompt.slice(0, 20)}`}
                  maxSeconds={30}
                  maxAttempts={3}
                  filename={`cdm-audio-${audioIndex + 1}.webm`}
                  disabled={busy}
                  onTranscript={(text) => {
                    setActiveTranscript(text);
                    setAudioApproved(false);
                    setErrors((e) => {
                      const next = { ...e };
                      delete next.audio;
                      return next;
                    });
                  }}
                  onCleared={() => {
                    setActiveTranscript("");
                    setAudioApproved(false);
                  }}
                  onApproved={(take) => {
                    setActiveTranscript(take.transcript);
                    setAudioApproved(true);
                    setErrors((e) => {
                      const next = { ...e };
                      delete next.audio;
                      return next;
                    });
                  }}
                  onError={(message) => {
                    if (message) setErrors((e) => ({ ...e, audio: message }));
                  }}
                />
              )}

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={useFallback}
                  onChange={(e) => {
                    setUseFallback(e.target.checked);
                    if (e.target.checked) setAudioApproved(false);
                  }}
                />
                <span className="text-[0.98rem] text-ink-soft">
                  Can&apos;t record — typed fallback (flagged).
                </span>
              </label>

              {useFallback && (
                <textarea
                  rows={4}
                  className={`${field} resize-y`}
                  value={audioFallbackText}
                  onChange={(e) => setAudioFallbackText(e.target.value)}
                  onPaste={trackPaste}
                  onKeyDown={trackKeys}
                />
              )}
              {errors.audio && <p className={err}>{errors.audio}</p>}

              {audioClips.length > 0 && (
                <div className="space-y-3 border-t border-line pt-6">
                  <p className="font-sans text-sm font-semibold text-ink">
                    Earlier transcripts
                  </p>
                  {audioClips.map((clip, i) => (
                    <div
                      key={i}
                      className="border border-line px-3 py-3 text-sm text-ink-soft"
                    >
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-mute">
                        Audio {i + 1}
                      </p>
                      <p className="mt-1 text-ink">{clip.prompt}</p>
                      <p className="mt-2">
                        {clip.usedFallback
                          ? clip.fallbackText
                          : clip.transcript}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {audioIndex === 2 && (
                <p className="text-sm leading-relaxed text-mute">
                  This last clip is about <span className="text-ink">research
                  trajectory</span> (near vs medium term) — not salary, family,
                  or private plans.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    busy ||
                    !activeAudioPrompt ||
                    (!useFallback && !audioApproved && !skipMode)
                  }
                  onClick={() => void confirmAudioClip(false)}
                  className="inline-flex bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-accent disabled:opacity-60"
                >
                  {audioIndex === 0
                    ? "Continue to group 2"
                    : audioIndex === 1
                      ? "Continue to goals audio"
                      : "Continue to review & submit"}
                </button>
                {skipMode && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void confirmAudioClip(true)}
                    className="inline-flex border border-[#8b3a2a]/50 px-5 py-3 font-sans text-sm font-semibold text-[#8b3a2a]"
                  >
                    Skip audio
                  </button>
                )}
              </div>
            </>
          )}

          {awaitingFinalSubmit && (
            <>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">
                  Audio complete
                </p>
                <h2 className="mt-3 font-display text-2xl text-ink">
                  Review transcripts, then submit.
                </h2>
              </div>
              <div className="space-y-4">
                {audioClips.map((clip, i) => (
                  <div key={i} className="border border-line px-4 py-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-mute">
                      Audio {i + 1} / {DEMO_AUDIO_COUNT}
                    </p>
                    <p className="mt-2 font-semibold text-ink">{clip.prompt}</p>
                    <div className="mt-3 bg-paper-deep/25 px-3 py-3">
                      <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-mute">
                        Transcript
                      </p>
                      <p className="mt-2 text-ink-soft">
                        {clip.usedFallback
                          ? clip.fallbackText
                          : clip.transcript}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={attestation}
                  onChange={(e) => setAttestation(e.target.checked)}
                />
                <span className="text-[0.98rem] leading-relaxed text-ink-soft">
                  I wrote these answers myself. I did not submit unedited text
                  from a language model as my own judgment.
                </span>
              </label>
              {errors.attestation && <p className={err}>{errors.attestation}</p>}
              <button
                type="button"
                disabled={busy}
                onClick={() => void finalSubmit()}
                className="inline-flex bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-accent disabled:opacity-60"
              >
                {busy ? "Submitting…" : "Finish demo application"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
