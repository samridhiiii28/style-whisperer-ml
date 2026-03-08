/**
 * ══════════════════════════════════════════════════════════════════════════════
 * OUTFIT RECOMMENDATION ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * Rule-based recommendation engine that suggests matching bottom wear,
 * footwear, and accessories based on the detected clothing item and colors.
 * 
 * Uses:
 *   - SUGGESTION_RULES from dataset.ts (keyword + color matching)
 *   - COLOR_DATASET for color compatibility scoring
 *   - COLOR_HARMONY_RULES for pairing validation
 * 
 * Scoring algorithm:
 *   1. Match detected item keywords against SUGGESTION_RULES
 *   2. Pick suggestion colors that complement the detected colors
 *   3. Score each suggestion using color harmony rules
 * 
 * No external API calls — runs entirely in the browser.
 */

import {
  COLOR_DATASET,
  COLOR_HARMONY_RULES,
  type SuggestionRule,
} from "./dataset";
import { EXPANDED_SUGGESTION_RULES } from "./suggestionRules";
import { getOccasionSuggestionOverrides } from "./occasionSuggestionOverrides";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OutfitSuggestion {
  item: string;
  color: string;
  reason: string;
}

export interface OutfitRecommendation {
  bottomWear: OutfitSuggestion[];
  footwear: OutfitSuggestion[];
  accessories: OutfitSuggestion[];
  isFullBodyGarment: boolean;
  colorCompatibility: {
    score: number;
    analysis: string;
  };
  styleAnalysis: string;
}

// ─── Matching Logic ─────────────────────────────────────────────────────────

function findMatchingRule(itemName: string): SuggestionRule | null {
  const lower = itemName.toLowerCase();
  
  // Try exact keyword match first (longest keyword first for precision)
  let bestRule: SuggestionRule | null = null;
  let bestLen = 0;

  for (const rule of EXPANDED_SUGGESTION_RULES) {
    for (const kw of rule.matchKeywords) {
      if (lower.includes(kw) && kw.length > bestLen) {
        bestRule = rule;
        bestLen = kw.length;
      }
    }
  }
  return bestRule;
}

/**
 * Pick the best color from an array of color options based on
 * what pairs well with the detected colors.
 */
