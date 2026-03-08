import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userContent: any[] = [
      {
        type: "text",
        text: `You are Fashn-Match, an expert fashion AI stylist. Analyze this clothing image and the user's request.

User request: "${description || 'Suggest me matching bottom wear and accessories'}"

You MUST respond with a JSON object (no markdown, no code fences) with this exact structure:
{
  "detectedItem": "what the clothing item in the image is (e.g., 'Black cotton crew-neck t-shirt')",
  "detectedColors": [{"name": "color name", "hex": "#hexcode"}],
  "occasion": {
    "primary": "the most suitable occasion (Office, College, Casual, Formal, Party, Date Night, Wedding, Sports)",
    "alternatives": ["other suitable occasions"],
    "reasoning": "why this occasion fits"
  },
  "suggestions": {
    "bottomWear": [{"item": "specific item name", "color": "suggested color", "reason": "why it matches"}],
    "footwear": [{"item": "specific item", "color": "color", "reason": "why"}],
    "accessories": [{"item": "specific item", "color": "color", "reason": "why"}]
  },
  "colorCompatibility": {
    "score": 85,
    "analysis": "explanation of the color palette and harmony"
  },
  "styleAnalysis": "overall style assessment and tips",
  "overallScore": 88
}

Rules:
- If no specific occasion context is given, default to "Casual"
- Detect ALL colors visible in the clothing item
- Suggest 2-3 items for each category (bottomWear, footwear, accessories)
- Be specific with item names and colors
- Score should reflect how well the suggestions work together`
      }
    ];

    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageBase64 }
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Clean any markdown code fences
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI analysis", raw: content }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-outfit error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
