import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { detectedItem, detectedColors, occasion, isFullBodyGarment, description } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const colorList = (detectedColors || []).map((c: { name: string }) => c.name).join(", ");

    const systemPrompt = `You are a world-class fashion stylist AI. You generate outfit recommendations as structured JSON.

RULES:
- Return ONLY valid JSON, no markdown, no explanation.
- Each category must have exactly 6 items.
- Each item must have: "item" (string, specific product name), "color" (string, specific color), "reason" (string, 1 sentence why it works).
- Suggestions must be DIVERSE — different styles, silhouettes, and price tiers.
- Colors must complement the detected garment colors using color theory.
- Tailor suggestions to the occasion: ${occasion || "general"}.
- If the garment is full-body (dress/jumpsuit/saree), bottomWear must be an empty array [].
- Consider 2025-2026 fashion trends.
- Do NOT repeat similar items (e.g. don't suggest 3 types of jeans).`;

    const userPrompt = `Detected garment: ${detectedItem}
Detected colors: ${colorList}
Occasion: ${occasion || "general/casual"}
Full-body garment: ${isFullBodyGarment ? "yes" : "no"}
User description: ${description || "not provided"}

Generate outfit suggestions in this exact JSON format:
{
  "bottomWear": [{"item": "...", "color": "...", "reason": "..."}],
  "footwear": [{"item": "...", "color": "...", "reason": "..."}],
  "accessories": [{"item": "...", "color": "...", "reason": "..."}],
  "styleAnalysis": "2-3 sentence style analysis of the outfit",
  "colorCompatibility": {"score": 0-100, "analysis": "1-2 sentence color analysis"}
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway responded with ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = rawContent;
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Try to parse — fallback if AI returned bad JSON
    let suggestions;
    try {
      suggestions = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI suggestions JSON:", jsonStr.slice(0, 500));
      return new Response(JSON.stringify({ error: "AI returned invalid format. Please retry." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate structure
    const result = {
      bottomWear: Array.isArray(suggestions.bottomWear) ? suggestions.bottomWear.slice(0, 6) : [],
      footwear: Array.isArray(suggestions.footwear) ? suggestions.footwear.slice(0, 6) : [],
      accessories: Array.isArray(suggestions.accessories) ? suggestions.accessories.slice(0, 6) : [],
      styleAnalysis: typeof suggestions.styleAnalysis === "string" ? suggestions.styleAnalysis : "",
      colorCompatibility: suggestions.colorCompatibility && typeof suggestions.colorCompatibility.score === "number"
        ? suggestions.colorCompatibility
        : { score: 70, analysis: "Balanced color palette." },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-outfit-suggestions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
