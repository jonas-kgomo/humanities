import { NextResponse } from "next/server";
import { groqTranscribe } from "@/lib/groq";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart form." }, { status: 400 });
  }

  const file = form.get("audio");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing audio file." }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Audio too large." }, { status: 400 });
  }

  try {
    const blob = new Blob([await file.arrayBuffer()], {
      type: file.type || "audio/webm",
    });
    const text = await groqTranscribe(blob, file.name || "answer.webm");
    if (!text) {
      return NextResponse.json(
        { ok: false, error: "No speech detected — try again." },
        { status: 422 },
      );
    }
    return NextResponse.json({ ok: true, text, model: "whisper-large-v3-turbo" });
  } catch (err) {
    console.error("[demo/transcribe]", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Transcription failed. Check GROQ_API_KEY.",
      },
      { status: 502 },
    );
  }
}
