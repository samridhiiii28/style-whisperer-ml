/**
 * Central Fashion ML pipeline (client-side).
 *
 * This file exists so you can quickly find the core ML workflow in one place.
 * All model implementations and datasets are in src/ml/* files.
 */

import { extractDominantColors } from "./colorDetectionModel";
import { classifyOccasion } from "./occasionClassifier";
import { generateRecommendations } from "./outfitRecommender";
import { CLOTHING_DATASET } from "./dataset";

/**
 * Identify the clothing item from user's text description.
 * Matches against CLOTHING_DATASET keywords, falls back to color-based naming.
 */
function identifyItem(description: string, primaryColor: string): string {
  const lower = description.toLowerCase();
  
  // Sort by keyword length (longest first) to match "dress shirt" before "shirt"
  const sorted = [...CLOTHING_DATASET].sort((a, b) => b.keyword.length - a.keyword.length);
  
  for (const entry of sorted) {
    if (lower.includes(entry.keyword)) {
      // Capitalize the keyword nicely
      const name = entry.keyword.charAt(0).toUpperCase() + entry.keyword.slice(1);
      return `${primaryColor} ${name}`;
    }
  }
  
  // Common keywords not in the dataset
  const extraKeywords = [
    "dress", "gown", "saree", "sari", "lehenga", "jumpsuit", "romper",
    "bodysuit", "corset", "kimono", "poncho", "cape", "overalls", "dungarees"
  ];
  for (const kw of extraKeywords) {
    if (lower.includes(kw)) {
      return `${primaryColor} ${kw.charAt(0).toUpperCase() + kw.slice(1)}`;
    }
  }
  
  return `${primaryColor} clothing item`;
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
  colorCompatibility: {
    score: number;
    analysis: string;
  };
  styleAnalysis: string;
  overallScore: number;
}

export async function runFashionMLAnalysis(imageBase64: string, description: string): Promise<FashionMLAnalysis> {
  const detectedColors = await extractDominantColors(imageBase64, 4);
  const colors = detectedColors.map((c) => ({ name: c.name, hex: c.hex }));

  const primaryColor = colors[0]?.name || "Unknown";
  
  // Use the user's description to detect the actual item type
  const detectedItem = identifyItem(description, primaryColor);

  const occasion = classifyOccasion(detectedItem, colors, description);
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
    colorCompatibility: recommendations.colorCompatibility,
    styleAnalysis: recommendations.styleAnalysis,
    overallScore: recommendations.colorCompatibility.score,
  };
}
