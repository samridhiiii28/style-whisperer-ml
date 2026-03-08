/**
 * Central Fashion ML pipeline (client-side).
 *
 * This file exists so you can quickly find the core ML workflow in one place.
 * All model implementations and datasets are in src/ml/* files.
 */

import { extractDominantColors } from "./colorDetectionModel";
import { classifyOccasion } from "./occasionClassifier";
import { generateRecommendations } from "./outfitRecommender";

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
  const detectedItem = `${primaryColor} clothing item`;

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
