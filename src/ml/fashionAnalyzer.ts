/**
 * Central Fashion ML pipeline (client-side).
 *
 * - Color detection: K-Means clustering (client-side ML)
 * - Occasion classification: Decision-tree + KNN (client-side ML)
 * - Outfit suggestions: AI-powered via edge function (with rule-based fallback)
 */

import { extractDominantColors } from "./colorDetectionModel";
import { classifyOccasion } from "./occasionClassifier";
import { generateRecommendations } from "./outfitRecommender";
import { CLOTHING_DATASET } from "./dataset";
import { supabase } from "@/integrations/supabase/client";

/**
 * Identify the clothing item from user's text description.
 */
function identifyItem(description: string, primaryColor: string): string {
  const lower = description.toLowerCase();
  const sorted = [...CLOTHING_DATASET].sort((a, b) => b.keyword.length - a.keyword.length);
  for (const entry of sorted) {
    if (lower.includes(entry.keyword)) {
      const name = entry.keyword.charAt(0).toUpperCase() + entry.keyword.slice(1);
      return `${primaryColor} ${name}`;
    }
  }
  const extraKeywords = [
    "dress", "gown", "saree", "sari", "lehenga", "jumpsuit", "romper",
    "bodysuit", "corset", "kimono", "poncho", "cape", "overalls", "dungarees",
  ];
  for (const kw of extraKeywords) {
    if (lower.includes(kw)) {
      return `${primaryColor} ${kw.charAt(0).toUpperCase() + kw.slice(1)}`;
    }
  }
  return `${primaryColor} clothing item`;
}

const FULL_BODY_KEYWORDS = [
  "dress", "gown", "frock", "sundress", "bodycon", "maxi", "mini dress",
  "jumpsuit", "romper", "overalls", "dungarees", "saree", "sari", "lehenga",
  "anarkali", "one-piece", "playsuit",
];

function isFullBody(itemName: string): boolean {
  return FULL_BODY_KEYWORDS.some((kw) => itemName.toLowerCase().includes(kw));
}

export interface FashionMLAnalysis {
  detectedItem: string;
  detectedColors: { name: string; hex: string }[];
  occasion: {
    primary: string;
    alternatives: string[];
    reasoning: string;
  };
  suggestions: {
    bottomWear: { item: string; color: string; reason: string }[];
    footwear: { item: string; color: string; reason: string }[];
    accessories: { item: string; color: string; reason: string }[];
  };
  isFullBodyGarment: boolean;
  colorCompatibility: {
    score: number;
    analysis: string;
  };
  styleAnalysis: string;
  overallScore: number;
}

/**
 * Try to fetch AI-powered suggestions from the edge function.
 * Returns null on failure so caller can fall back to rule-based engine.
 */
async function fetchAISuggestions(
  detectedItem: string,
  detectedColors: { name: string; hex: string }[],
  occasion: string,
  isFullBodyGarment: boolean,
  description: string,
): Promise<{
  bottomWear: { item: string; color: string; reason: string }[];
  footwear: { item: string; color: string; reason: string }[];
  accessories: { item: string; color: string; reason: string }[];
  styleAnalysis: string;
  colorCompatibility: { score: number; analysis: string };
} | null> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-outfit-suggestions", {
      body: { detectedItem, detectedColors, occasion, isFullBodyGarment, description },
    });

    if (error || data?.error) {
      console.warn("AI suggestions failed, falling back to rules:", data?.error || error?.message);
      return null;
    }

    // Validate minimum structure
    if (!Array.isArray(data?.footwear) || !Array.isArray(data?.accessories)) {
      console.warn("AI suggestions returned invalid structure, falling back.");
      return null;
    }

    return {
      bottomWear: data.bottomWear || [],
      footwear: data.footwear,
      accessories: data.accessories,
      styleAnalysis: data.styleAnalysis || "",
      colorCompatibility: data.colorCompatibility || { score: 70, analysis: "Balanced palette." },
    };
  } catch (err) {
    console.warn("AI suggestions fetch error:", err);
    return null;
  }
}

export async function runFashionMLAnalysis(imageBase64: string, description: string): Promise<FashionMLAnalysis> {
  // ── Client-side ML: Color Detection ──
  const detectedColors = await extractDominantColors(imageBase64, 4);
  const colors = detectedColors.map((c) => ({ name: c.name, hex: c.hex }));
  const primaryColor = colors[0]?.name || "Unknown";

  // ── Client-side ML: Item Identification ──
  const detectedItem = identifyItem(description, primaryColor);
  const fullBody = isFullBody(detectedItem);

  // ── Client-side ML: Occasion Classification ──
  const occasion = classifyOccasion(detectedItem, colors, description);

  // ── AI-powered Suggestions (with rule-based fallback) ──
  const aiSuggestions = await fetchAISuggestions(
    detectedItem,
    colors,
    occasion.primary,
    fullBody,
    description,
  );

  if (aiSuggestions) {
    return {
      detectedItem,
      detectedColors: colors,
      occasion: {
        primary: occasion.primary,
        alternatives: occasion.alternatives,
        reasoning: occasion.reasoning,
      },
      suggestions: {
        bottomWear: aiSuggestions.bottomWear,
        footwear: aiSuggestions.footwear,
        accessories: aiSuggestions.accessories,
      },
      isFullBodyGarment: fullBody,
      colorCompatibility: aiSuggestions.colorCompatibility,
      styleAnalysis: aiSuggestions.styleAnalysis,
      overallScore: aiSuggestions.colorCompatibility.score,
    };
  }

  // ── Fallback: Rule-based recommendations ──
  const recommendations = generateRecommendations(detectedItem, colors, occasion.primary);

  return {
    detectedItem,
    detectedColors: colors,
    occasion: {
      primary: occasion.primary,
      alternatives: occasion.alternatives,
      reasoning: occasion.reasoning,
    },
    suggestions: {
      bottomWear: recommendations.bottomWear,
      footwear: recommendations.footwear,
      accessories: recommendations.accessories,
    },
    isFullBodyGarment: recommendations.isFullBodyGarment,
    colorCompatibility: recommendations.colorCompatibility,
    styleAnalysis: recommendations.styleAnalysis,
    overallScore: recommendations.colorCompatibility.score,
  };
}
