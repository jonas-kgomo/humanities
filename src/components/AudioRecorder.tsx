"use client";

import { useEffect, useRef, useState } from "react";

export type AudioTake = {
  transcript: string;
  attempt: number;
  durationSec: number;
  mimeType: string;
};

type AudioRecorderProps = {
  maxSeconds?: number;
  maxAttempts?: number;
  filename?: string;
  onTranscript?: (text: string) => void;
  onApproved: (take: AudioTake) => void;
  onCleared?: () => void;
  onError?: (message: string) => void;
  disabled?: boolean;
};

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function AudioRecorder({
  maxSeconds = 30,
  maxAttempts = 3,
  filename = "clarifier.webm",
  onTranscript,
  onApproved,
  onCleared,
  onError,
  disabled,
}: AudioRecorderProps) {
  const [phase, setPhase] = useState<
    "idle" | "recording" | "uploading" | "review" | "approved"
  >("idle");
  const [attempt, setAttempt] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mimeRef = useRef("audio/webm");

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      audioRef.current?.pause();
    };
  }, [previewUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (!el.duration || Number.isNaN(el.duration)) return;
      setProgress(el.currentTime / el.duration);
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [previewUrl, phase]);

  const attemptsLeft = maxAttempts - attempt;
  const canRetry = phase === "review" && attempt < maxAttempts;

  async function start() {
    if (attempt >= maxAttempts) {
      onError?.(`Maximum of ${maxAttempts} takes reached.`);
      return;
    }
    onError?.("");
    setPlaying(false);
    setProgress(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      mimeRef.current = mime;
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        void finishTake(new Blob(chunksRef.current, { type: mime }));
      };
      mediaRef.current = recorder;
      recorder.start();
      setPhase("recording");
      setSeconds(0);
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= maxSeconds) {
            stop();
            return maxSeconds;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      onError?.(
        "Microphone access denied or unavailable. Use the text fallback below.",
      );
    }
  }

  function stop() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const rec = mediaRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function finishTake(blob: Blob) {
    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);
    setDurationSec(seconds || 1);
    blobRef.current = blob;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPhase("uploading");
    onCleared?.();

    const form = new FormData();
    form.append("audio", blob, filename);
    try {
      const res = await fetch("/api/demo/transcribe", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        ok: boolean;
        text?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.text) {
        onError?.(data.error ?? "Transcription failed. You can retry.");
        setTranscript("");
        setPhase("review");
        return;
      }
      setTranscript(data.text);
      onTranscript?.(data.text);
      setPhase("review");
    } catch {
      onError?.("Network error during transcription. You can retry.");
      setTranscript("");
      setPhase("review");
    }
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el || !previewUrl) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    void el.play().then(() => setPlaying(true)).catch(() => {
      onError?.("Could not play back this take.");
    });
  }

  function download() {
    if (!previewUrl || !blobRef.current) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = filename.replace(/\.webm$/i, "") + `-take${attempt}.webm`;
    a.click();
  }

  function retry() {
    if (!canRetry) return;
    audioRef.current?.pause();
    setPlaying(false);
    setProgress(0);
    setTranscript("");
    onCleared?.();
    onError?.("");
    void start();
  }

  function approve() {
    if (!transcript.trim()) {
      onError?.("Wait for a transcript, or retry the take.");
      return;
    }
    audioRef.current?.pause();
    setPlaying(false);
    setPhase("approved");
    onApproved({
      transcript: transcript.trim(),
      attempt,
      durationSec,
      mimeType: mimeRef.current,
    });
  }

  return (
    <div className="space-y-4 border border-line bg-paper-deep/25 px-4 py-5 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">
          Voice take · {Math.min(attempt || 1, maxAttempts)} / {maxAttempts}
          {phase === "approved" ? " · approved" : null}
        </p>
        <p className="text-sm text-mute">
          Aim 20–30s · Whisper turbo
          {attempt > 0 && phase !== "idle"
            ? ` · ${Math.max(0, maxAttempts - attempt)} retr${maxAttempts - attempt === 1 ? "y" : "ies"} left`
            : null}
        </p>
      </div>

      {/* Hidden audio element — custom UI only */}
      {previewUrl ? (
        <audio ref={audioRef} src={previewUrl} preload="metadata" className="hidden" />
      ) : null}

      {phase === "idle" && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => void start()}
          className="inline-flex items-center justify-center bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.98] disabled:opacity-50"
        >
          Start recording
        </button>
      )}

      {phase === "recording" && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-[#8b3a2a]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8b3a2a]" />
            Recording {formatTime(seconds)} / {formatTime(maxSeconds)}
          </span>
          <div className="h-1.5 flex-1 min-w-[8rem] overflow-hidden bg-line">
            <div
              className="h-full bg-[#8b3a2a] transition-[width] duration-200"
              style={{ width: `${(seconds / maxSeconds) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={stop}
            className="inline-flex border border-ink px-4 py-2 font-sans text-sm font-semibold text-ink"
          >
            Stop
          </button>
        </div>
      )}

      {phase === "uploading" && (
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-mute">
          Transcribing…
        </p>
      )}

      {(phase === "review" || phase === "approved") && previewUrl && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 border border-line bg-paper px-3 py-3">
            <button
              type="button"
              onClick={togglePlay}
              disabled={phase === "approved" ? false : false}
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-paper transition-transform active:scale-[0.97]"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <span className="flex gap-1" aria-hidden>
                  <span className="h-4 w-1 bg-paper" />
                  <span className="h-4 w-1 bg-paper" />
                </span>
              ) : (
                <span
                  className="ml-0.5 border-y-[7px] border-l-[12px] border-y-transparent border-l-paper"
                  aria-hidden
                />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                className="block h-2 w-full bg-line text-left"
                onClick={(e) => {
                  const el = audioRef.current;
                  if (!el?.duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.min(
                    1,
                    Math.max(0, (e.clientX - rect.left) / rect.width),
                  );
                  el.currentTime = ratio * el.duration;
                  setProgress(ratio);
                }}
                aria-label="Seek"
              >
                <span
                  className="block h-full bg-ink transition-[width] duration-75"
                  style={{ width: `${progress * 100}%` }}
                />
              </button>
              <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-mute">
                {formatTime((audioRef.current?.currentTime ?? 0) || 0)} /{" "}
                {formatTime(durationSec)}
              </p>
            </div>
          </div>

          <div className="border border-line bg-paper px-4 py-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-mute">
              Transcript
            </p>
            <p className="mt-2 text-[1.02rem] leading-relaxed text-ink">
              {transcript || (
                <span className="text-mute">
                  No transcript yet — retry if transcription failed.
                </span>
              )}
            </p>
          </div>

          {phase === "review" && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={approve}
                disabled={!transcript.trim() || disabled}
                className="inline-flex bg-ink px-5 py-2.5 font-sans text-sm font-semibold text-paper hover:bg-accent disabled:opacity-50"
              >
                Approve this take
              </button>
              <button
                type="button"
                onClick={download}
                className="inline-flex border border-line-strong px-5 py-2.5 font-sans text-sm font-semibold text-ink hover:border-ink"
              >
                Download
              </button>
              <button
                type="button"
                onClick={retry}
                disabled={!canRetry || disabled}
                className="inline-flex border border-line-strong px-5 py-2.5 font-sans text-sm font-semibold text-ink hover:border-ink disabled:opacity-40"
              >
                Retry
                {attemptsLeft > 0
                  ? ` (${attemptsLeft} left)`
                  : " (none left)"}
              </button>
            </div>
          )}

          {phase === "approved" && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-sans text-sm font-semibold text-ink">
                Take approved — continue when ready.
              </p>
              <button
                type="button"
                onClick={download}
                className="inline-flex border border-line-strong px-4 py-2 font-sans text-sm font-semibold text-ink"
              >
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
