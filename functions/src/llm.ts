import { LLM_API_KEY, LLM_PROVIDER } from "./config";

export interface InsightPayload {
  summaryBullets: string[];
  tags: string[];
  importanceScore: number;
  reasoningShort: string;
}

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const parseStrictJson = (raw: string): InsightPayload => {
  const cleaned = raw.trim().replace(/^```json/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned) as InsightPayload;
  if (!Array.isArray(parsed.summaryBullets) || parsed.summaryBullets.length < 3) {
    throw new Error("summaryBullets invalide.");
  }
  return {
    summaryBullets: parsed.summaryBullets.slice(0, 5),
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [],
    importanceScore: clampScore(Number(parsed.importanceScore)),
    reasoningShort: String(parsed.reasoningShort || ""),
  };
};

export const generateInsight = async (input: {
  title: string;
  url: string;
  contentSnippet: string | null;
}): Promise<InsightPayload> => {
  if (!LLM_PROVIDER || !LLM_API_KEY) {
    throw new Error("LLM_PROVIDER/LLM_API_KEY manquants.");
  }

  const prompt = [
    "Tu es un analyste de veille économique.",
    "Retourne UNIQUEMENT un JSON valide sans texte autour.",
    "Format:",
    "{",
    '  "summaryBullets": ["...","...","..."],',
    '  "tags": ["..."],',
    '  "importanceScore": 0-100,',
    '  "reasoningShort": "..."',
    "}",
    "",
    `Titre: ${input.title}`,
    `URL: ${input.url}`,
    `Extrait: ${input.contentSnippet || "N/A"}`,
  ].join("\n");

  if (LLM_PROVIDER === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Réponds en JSON strict uniquement." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI error ${response.status}`);
    }
    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content || "";
    return parseStrictJson(raw);
  }

  if (LLM_PROVIDER === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": LLM_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 600,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) {
      throw new Error(`Anthropic error ${response.status}`);
    }
    const data = (await response.json()) as {
      content: { type: string; text: string }[];
    };
    const raw = data.content?.[0]?.text || "";
    return parseStrictJson(raw);
  }

  throw new Error(`LLM_PROVIDER non supporté: ${LLM_PROVIDER}`);
};
