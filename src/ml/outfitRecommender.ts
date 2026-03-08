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
  SUGGESTION_RULES,
  COLOR_DATASET,
  COLOR_HARMONY_RULES,
  type SuggestionRule,
} from "./dataset";

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
  colorCompatibility: {
    score: number;
    analysis: string;
  };
  styleAnalysis: string;
}

// ─── Matching Logic ─────────────────────────────────────────────────────────

function findMatchingRule(itemName: string): SuggestionRule | null {
  const lower = itemName.toLowerCase();
  
  // Try exact keyword match first
  for (const rule of SUGGESTION_RULES) {
    if (rule.matchKeywords.some(kw => lower.includes(kw))) {
      return rule;
    }
  }
  return null;
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

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate outfit recommendations based on detected item and colors.
 * 
 * @param detectedItemName - Name of the detected clothing item
 * @param detectedColors - Array of detected color names
 * @param occasion - Predicted occasion (optional, for style analysis)
 */
export function generateRecommendations(
  detectedItemName: string,
  detectedColors: { name: string; hex: string }[],
  occasion?: string,
): OutfitRecommendation {
  const colorNames = detectedColors.map(c => c.name);
  const rule = findMatchingRule(detectedItemName);

  let bottomWear: OutfitSuggestion[];
  let footwear: OutfitSuggestion[];
  let accessories: OutfitSuggestion[];

  if (rule) {
    // Use matched rule and pick best colors
    bottomWear = rule.bottomWear.map(s => ({
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
    bottomWear = [
      { item: "Slim Fit Jeans", color: "Dark Blue", reason: "Versatile jeans work with most clothing items" },
      { item: "Chinos", color: "Khaki", reason: "Smart-casual option for a balanced look" },
      { item: "Trousers", color: "Black", reason: "Formal option for a polished appearance" },
    ];
    footwear = [
      { item: "White Sneakers", color: "White", reason: "Clean sneakers go with almost everything" },
      { item: "Loafers", color: "Brown", reason: "Versatile shoes that bridge casual and formal" },
      { item: "Chelsea Boots", color: "Black", reason: "Classic boots for a sharp look" },
    ];
    accessories = [
      { item: "Watch", color: "Silver", reason: "A timeless accessory that completes any outfit" },
      { item: "Belt", color: "Brown", reason: "Practical accessory that ties the look together" },
      { item: "Sunglasses", color: "Black", reason: "Adds a cool finishing touch" },
    ];
  }

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
  const styleAnalysis = `Your ${detectedItemName.toLowerCase()} in ${primaryColor} creates a strong foundation${occasionText}. ` +
    `The suggested pieces use complementary colors from our harmony dataset to ensure visual cohesion. ` +
    `Mix and match the suggestions to find your preferred combination — all options are scored for color compatibility.`;

  return {
    bottomWear,
    footwear,
    accessories,
    colorCompatibility,
    styleAnalysis,
  };
}
