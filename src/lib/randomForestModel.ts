/**
 * Random Forest Outfit Compatibility Model
 * 
 * A client-side ensemble of decision trees that evaluates outfit compatibility
 * based on color harmony, style coherence, and occasion appropriateness.
 * No external API calls — runs entirely in the browser.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OutfitItem {
  name: string;
  color: string;
  hex?: string;
  category: "top" | "bottom" | "footwear" | "accessory";
}

export interface CompatibilityResult {
  overallScore: number;
  colorHarmony: number;
  styleCoherence: number;
  occasionFit: number;
  treeVotes: number[];
  confidence: number;
  insights: string[];
}

// ─── Color Utilities ─────────────────────────────────────────────────────────

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

function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    black: "#000000", white: "#FFFFFF", red: "#CC3333", blue: "#3366CC",
    navy: "#1A2744", green: "#336633", olive: "#6B6B3C", brown: "#8B4513",
    tan: "#D2B48C", beige: "#F5F5DC", cream: "#FFFDD0", grey: "#808080",
    gray: "#808080", pink: "#E8A0BF", purple: "#663399", yellow: "#DDCC33",
    orange: "#CC7733", gold: "#B8860B", silver: "#C0C0C0", maroon: "#800000",
    teal: "#008080", coral: "#FF6F61", burgundy: "#800020", khaki: "#C3B091",
    denim: "#1560BD", charcoal: "#36454F", ivory: "#FFFFF0", rust: "#B7410E",
    lavender: "#B57EDC", mint: "#98FB98", peach: "#FFDAB9", plum: "#8E4585",
    sage: "#9CAF88", wine: "#722F37", mustard: "#FFDB58", camel: "#C19A6B",
  };
  const lower = name.toLowerCase().trim();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return "#808080";
}

// ─── Feature Extraction ─────────────────────────────────────────────────────

interface Features {
  hueVariance: number;
  saturationAvg: number;
  lightnessRange: number;
  complementaryScore: number;
  analogousScore: number;
  neutralRatio: number;
  itemCount: number;
  categorySpread: number;
}

function extractFeatures(items: OutfitItem[]): Features {
  const hsls = items.map(item => {
    const hex = item.hex || colorNameToHex(item.color);
    return hexToHSL(hex);
  });

  const hues = hsls.map(h => h[0]);
  const sats = hsls.map(h => h[1]);
  const lights = hsls.map(h => h[2]);

  // Hue variance
  const meanHue = hues.reduce((a, b) => a + b, 0) / hues.length;
  const hueVariance = hues.reduce((sum, h) => {
    const diff = Math.min(Math.abs(h - meanHue), 360 - Math.abs(h - meanHue));
    return sum + diff * diff;
  }, 0) / hues.length;

  // Saturation average
  const saturationAvg = sats.reduce((a, b) => a + b, 0) / sats.length;

  // Lightness range
  const lightnessRange = Math.max(...lights) - Math.min(...lights);

  // Complementary score (hues ~180° apart)
  let complementaryScore = 0;
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = Math.abs(hues[i] - hues[j]);
      const minDiff = Math.min(diff, 360 - diff);
      if (minDiff >= 150 && minDiff <= 210) complementaryScore += 1;
    }
  }

  // Analogous score (hues within 30°)
  let analogousScore = 0;
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = Math.abs(hues[i] - hues[j]);
      const minDiff = Math.min(diff, 360 - diff);
      if (minDiff <= 30) analogousScore += 1;
    }
  }

  // Neutral ratio
  const neutralCount = hsls.filter(([, s, l]) => s < 15 || l < 15 || l > 85).length;
  const neutralRatio = neutralCount / items.length;

  // Category spread
  const categories = new Set(items.map(i => i.category));
  const categorySpread = categories.size / 4;

  return {
    hueVariance,
    saturationAvg,
    lightnessRange,
    complementaryScore,
    analogousScore,
    neutralRatio,
    itemCount: items.length,
    categorySpread,
  };
}

// ─── Decision Trees ──────────────────────────────────────────────────────────

type TreeFn = (f: Features) => number;

// Each tree returns a score 0-100
const trees: TreeFn[] = [
  // Tree 1: Color harmony focused
  (f) => {
    let score = 50;
    if (f.analogousScore >= 2) score += 25;
    else if (f.complementaryScore >= 1) score += 20;
    if (f.neutralRatio >= 0.3 && f.neutralRatio <= 0.6) score += 15;
    if (f.hueVariance > 10000) score -= 20;
    if (f.lightnessRange > 30 && f.lightnessRange < 70) score += 10;
    return Math.max(0, Math.min(100, score));
  },

  // Tree 2: Saturation balance
  (f) => {
    let score = 50;
    if (f.saturationAvg >= 20 && f.saturationAvg <= 60) score += 25;
    else if (f.saturationAvg > 80) score -= 10;
    if (f.neutralRatio >= 0.25) score += 15;
    if (f.categorySpread >= 0.75) score += 10;
    return Math.max(0, Math.min(100, score));
  },

  // Tree 3: Contrast & variety
  (f) => {
    let score = 50;
    if (f.lightnessRange >= 20 && f.lightnessRange <= 60) score += 20;
    if (f.itemCount >= 3 && f.itemCount <= 5) score += 10;
    if (f.complementaryScore >= 1) score += 15;
    if (f.hueVariance < 5000) score += 10;
    else if (f.hueVariance > 15000) score -= 15;
    return Math.max(0, Math.min(100, score));
  },

  // Tree 4: Neutral-heavy outfits
  (f) => {
    let score = 50;
    if (f.neutralRatio >= 0.5) score += 20;
    if (f.saturationAvg < 30) score += 15;
    if (f.lightnessRange >= 25) score += 10;
    if (f.categorySpread >= 0.5) score += 10;
    if (f.hueVariance < 3000) score += 5;
    return Math.max(0, Math.min(100, score));
  },

  // Tree 5: Bold/statement outfits
  (f) => {
    let score = 40;
    if (f.saturationAvg >= 50) score += 20;
    if (f.complementaryScore >= 1) score += 20;
    if (f.lightnessRange >= 30) score += 10;
    if (f.neutralRatio >= 0.2) score += 10;
    if (f.analogousScore >= 1) score += 5;
    return Math.max(0, Math.min(100, score));
  },

  // Tree 6: Monochromatic harmony
  (f) => {
    let score = 45;
    if (f.hueVariance < 2000) score += 30;
    if (f.lightnessRange >= 15 && f.lightnessRange <= 50) score += 15;
    if (f.saturationAvg >= 15 && f.saturationAvg <= 70) score += 10;
    if (f.hueVariance > 8000) score -= 20;
    return Math.max(0, Math.min(100, score));
  },

  // Tree 7: Warm/cool temperature consistency
  (f) => {
    let score = 55;
    if (f.analogousScore >= 2) score += 20;
    if (f.neutralRatio >= 0.3) score += 10;
    if (f.saturationAvg >= 25 && f.saturationAvg <= 55) score += 10;
    if (f.hueVariance > 12000) score -= 25;
    return Math.max(0, Math.min(100, score));
  },
];

// ─── Public API ──────────────────────────────────────────────────────────────

export function evaluateOutfitCompatibility(items: OutfitItem[]): CompatibilityResult {
  if (items.length < 2) {
    return {
      overallScore: 50,
      colorHarmony: 50,
      styleCoherence: 50,
      occasionFit: 50,
      treeVotes: [],
      confidence: 0,
      insights: ["Add more items for a complete compatibility analysis."],
    };
  }

  const features = extractFeatures(items);
  const treeVotes = trees.map(tree => tree(features));

  // Aggregate: weighted average (ensemble vote)
  const overallScore = Math.round(treeVotes.reduce((a, b) => a + b, 0) / treeVotes.length);

  // Sub-scores derived from features
  const colorHarmony = Math.round(
    Math.min(100, 50 + features.analogousScore * 15 + features.complementaryScore * 12 - (features.hueVariance > 10000 ? 20 : 0) + features.neutralRatio * 20)
  );

  const styleCoherence = Math.round(
    Math.min(100, 40 + features.categorySpread * 30 + (features.itemCount >= 3 ? 15 : 0) + (features.lightnessRange > 20 ? 10 : 0))
  );

  const occasionFit = Math.round(
    Math.min(100, 50 + (features.neutralRatio >= 0.3 ? 20 : 0) + (features.saturationAvg <= 50 ? 15 : 0) + features.categorySpread * 15)
  );

  // Confidence from tree agreement
  const variance = treeVotes.reduce((sum, v) => sum + Math.pow(v - overallScore, 2), 0) / treeVotes.length;
  const confidence = Math.round(Math.max(0, Math.min(100, 100 - Math.sqrt(variance) * 2)));

  // Generate insights
  const insights: string[] = [];
  if (features.analogousScore >= 2) insights.push("Colors are harmoniously analogous — excellent pairing.");
  if (features.complementaryScore >= 1) insights.push("Complementary color contrast adds visual interest.");
  if (features.neutralRatio >= 0.5) insights.push("Strong neutral base provides versatile styling.");
  if (features.hueVariance > 12000) insights.push("High color variety — consider anchoring with a neutral piece.");
  if (features.lightnessRange < 15) insights.push("Low contrast between items — adding a lighter or darker piece would improve depth.");
  if (features.saturationAvg > 70) insights.push("Very saturated palette — works well for bold, statement looks.");
  if (features.categorySpread >= 0.75) insights.push("Good coverage across outfit categories for a complete look.");
  if (insights.length === 0) insights.push("Balanced outfit with reasonable color and style compatibility.");

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    colorHarmony: Math.max(0, Math.min(100, colorHarmony)),
    styleCoherence: Math.max(0, Math.min(100, styleCoherence)),
    occasionFit: Math.max(0, Math.min(100, occasionFit)),
    treeVotes,
    confidence,
    insights,
  };
}
