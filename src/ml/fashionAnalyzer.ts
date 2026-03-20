/**
 * Central Fashion ML pipeline (client-side).
 *
 * - Color detection: K-Means clustering (client-side ML)
 * - Occasion classification: Decision-tree + KNN (client-side ML)
 * - Outfit suggestions: Rule-based engine with shuffled datasets (no API)
 */

import { extractDominantColors } from "./colorDetectionModel";
import { classifyOccasion } from "./occasionClassifier";
import { generateRecommendations } from "./outfitRecommender";
import { CLOTHING_DATASET } from "./dataset";

/**
 * Identify the clothing item from user's text description.
 */
/** Match keyword as a whole word to avoid "hat" matching inside "that" */
function matchesWholeWord(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s|[^a-z])${escaped}(?:$|\\s|[^a-z])`, "i").test(text);
}

function identifyItem(description: string, primaryColor: string): string {
  const lower = description.toLowerCase();
  const sorted = [...CLOTHING_DATASET].sort((a, b) => b.keyword.length - a.keyword.length);
  for (const entry of sorted) {
    if (matchesWholeWord(lower, entry.keyword)) {
      const name = entry.keyword.charAt(0).toUpperCase() + entry.keyword.slice(1);
      return `${primaryColor} ${name}`;
    }
  }
  const extraKeywords = [
    "dress", "gown", "saree", "sari", "lehenga", "jumpsuit", "romper",
    "bodysuit", "corset", "kimono", "poncho", "cape", "overalls", "dungarees",
  ];
  for (const kw of extraKeywords) {
    if (matchesWholeWord(lower, kw)) {
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

  // ── Rule-based recommendations (shuffled each run) ──
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