function pickBestColor(
  options: string[],
  detectedColorNames: string[]
): string {
  // Check which option has the best pairing with detected colors
  let bestOption = options[0];
  let bestScore = 0;

  for (const option of options) {
    let score = 0;
    const optionLower = option.toLowerCase();

    for (const detected of detectedColorNames) {
      const detectedLower = detected.toLowerCase();

      // Check universal pairs
      for (const pair of COLOR_HARMONY_RULES.universalPairs) {
        const [a, b] = pair.map(p => p.toLowerCase());
        if ((optionLower.includes(a) && detectedLower.includes(b)) ||
            (optionLower.includes(b) && detectedLower.includes(a))) {
          score += 3;
        }
      }

      // Check if option is a universal neutral
      if (COLOR_HARMONY_RULES.universalNeutrals.some(n => optionLower.includes(n.toLowerCase()))) {
        score += 1;
      }

      // Check dataset pairsWith
      const colorEntry = COLOR_DATASET.find(c => detectedLower.includes(c.name.toLowerCase()));
      if (colorEntry && colorEntry.pairsWith.some(p => optionLower.includes(p.toLowerCase()))) {
        score += 2;
      }

      // Penalize clashing colors
      for (const clash of COLOR_HARMONY_RULES.clashingPairs) {
        const [a, b] = clash.map(p => p.toLowerCase());
        if ((optionLower.includes(a) && detectedLower.includes(b)) ||
            (optionLower.includes(b) && detectedLower.includes(a))) {
          score -= 2;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestOption = option;
    }
  }

  return bestOption;
}

/**
 * Calculate color compatibility score based on harmony rules.
 */
function calculateColorScore(
  detectedColors: string[],
  suggestedColors: string[]
): { score: number; analysis: string } {
  let score = 60; // baseline
  const reasons: string[] = [];

  const allColors = [...detectedColors, ...suggestedColors].map(c => c.toLowerCase());

  // Check for neutral anchors
  const neutralCount = allColors.filter(c =>
    COLOR_HARMONY_RULES.universalNeutrals.some(n => c.includes(n.toLowerCase()))
  ).length;
  if (neutralCount >= 2) {
    score += 10;
    reasons.push("Strong neutral foundation provides versatility");
  }

  // Check for complementary pairs
  let pairCount = 0;
  for (const pair of COLOR_HARMONY_RULES.universalPairs) {
    const [a, b] = pair.map(p => p.toLowerCase());
    if (allColors.some(c => c.includes(a)) && allColors.some(c => c.includes(b))) {
      pairCount++;
    }
  }
  if (pairCount > 0) {
    score += pairCount * 8;
    reasons.push(`${pairCount} complementary color pairing${pairCount > 1 ? "s" : ""} detected`);
  }

  // Check for clashing
  let clashCount = 0;
  for (const clash of COLOR_HARMONY_RULES.clashingPairs) {
    const [a, b] = clash.map(p => p.toLowerCase());
    if (allColors.some(c => c.includes(a)) && allColors.some(c => c.includes(b))) {
      clashCount++;
    }
  }
  if (clashCount > 0) {
    score -= clashCount * 10;
    reasons.push(`${clashCount} potentially clashing combination${clashCount > 1 ? "s" : ""} — consider swapping`);
  }

  // Warmth consistency bonus
  const warmths = allColors.map(c => {
    const entry = COLOR_DATASET.find(e => c.includes(e.name.toLowerCase()));
    return entry?.warmth || "neutral";
  });
  const warmCount = warmths.filter(w => w === "warm").length;
  const coolCount = warmths.filter(w => w === "cool").length;
  if (warmCount > 0 && coolCount === 0) {
    score += 5;
    reasons.push("Consistent warm color temperature across the outfit");
  } else if (coolCount > 0 && warmCount === 0) {
    score += 5;
    reasons.push("Consistent cool color temperature across the outfit");
  }

  score = Math.max(0, Math.min(100, score));

  const analysis = reasons.length > 0
    ? reasons.join(". ") + "."
    : "Balanced color palette with reasonable compatibility.";

  return { score, analysis };
}

// ─── Suggestion composition helpers ──────────────────────────────────────────

function mergeSuggestions(base: OutfitSuggestion[], extras: OutfitSuggestion[]): OutfitSuggestion[] {
  const seen = new Set<string>();
  return [...base, ...extras].filter((entry) => {
    const key = `${entry.item.toLowerCase()}|${entry.color.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Full-body garment detection ─────────────────────────────────────────────

const FULL_BODY_KEYWORDS = [
  "dress", "gown", "frock", "sundress", "bodycon", "maxi", "mini dress",
  "jumpsuit", "romper", "overalls", "dungarees", "saree", "sari", "lehenga",
  "anarkali", "one-piece", "playsuit",
];

function isFullBody(itemName: string): boolean {
  const lower = itemName.toLowerCase();
  return FULL_BODY_KEYWORDS.some(kw => lower.includes(kw));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate outfit recommendations based on detected item and colors.
 */
export function generateRecommendations(
  detectedItemName: string,
  detectedColors: { name: string; hex: string }[],
  occasion?: string,
): OutfitRecommendation {
  const colorNames = detectedColors.map(c => c.name);
  const rule = findMatchingRule(detectedItemName);
  const fullBody = isFullBody(detectedItemName);

  let bottomWear: OutfitSuggestion[];
  let footwear: OutfitSuggestion[];
  let accessories: OutfitSuggestion[];

  if (rule) {
    // Use matched rule and pick best colors
    // If it's a full-body garment, force empty bottomWear
    bottomWear = fullBody ? [] : rule.bottomWear.map(s => ({
      item: s.item,
      color: pickBestColor(s.colors, colorNames),
      reason: s.reason,
    }));
    footwear = rule.footwear.map(s => ({
      item: s.item,
      color: pickBestColor(s.colors, colorNames),
      reason: s.reason,
    }));
    accessories = rule.accessories.map(s => ({
      item: s.item,
      color: pickBestColor(s.colors, colorNames),
      reason: s.reason,
    }));
  } else {
    // Fallback generic suggestions
    bottomWear = fullBody ? [] : [
      { item: "Slim Fit Jeans", color: "Dark Blue", reason: "Versatile jeans work with most clothing items" },
      { item: "Tailored Trousers", color: "Black", reason: "Smart option for a polished appearance" },
      { item: "Barrel Leg Pants", color: "Cream", reason: "2026 trending barrel-leg for a relaxed modern silhouette" },
      { item: "Wide-Leg Linen Pants", color: "Sand", reason: "Quiet luxury linen — a top 2026 trend" },
      { item: "Pleated Chinos", color: "Olive", reason: "Pleated chinos for smart-casual versatility" },
    ];
    footwear = [
      { item: "Chunky Sneakers", color: "White", reason: "2026 chunky sneakers go with almost everything" },
      { item: "Ankle Boots", color: "Black", reason: "Versatile boots for a sharp modern look" },
      { item: "Platform Loafers", color: "Brown", reason: "Platform loafers trending in 2026 for elevated casual" },
      { item: "Mary Janes", color: "Black", reason: "Retro Mary Janes — a 2026 feminine revival" },
      { item: "Retro Running Shoes", color: "Grey", reason: "Retro runner revival for sporty-casual style" },
    ];
    accessories = [
      { item: "Watch", color: "Silver", reason: "A timeless accessory that completes any outfit" },
      { item: "Crossbody Bag", color: "Black", reason: "Practical and stylish for everyday wear" },
      { item: "Sunglasses", color: "Black", reason: "Adds a cool finishing touch" },
      { item: "Stud Earrings", color: "Gold", reason: "Minimal earrings for a clean finishing touch" },
      { item: "Chain Bracelet", color: "Silver", reason: "A simple bracelet adds wrist interest" },
      { item: "Hoop Earrings", color: "Gold", reason: "Classic hoops trending in 2026 for everyday wear" },
    ];
  }

  const occasionOverrides = getOccasionSuggestionOverrides(occasion, fullBody);
  bottomWear = mergeSuggestions(bottomWear, occasionOverrides.bottomWear);
  footwear = mergeSuggestions(footwear, occasionOverrides.footwear);
  accessories = mergeSuggestions(accessories, occasionOverrides.accessories);

  // Calculate color compatibility
  const suggestedColorNames = [
    ...bottomWear.map(s => s.color),
    ...footwear.map(s => s.color),
    ...accessories.map(s => s.color),
  ];
  const colorCompatibility = calculateColorScore(colorNames, suggestedColorNames);

  // Style analysis
  const occasionText = occasion ? ` for ${occasion}` : "";
  const primaryColor = colorNames[0] || "your clothing";
  const garmentNote = fullBody
    ? ` Since this is a full-body garment, we're focusing on footwear and accessories to complete the look.`
    : "";
  const styleAnalysis = `Your ${detectedItemName.toLowerCase()} in ${primaryColor} creates a strong foundation${occasionText}.${garmentNote} ` +
    `The suggested pieces use complementary colors from our harmony dataset to ensure visual cohesion. ` +
    `Mix and match the suggestions to find your preferred combination — all options are scored for color compatibility.`;

  return {
    bottomWear,
    footwear,
    accessories,
    isFullBodyGarment: fullBody,
    colorCompatibility,
    styleAnalysis,
  };
}
