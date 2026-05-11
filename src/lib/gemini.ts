const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

// Demo mode: always fallback when API key is missing or any error occurs
export const isGeminiAvailable = (): boolean => !!GEMINI_API_KEY && GEMINI_API_KEY !== "undefined" && GEMINI_API_KEY.length > 10;

interface GeminiTextResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

interface GeminiImageResponse {
  candidates?: {
    content?: {
      parts?: { text?: string; inlineData?: { mimeType: string; data: string } }[];
    };
  }[];
}

export async function geminiTextCompletion(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const url = `${BASE_URL}/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.85 },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text}`);
  }

  const data: GeminiTextResponse = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function geminiImageGeneration(
  prompt: string,
  ...referenceImages: (string | undefined)[]
): Promise<string> {
  const url = `${BASE_URL}/models/gemini-3.1-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`;

  const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [
    { text: prompt },
  ];

  for (const img of referenceImages) {
    if (!img) continue;
    const match = img.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini image API error ${res.status}: ${text}`);
  }

  const data: GeminiImageResponse = await res.json();
  const candidateParts = data.candidates?.[0]?.content?.parts ?? [];

  for (const part of candidateParts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  const textContent = candidateParts.find((p) => p.text)?.text;
  throw new Error(textContent ? `No image returned: ${textContent.slice(0, 160)}` : "No image generated");
}

const MAX_CONCURRENT = 3;

export async function geminiBatchImageGeneration(
  prompts: { key: string; prompt: string }[],
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (let i = 0; i < prompts.length; i += MAX_CONCURRENT) {
    const batch = prompts.slice(i, i + MAX_CONCURRENT);
    const settled = await Promise.allSettled(
      batch.map(async ({ key, prompt }) => {
        const url = await geminiImageGeneration(prompt);
        return { key, url };
      }),
    );
    for (const entry of settled) {
      if (entry.status === "fulfilled") {
        results.set(entry.value.key, entry.value.url);
      }
    }
  }

  return results;
}
