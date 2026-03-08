import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, type, sourceImageBase64, sourceGarmentColorName, sourceGarmentColorHex } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Detect if outfit contains feminine items
    const feminineKeywords = ["dress", "gown", "skirt", "blouse", "heels", "clutch", "earrings", "necklace", "camisole", "top", "saree", "lehenga", "jumpsuit", "romper", "tights", "flats", "ballet", "strappy", "pencil skirt", "wide-leg", "palazzo", "dupatta", "hair accessories", "statement necklace"];
    const masculineKeywords = ["chinos", "cargo pants", "joggers", "tie", "pocket square", "cufflinks", "derby shoes", "oxford shoes", "henley", "beanie"];

    const promptLower = prompt.toLowerCase();
    const femScore = feminineKeywords.filter((kw) => promptLower.includes(kw)).length;
    const mascScore = masculineKeywords.filter((kw) => promptLower.includes(kw)).length;
    const hasSourceImage = Boolean(sourceImageBase64);
    const modelGender = hasSourceImage
      ? "model"
      : femScore > mascScore
        ? "female"
        : mascScore > femScore
          ? "male"
          : "model";

    let attemptContents: Array<string | Array<{ type: string; text?: string; image_url?: { url: string } }>> = [];

    if (type === "full_outfit") {
      const basePrompt = `Generate a high-quality fashion photograph of a ${modelGender} wearing this complete outfit concept: ${prompt}. Full body shot, professional studio lighting, clean white background, fashion editorial style, high resolution.`;

      if (hasSourceImage) {
        attemptContents = [
          [
            {
              type: "text",
              text: `${basePrompt} Use the uploaded garment image as a strong visual reference. Keep similar neckline, silhouette, fabric feel, and color family. Complete the look with matching bottoms, footwear, and accessories where needed.`,
            },
            {
              type: "image_url",
              image_url: { url: sourceImageBase64 },
            },
          ],
          [
            {
              type: "text",
              text: `${basePrompt} Create a cohesive look inspired by the uploaded garment. If text color words conflict with the uploaded image, prioritize the uploaded garment's actual colors and shape.`,
            },
            {
              type: "image_url",
              image_url: { url: sourceImageBase64 },
            },
          ],
          basePrompt,
        ];
      } else {
        attemptContents = [basePrompt];
      }
    } else if (type === "item") {
      attemptContents = [
        `Generate a clean product photograph of this fashion item: ${prompt}. Single item on clean white background, professional product photography, high detail, fashion e-commerce style.`,
      ];
    } else {
      attemptContents = [prompt];
    }

    let lastFailureMessage = "Image generation failed";

    for (const messageContent of attemptContents) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: messageContent }],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        if (response.status === 429) {
          lastFailureMessage = "Rate limit exceeded. Please try again shortly.";
          break;
        }

        if (response.status === 402) {
          lastFailureMessage = "AI credits exhausted.";
          break;
        }

        lastFailureMessage = `Image generation failed (${response.status})`;
        console.error("Image gen error:", response.status, responseText);
        continue;
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageUrl) {
        return new Response(JSON.stringify({ imageUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const assistantText = data.choices?.[0]?.message?.content;
      lastFailureMessage = assistantText
        ? `Model did not return an image: ${String(assistantText).slice(0, 160)}`
        : "No image generated";
      console.error("No image in response:", JSON.stringify(data).slice(0, 500));
    }

    return new Response(JSON.stringify({ error: lastFailureMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
