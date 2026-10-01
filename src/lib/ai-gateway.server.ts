const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export class AiFriendlyError extends Error {}

type JsonSchema = Record<string, unknown>;

/**
 * Calls the Lovable AI Gateway Responses endpoint with a strict JSON schema,
 * streaming the response and accumulating the final text server-side.
 */
export async function generateJson<T>(opts: {
  instructions: string;
  input: string;
  schemaName: string;
  schema: JsonSchema;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new AiFriendlyError(
      "O serviço de análise não está disponível no momento. Tente novamente mais tarde.",
    );
  }

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      store: false,
      reasoning: { effort: "medium", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      input: [
        { role: "system", content: opts.instructions },
        { role: "user", content: opts.input },
      ],
      text: {
        format: {
          type: "json_schema",
          name: opts.schemaName,
          strict: true,
          schema: opts.schema,
        },
      },
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    console.error("AI gateway error", response.status, detail);
    if (response.status === 429) {
      throw new AiFriendlyError(
        "Muitas análises em andamento agora. Aguarde alguns instantes e tente novamente.",
      );
    }
    if (response.status === 402 || response.status === 403) {
      throw new AiFriendlyError(
        "O limite de uso da análise foi atingido. Tente novamente mais tarde.",
      );
    }
    throw new AiFriendlyError("Não foi possível concluir a análise. Tente novamente.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      for (const line of frame.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            text?: string;
          };
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            text += event.delta;
          } else if (
            event.type === "response.output_text.done" &&
            typeof event.text === "string" &&
            text.length === 0
          ) {
            text = event.text;
          }
        } catch {
          // ignore partial / non-JSON frames
        }
      }
    }
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new AiFriendlyError("Não foi possível concluir a análise. Tente novamente.");
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as T;
      } catch {
        /* fall through */
      }
    }
    throw new AiFriendlyError("Não foi possível interpretar o resultado da análise.");
  }
}
