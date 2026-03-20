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
    const facePreservation = `CRITICAL: You MUST output an IMAGE, not text. Preserve the EXACT same face, facial features, skin tone, hair color, hair style, and body shape from the person's photo. Do NOT generate a new face. The ONLY thing that should change is the clothing.`;
    
    const instructions = hasGarmentReference
      ? `Generate an image. Virtual try-on:\n- Image 1 = person (preserve identity exactly)\n- Image 2 = clothing reference\n\n${facePreservation}\n\nCreate a realistic full-body fashion photo of this exact person wearing the garment from image 2, styled with: ${outfitDescription}. Clean background.`
      : `Generate an image. Virtual try-on:\n\n${facePreservation}\n\nCreate a realistic full-body fashion photo of this exact person wearing: ${outfitDescription}. Clean background.`;

    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: "text", text: instructions },
      { type: "image_url", image_url: { url: userImageBase64 } },
    ];

    if (garmentImageBase64) {
      content.push({ type: "image_url", image_url: { url: garmentImageBase64 } });
    }

    const models = ["google/gemini-3.1-flash-image-preview", "google/gemini-2.5-flash-image"];
    let imageUrl: string | undefined;

    for (const model of models) {
      console.log(`Trying model: ${model}`);
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content }],
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
        console.error(`Error with ${model}:`, response.status, t);
        continue;
      }

      const data = await response.json();
      imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageUrl) {
        console.log(`Image generated successfully with ${model}`);
        break;
      }
      console.warn(`${model} returned no image:`, JSON.stringify(data).slice(0, 400));
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Virtual try-on image not generated. Please try again." }), {
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