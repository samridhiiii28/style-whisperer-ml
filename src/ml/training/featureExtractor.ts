/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FEATURE EXTRACTOR — Numerical Feature Engineering for ML Models
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Transforms raw clothing item data (text + colors) into numerical feature
 * vectors suitable for Decision Tree / KNN / Random Forest classifiers.
 *
 * Feature Vector (7-dimensional):
 *   [0] formality        — avg formality of outfit items (1.0 – 5.0)
 *   [1] neutralRatio     — fraction of colors that are neutral (0.0 – 1.0)
 *   [2] saturationAvg    — mean HSL saturation of detected colors (0 – 100)
 *   [3] lightnessAvg     — mean HSL lightness of detected colors (0 – 100)
 *   [4] warmthScore      — fraction of warm colors (0.0 – 1.0)
 *   [5] hueVariance      — variance of hue values (0 – 180²)
 *   [6] formalityRange   — max formality – min formality across items (0 – 4)
 *
 * All features are scaled to [0, 1] before training via MinMaxScaler.
 *
 * No external dependencies — runs entirely in the browser.
 */

import { CLOTHING_DATASET, COLOR_DATASET } from "../dataset";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FeatureVector {
  formality: number;
  neutralRatio: number;
  saturationAvg: number;
  lightnessAvg: number;
  warmthScore: number;
  hueVariance: number;
  formalityRange: number;
}

export interface ScaledFeatureVector {
  raw: FeatureVector;
  scaled: number[];       // 7-dim [0, 1] vector
  dominantTraits: string[];
}

// ─── Feature Bounds for MinMax Scaling ───────────────────────────────────────

const FEATURE_BOUNDS: { min: number; max: number }[] = [
  { min: 1.0, max: 5.0 },   // formality
  { min: 0.0, max: 1.0 },   // neutralRatio
  { min: 0.0, max: 100.0 }, // saturationAvg
  { min: 0.0, max: 100.0 }, // lightnessAvg
  { min: 0.0, max: 1.0 },   // warmthScore
  { min: 0.0, max: 32400 }, // hueVariance (180²)
  { min: 0.0, max: 4.0 },   // formalityRange
];

// ─── HSL Conversion ──────────────────────────────────────────────────────────

export function hexToHSL(hex: string): [number, number, number] {
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

// ─── Neutral Detection ───────────────────────────────────────────────────────

const NEUTRAL_KEYWORDS = [
  "black", "white", "grey", "gray", "navy", "cream", "beige",
  "charcoal", "ivory", "silver", "taupe", "khaki",
];

export function isNeutralColor(colorName: string): boolean {
  const lower = colorName.toLowerCase();
  return NEUTRAL_KEYWORDS.some(n => lower.includes(n));
}

// ─── Warmth Detection ────────────────────────────────────────────────────────

export function isWarmColor(colorName: string): boolean {
  const entry = COLOR_DATASET.find(
    c => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return entry?.warmth === "warm";
}

// ─── Item Formality Lookup ───────────────────────────────────────────────────

export function getItemFormality(itemName: string): number {
  const lower = itemName.toLowerCase();
  for (const entry of CLOTHING_DATASET) {
    if (lower.includes(entry.keyword)) return entry.formality;
  }
  return 2; // default moderate casual
}

export function getItemTraits(itemName: string): string[] {
  const lower = itemName.toLowerCase();
  for (const entry of CLOTHING_DATASET) {
    if (lower.includes(entry.keyword)) return entry.styleTraits;
  }
  return ["casual"];
}

// ─── Feature Extraction ──────────────────────────────────────────────────────

/**
 * Extract a 7-dimensional feature vector from an item and its colors.
 *
 * @param itemName       — detected clothing item name
 * @param detectedColors — array of {name, hex} from color detection model
 * @returns ScaledFeatureVector with raw, scaled, and dominantTraits
 */
export function extractFeatures(
  itemName: string,
  detectedColors: { name: string; hex: string }[],
): ScaledFeatureVector {
  // ── Formality ──
  const formality = getItemFormality(itemName);

  // ── Neutral Ratio ──
  const neutralCount = detectedColors.filter(c => isNeutralColor(c.name)).length;
  const neutralRatio = detectedColors.length > 0 ? neutralCount / detectedColors.length : 0.5;

  // ── Saturation & Lightness ──
  const hsls = detectedColors.map(c => hexToHSL(c.hex));
  const saturationAvg = hsls.length > 0
    ? hsls.reduce((sum, hsl) => sum + hsl[1], 0) / hsls.length
    : 30;
  const lightnessAvg = hsls.length > 0
    ? hsls.reduce((sum, hsl) => sum + hsl[2], 0) / hsls.length
    : 50;

  // ── Warmth Score ──
  const warmCount = detectedColors.filter(c => isWarmColor(c.name)).length;
  const warmthScore = detectedColors.length > 0 ? warmCount / detectedColors.length : 0.5;

  // ── Hue Variance ──
  let hueVariance = 0;
  if (hsls.length > 1) {
    const meanHue = hsls.reduce((s, h) => s + h[0], 0) / hsls.length;
    hueVariance = hsls.reduce((s, h) => s + Math.pow(h[0] - meanHue, 2), 0) / hsls.length;
  }

  // ── Formality Range (single item = 0) ──
  const formalityRange = 0;

  // ── Dominant Traits ──
  const dominantTraits = getItemTraits(itemName);

  const raw: FeatureVector = {
    formality,
    neutralRatio,
    saturationAvg,
    lightnessAvg,
    warmthScore,
    hueVariance,
    formalityRange,
  };

  // ── MinMax Scale to [0, 1] ──
  const rawArr = [formality, neutralRatio, saturationAvg, lightnessAvg, warmthScore, hueVariance, formalityRange];
  const scaled = rawArr.map((val, i) => {
    const { min, max } = FEATURE_BOUNDS[i];
    if (max === min) return 0;
    return Math.max(0, Math.min(1, (val - min) / (max - min)));
  });

  return { raw, scaled, dominantTraits };
}

/**
 * Convert a training sample into a scaled feature vector.
 * Used during model training.
 */
export function trainingSampleToScaled(sample: {
  formality: number;
  neutralRatio: number;
  saturationAvg: number;
  lightnessAvg?: number;
  warmthScore?: number;
  hueVariance?: number;
  formalityRange?: number;
}): number[] {
  const rawArr = [
    sample.formality,
    sample.neutralRatio,
    sample.saturationAvg,
    sample.lightnessAvg ?? 50,
    sample.warmthScore ?? 0.5,
    sample.hueVariance ?? 0,
    sample.formalityRange ?? 0,
  ];
  return rawArr.map((val, i) => {
    const { min, max } = FEATURE_BOUNDS[i];
    if (max === min) return 0;
    return Math.max(0, Math.min(1, (val - min) / (max - min)));
  });
}
