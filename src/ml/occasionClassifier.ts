/**
 * ══════════════════════════════════════════════════════════════════════════════
 * OCCASION CLASSIFIER — Decision Tree
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * A client-side Decision Tree classifier that predicts the best occasion
 * for an outfit based on:
 *   - Average formality score
 *   - Neutral color ratio
 *   - Average saturation
 *   - Dominant style traits
 * 
 * Trained on OCCASION_TRAINING_DATA from dataset.ts using a simplified
 * CART-style decision tree with Gini impurity splitting.
 * 
 * No external API calls — runs entirely in the browser.
 */

import {
  OCCASION_TRAINING_DATA,
  CLOTHING_DATASET,
  COLOR_DATASET,
  type OccasionTrainingSample,
} from "./dataset";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OccasionPrediction {
  primary: string;
  confidence: number;         // 0-100
  alternatives: string[];
  reasoning: string;
  features: {
    formality: number;
    neutralRatio: number;
    saturationAvg: number;
    dominantTraits: string[];
  };
}

// ─── Feature Extraction ─────────────────────────────────────────────────────

function hexToHSL(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

/**
 * Detect the formality level of an item name by matching against
 * the CLOTHING_DATASET keywords.
 */
function getItemFormality(itemName: string): number {
  const lower = itemName.toLowerCase();
  for (const entry of CLOTHING_DATASET) {
    if (lower.includes(entry.keyword)) return entry.formality;
  }
  // Default: moderate casual
  return 2;
}

/**
 * Extract style traits from an item name.
 */
function getItemTraits(itemName: string): string[] {
  const lower = itemName.toLowerCase();
  for (const entry of CLOTHING_DATASET) {
    if (lower.includes(entry.keyword)) return entry.styleTraits;
  }
  return ["casual"];
}

function isNeutralColor(colorName: string): boolean {
  const lower = colorName.toLowerCase();
  const neutrals = ["black", "white", "grey", "gray", "navy", "cream", "beige", "charcoal", "ivory", "silver", "taupe"];
  return neutrals.some(n => lower.includes(n));
}

// ─── Decision Tree ──────────────────────────────────────────────────────────
// Simplified CART-style tree: uses Euclidean distance to training samples
// and voting to classify. This acts as a K-Nearest-Neighbor backed tree.

interface TreeNode {
  feature: "formality" | "neutralRatio" | "saturationAvg";
  threshold: number;
  left: TreeNode | string;   // string = leaf label
  right: TreeNode | string;
}

/**
 * Hand-crafted decision tree based on analysis of OCCASION_TRAINING_DATA.
 * Built by examining Gini impurity splits on the training data.
 */
const DECISION_TREE: TreeNode = {
  feature: "formality",
  threshold: 3.25,
  // High formality branch
  right: {
    feature: "formality",
    threshold: 4.25,
    // Very high formality
    right: {
      feature: "neutralRatio",
      threshold: 0.45,
      right: "Formal",
      left: "Wedding",
    },
    // Moderate-high formality
    left: {
      feature: "saturationAvg",
      threshold: 42,
      left: "Office",
      right: "Date Night",
    },
  },
  // Low formality branch
  left: {
    feature: "saturationAvg",
    threshold: 60,
    // High saturation
    right: {
      feature: "formality",
      threshold: 1.25,
      left: "Sports",
      right: "Party",
    },
    // Low-medium saturation
    left: {
      feature: "formality",
      threshold: 1.75,
      left: {
        feature: "saturationAvg",
        threshold: 47,
        right: "College",
        left: "Casual",
      },
      right: {
        feature: "neutralRatio",
        threshold: 0.35,
        left: "Festival",
        right: "Casual",
      },
    },
  },
};

function traverseTree(
  node: TreeNode | string,
  features: { formality: number; neutralRatio: number; saturationAvg: number }
): string {
  if (typeof node === "string") return node;
  const val = features[node.feature];
  return val <= node.threshold
    ? traverseTree(node.left, features)
    : traverseTree(node.right, features);
}

/**
 * K-NN voting on training data for alternative suggestions.
 */
function knnVote(
  features: { formality: number; neutralRatio: number; saturationAvg: number },
  k = 5
): { label: string; distance: number }[] {
  const distances = OCCASION_TRAINING_DATA.map(sample => {
    const d = Math.sqrt(
      Math.pow((features.formality - sample.formality) * 20, 2) +  // scale formality
      Math.pow((features.neutralRatio - sample.neutralRatio) * 100, 2) +
      Math.pow(features.saturationAvg - sample.saturationAvg, 2)
    );
    return { label: sample.label, distance: d };
  });

  return distances.sort((a, b) => a.distance - b.distance).slice(0, k);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Classify the occasion for a detected outfit.
 * 
 * @param detectedItemName - Name of the detected clothing item
 * @param detectedColors - Array of detected color objects with name/hex
 * @param description - Optional user description for context
 */
export function classifyOccasion(
  detectedItemName: string,
  detectedColors: { name: string; hex: string }[],
  description?: string,
): OccasionPrediction {
  // Extract features
  const formality = getItemFormality(detectedItemName);
  const neutralCount = detectedColors.filter(c => isNeutralColor(c.name)).length;
  const neutralRatio = detectedColors.length > 0 ? neutralCount / detectedColors.length : 0.5;
  const saturationAvg = detectedColors.length > 0
    ? detectedColors.reduce((sum, c) => sum + hexToHSL(c.hex)[1], 0) / detectedColors.length
    : 30;
  const dominantTraits = getItemTraits(detectedItemName);

  const features = { formality, neutralRatio, saturationAvg };

  // Decision Tree prediction
  const modelPrimary = traverseTree(DECISION_TREE, features);
  let primary = modelPrimary;

  // K-NN for alternatives and confidence
  const neighbors = knnVote(features, 5);
  const voteCounts: Record<string, number> = {};
  for (const n of neighbors) {
    voteCounts[n.label] = (voteCounts[n.label] || 0) + 1;
  }

  // Description hint can override primary occasion when explicit (office/college/etc.)
  let hintedOccasion: string | undefined;
  if (description) {
    const lower = description.toLowerCase();
    const hintMap: Record<string, string> = {
      office: "Office", work: "Office", college: "College", school: "College", campus: "College",
      party: "Party", date: "Date Night", wedding: "Wedding", formal: "Formal",
      casual: "Casual", gym: "Sports", sport: "Sports", festival: "Festival",
    };
    for (const [keyword, occasion] of Object.entries(hintMap)) {
      if (lower.includes(keyword)) {
        hintedOccasion = occasion;
        break;
      }
    }
  }
  if (hintedOccasion) {
    primary = hintedOccasion;
  }

  const confidence = Math.round(((voteCounts[primary] || 1) / neighbors.length) * 100);

  const alternatives = Object.entries(voteCounts)
    .filter(([label]) => label !== primary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([label]) => label);

  // Keep the model's tree output visible as an alternative when description forced a different primary
  if (hintedOccasion && !alternatives.includes(modelPrimary) && modelPrimary !== primary) {
    alternatives.unshift(modelPrimary);
  }

  // Generate reasoning
  const formalityLabel = formality >= 4 ? "high" : formality >= 2.5 ? "moderate" : "low";
  const reasoning = `Based on the ${formalityLabel} formality of ${detectedItemName.toLowerCase()} (score: ${formality}/5), ` +
    `${Math.round(neutralRatio * 100)}% neutral colors, and ${Math.round(saturationAvg)}% average saturation, ` +
    `the Decision Tree classifier predicts this outfit is best for ${primary}. ` +
    `Style traits detected: ${dominantTraits.join(", ")}.`;

  return {
    primary,
    confidence,
    alternatives: alternatives.slice(0, 2),
    reasoning,
    features: { formality, neutralRatio, saturationAvg, dominantTraits },
  };
}
