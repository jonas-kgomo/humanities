const GROQ_BASE = "https://api.groq.com/openai/v1";

export function getGroqApiKey() {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }
  return key;
}

export type GroqChatResult = {
  content: string;
  reasoning?: string;
  model: string;
  reasoningTokens?: number;
};

export async function groqChatCompletion(options: {
  model?: string;
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  /** GPT-OSS: low | medium | high. Qwen: none | default */
  reasoningEffort?: "none" | "default" | "low" | "medium" | "high";
  includeReasoning?: boolean;
}): Promise<string> {
  const result = await groqChatCompletionDetailed(options);
  return result.content;
}

export async function groqChatCompletionDetailed(options: {
  model?: string;
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: "none" | "default" | "low" | "medium" | "high";
  includeReasoning?: boolean;
}): Promise<GroqChatResult> {
  const key = getGroqApiKey();
  const model = options.model ?? "llama-3.1-8b-instant";
  const body: Record<string, unknown> = {
    model,
    temperature: options.temperature ?? 0.7,
    max_completion_tokens: options.maxTokens ?? 220,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
  };

  if (options.reasoningEffort) {
    body.reasoning_effort = options.reasoningEffort;
  }
  if (options.includeReasoning != null) {
    body.include_reasoning = options.includeReasoning;
  }

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq chat failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    model?: string;
    choices?: {
      message?: { content?: string; reasoning?: string };
    }[];
    usage?: {
      completion_tokens_details?: { reasoning_tokens?: number };
    };
  };
  const message = data.choices?.[0]?.message;
  const text = message?.content?.trim();
  if (!text) throw new Error("Groq returned an empty completion");
  return {
    content: text,
    reasoning: message?.reasoning?.trim() || undefined,
    model: data.model ?? model,
    reasoningTokens: data.usage?.completion_tokens_details?.reasoning_tokens,
  };
}

export async function groqTranscribe(audio: Blob, filename: string) {
  const key = getGroqApiKey();
  const form = new FormData();
  form.append("file", audio, filename);
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "json");
  form.append("temperature", "0");

  const res = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Groq transcription failed (${res.status}): ${detail.slice(0, 200)}`,
    );
  }

  const data = (await res.json()) as { text?: string };
  return (data.text ?? "").trim();
}
