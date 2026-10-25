import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  summariseTelemetry,
  validateDemoApplication,
  type DemoApplicationPayload,
} from "@/lib/demoApplication";
import { getScenario } from "@/lib/demoPrompts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Invalid request." } },
      { status: 400 },
    );
  }

  const raw = body as DemoApplicationPayload & {
    thoughtExperimentId?: string;
  };
  // Backward compat if an old client still sends thoughtExperimentId
  const normalised: DemoApplicationPayload = {
    ...raw,
    scenarioId: raw.scenarioId || raw.thoughtExperimentId || "",
  };

  const result = validateDemoApplication(normalised);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  const id = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const scenario = getScenario(result.data.scenarioId);

  const record = {
    id,
    receivedAt: new Date().toISOString(),
    kind: "fellowship-apply-demo",
    ...result.data,
    resolved: {
      scenarioTitle: scenario?.title ?? null,
    },
    reviewerFlags: summariseTelemetry(result.data.telemetry),
  };

  try {
    const dir = path.join(process.cwd(), "data", "applications");
    await mkdir(dir, { recursive: true });
    await writeFile(
      path.join(dir, `${id}.json`),
      JSON.stringify(record, null, 2),
      "utf8",
    );
  } catch {
    console.error("[demo/submit] persist failed", id);
    console.info("[demo/submit]", JSON.stringify(record));
  }

  return NextResponse.json({
    ok: true,
    id,
    reviewerFlags: record.reviewerFlags,
    resolved: record.resolved,
    textClarifications: result.data.textClarifications,
    audioClips: result.data.audioClips,
    telemetry: result.data.telemetry,
  });
}
