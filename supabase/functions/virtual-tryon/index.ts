import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { userImageBase64, outfitDescription, garmentImageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!userImageBase64) {
      return new Response(JSON.stringify({ error: "User image is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hasGarmentReference = Boolean(garmentImageBase64);
    const facePreservation = `CRITICAL: You MUST preserve the EXACT same face, facial features, facial structure, eyes, nose, mouth, eyebrows, skin tone, skin texture, hair color, hair style, and body shape from the person's photo. The face must be an IDENTICAL match — do NOT generate a new face, do NOT alter any facial features, do NOT change the person's identity. The ONLY thing that should change is the clothing.`;
    
    const instructions = hasGarmentReference
      ? `Virtual try-on:\n- Image 1 is the person photo (REFERENCE for exact appearance/identity)\n- Image 2 is the clothing reference\n\n${facePreservation}\n\nGenerate a realistic full-body image of THIS EXACT PERSON from image 1 wearing the garment from image 2 (preserve color, shape, neckline, fit), styled with: ${outfitDescription}. The person's face and identity must be pixel-perfect identical to image 1. Professional fashion photo, full body, clean background.`
      : `Virtual try-on:\n\n${facePreservation}\n\nGenerate a realistic full-body image of THIS EXACT SAME PERSON wearing: ${outfitDescription}. The face, facial features, skin tone, hair, and body type must remain EXACTLY identical to the input photo — only change the clothing. Professional fashion photograph, full body, good lighting, clean background.`;

    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      {
        type: "text",
        text: instructions,
      },
      {
        type: "image_url",
        image_url: { url: userImageBase64 },
      },
    ];

    if (garmentImageBase64) {
      content.push({
        type: "image_url",
        image_url: { url: garmentImageBase64 },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content,
          }
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Virtual try-on error:", response.status, t);
      return new Response(JSON.stringify({ error: "Virtual try-on failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in try-on response:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "Virtual try-on image not generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("virtual-tryon error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
