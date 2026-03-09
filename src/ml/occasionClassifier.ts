/**
 * ══════════════════════════════════════════════════════════════════════════════
 * OCCASION CLASSIFIER — Trained Decision Tree + KNN Ensemble
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Uses TRAINED models from the training pipeline (500+ samples):
 *   - CART Decision Tree (Gini impurity, depth 10)
 *   - K-Nearest Neighbors (K=7, distance-weighted)
 *
 * Models are trained on app initialization and cached in memory.
 * No external API calls — runs entirely in the browser.
 */

import { getTrainedModels, extractFeatures, dtPredict, knnPredict } from "./training";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OccasionPrediction {
  primary: string;
  confidence: number;
  alternatives: string[];
  reasoning: string;
  features: {
    formality: number;
    neutralRatio: number;
    saturationAvg: number;
    dominantTraits: string[];
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function classifyOccasion(
  detectedItemName: string,
  detectedColors: { name: string; hex: string }[],
  description?: string,
): OccasionPrediction {
  // Extract features using the training pipeline's feature extractor
  const { raw, scaled, dominantTraits } = extractFeatures(detectedItemName, detectedColors);

  // Get trained models
  const { dtModel, knnModel } = getTrainedModels();

  // Decision Tree prediction
  const dtResult = dtPredict(dtModel.tree, scaled);
  let primary = dtResult.label;

  // KNN prediction for alternatives and confidence
  const knnResult = knnPredict(knnModel, scaled);

  // Description hint can override primary occasion
  let hintedOccasion: string | undefined;
  if (description) {
    const lower = description.toLowerCase();
    const hintMap: Record<string, string> = {
      office: "Office", work: "Office", college: "College", school: "College", campus: "College",
      party: "Party", date: "Date Night", wedding: "Wedding", formal: "Formal",
      casual: "Casual", gym: "Sports", sport: "Sports", festival: "Festival",
      brunch: "Brunch", travel: "Travel", beach: "Beach", interview: "Interview",
      cocktail: "Cocktail", streetwear: "Streetwear", ethnic: "Ethnic Festive",
      "night out": "Night Out", club: "Night Out",
    };
    for (const [keyword, occasion] of Object.entries(hintMap)) {
      if (lower.includes(keyword)) { hintedOccasion = occasion; break; }
    }
  }

  const modelPrimary = primary;
  if (hintedOccasion) primary = hintedOccasion;

  // Confidence from ensemble
  const confidence = Math.round(
    (dtResult.confidence * 0.6 + (knnResult.confidence / 100) * 0.4) * 100
  );

  // Alternatives from KNN
  const alternatives = knnResult.alternatives.filter(a => a !== primary).slice(0, 2);
  if (hintedOccasion && modelPrimary !== primary && !alternatives.includes(modelPrimary)) {
    alternatives.unshift(modelPrimary);
  }

  const formalityLabel = raw.formality >= 4 ? "high" : raw.formality >= 2.5 ? "moderate" : "low";
  const reasoning = `Trained Decision Tree (${dtModel.trainingSamples} samples, ${(dtModel.trainingAccuracy * 100).toFixed(0)}% accuracy) predicts ${modelPrimary}. ` +
    `KNN (K=7) votes: ${Object.entries(knnResult.votes).map(([k, v]) => `${k}=${(v * 100).toFixed(0)}%`).join(", ")}. ` +
    `Features: ${formalityLabel} formality (${raw.formality}/5), ${Math.round(raw.neutralRatio * 100)}% neutral, ${Math.round(raw.saturationAvg)}% saturation. ` +
    `Traits: ${dominantTraits.join(", ")}.`;

  return {
    primary,
    confidence: Math.min(confidence, 100),
    alternatives: alternatives.slice(0, 2),
    reasoning,
    features: {
      formality: raw.formality,
      neutralRatio: raw.neutralRatio,
      saturationAvg: raw.saturationAvg,
      dominantTraits,
    },
  };
}
