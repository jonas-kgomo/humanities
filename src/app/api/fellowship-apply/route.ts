import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  validateFellowshipApplication,
  type FellowshipApplicationInput,
} from "@/lib/application";

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

  const input = body as FellowshipApplicationInput;
  const result = validateFellowshipApplication(input);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  const id = `cdm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    id,
    receivedAt: new Date().toISOString(),
    ...result.data,
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
    // Still acknowledge in environments without writable disk; log for ops.
    console.error("[fellowship-apply] persist failed", id);
    console.info("[fellowship-apply]", JSON.stringify(record));
  }

  return NextResponse.json({ ok: true, id });
}
