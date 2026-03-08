import type { AnalysisResult } from "@/components/ResultsDisplay";

// Color keyword to hex mapping for visualization
const COLOR_MAP: Record<string, string> = {
  navy: "#1B2A4A", blue: "#2563EB", black: "#1a1a1a", white: "#F5F5F0",
  grey: "#8B8B8B", gray: "#8B8B8B", red: "#C41E3A", burgundy: "#722F37",
  brown: "#6B4226", tan: "#C4A882", beige: "#D4C5A9", cream: "#FFFDD0",
  green: "#2D6A4F", olive: "#556B2F", pink: "#E8A0BF", purple: "#6B21A8",
  gold: "#C5A55A", silver: "#A8A9AD", orange: "#D2691E", yellow: "#DAA520",
  khaki: "#BDB76B", charcoal: "#36454F", maroon: "#800000", coral: "#FF7F50",
  teal: "#008080", indigo: "#4B0082",
};

function extractColors(items: string[]): string[] {
  const colors: string[] = [];
  const text = items.join(" ").toLowerCase();
  for (const [name, hex] of Object.entries(COLOR_MAP)) {
    if (text.includes(name)) colors.push(hex);
  }
  return colors.length > 0 ? colors : ["#1a1a1a", "#F5F5F0"];
}

// Simple color compatibility heuristic
function scoreColorCompatibility(colors: string[]): number {
  if (colors.length <= 1) return 85;
  // Neutrals always work
  const neutrals = ["#1a1a1a", "#F5F5F0", "#8B8B8B", "#D4C5A9", "#FFFDD0", "#36454F"];
  const neutralCount = colors.filter(c => neutrals.includes(c)).length;
  const ratio = neutralCount / colors.length;
  // More neutrals = safer palette
  const base = 60 + ratio * 30;
  // Fewer total colors = more cohesive
  const penalty = Math.max(0, (colors.length - 4) * 5);
  return Math.min(98, Math.round(base + Math.random() * 10 - penalty));
}

// Occasion keywords
const OCCASION_KEYWORDS: Record<string, string[]> = {
  "Business / Office": ["blazer", "suit", "dress shirt", "oxford", "loafer", "tie", "slacks", "pencil skirt", "briefcase"],
  "Formal / Evening": ["gown", "tuxedo", "silk", "satin", "sequin", "velvet", "clutch", "heels", "bow tie", "cufflinks"],
  "Casual Outing": ["jeans", "t-shirt", "tee", "sneakers", "hoodie", "denim", "shorts", "sandals", "cap"],
  "Smart Casual": ["chinos", "polo", "button-down", "cardigan", "derby", "loafer", "belt"],
  "Athleisure / Sport": ["jogger", "track", "athletic", "legging", "running", "gym", "sports"],
};

function predictOccasion(items: string[]): { primary: string; alternatives: string[]; reasoning: string } {
  const text = items.join(" ").toLowerCase();
  const scores: Record<string, number> = {};

  for (const [occasion, keywords] of Object.entries(OCCASION_KEYWORDS)) {
    scores[occasion] = keywords.filter(kw => text.includes(kw)).length;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[1] > 0 ? sorted[0][0] : "Smart Casual";
  const alternatives = sorted.slice(1, 3).filter(s => s[1] > 0).map(s => s[0]);

  const reasoning = primary === "Smart Casual" && sorted[0]?.[1] === 0
    ? "Based on the described items, this outfit leans toward a versatile smart casual look suitable for multiple settings."
    : `Key items in your outfit strongly suggest a ${primary.toLowerCase()} setting. The combination of described pieces creates a cohesive look for this occasion.`;

  return { primary, alternatives: alternatives.length > 0 ? alternatives : ["Versatile"], reasoning };
}

function generateSuggestions(items: string[], colors: string[]): string[] {
  const suggestions: string[] = [];
  const text = items.join(" ").toLowerCase();

  if (colors.length > 4) {
    suggestions.push("Consider reducing the number of distinct colors. A 3-color palette tends to look more cohesive.");
  }
  if (!text.includes("shoe") && !text.includes("boot") && !text.includes("sneaker") && !text.includes("heel") && !text.includes("loafer") && !text.includes("sandal")) {
    suggestions.push("Don't forget footwear — shoes can make or break an outfit's overall impression.");
  }
  if (items.length < 3) {
    suggestions.push("Add more items for a complete outfit analysis. Consider accessories like watches, bags, or scarves.");
  }
  if (items.length >= 3 && suggestions.length === 0) {
    suggestions.push("Try experimenting with a statement accessory to elevate this look.");
  }

  return suggestions;
}

function generateStyleAnalysis(items: string[]): string {
  const text = items.join(" ").toLowerCase();
  const hasLayering = items.length >= 4;
  const hasFormal = ["blazer", "suit", "gown", "silk"].some(w => text.includes(w));
  const hasCasual = ["jeans", "t-shirt", "sneaker", "hoodie"].some(w => text.includes(w));

  if (hasFormal && hasCasual) {
    return "This outfit blends formal and casual elements — a modern approach to dressing that works well when the proportions are balanced. The contrast between structured and relaxed pieces creates an intentional, fashion-forward look.";
  }
  if (hasFormal) {
    return "A refined, polished ensemble. The formal elements work together to create a sophisticated silhouette. Pay attention to fit — in formal wear, tailoring makes all the difference.";
  }
  if (hasLayering) {
    return "Great use of layering. Multiple pieces add visual depth and give you flexibility to adapt to temperature changes. The key is ensuring each layer adds to the overall aesthetic rather than competing for attention.";
  }
  return "A clean, straightforward combination. The simplicity here is a strength — focus on fit and fabric quality to elevate this look from basic to intentional.";
}

export function analyzeOutfit(items: string[]): AnalysisResult {
  const colors = extractColors(items);
  const colorScore = scoreColorCompatibility(colors);
  const occasion = predictOccasion(items);
  const suggestions = generateSuggestions(items, colors);
  const styleAnalysis = generateStyleAnalysis(items);

  const overallScore = Math.round(colorScore * 0.6 + (occasion.alternatives.length > 0 ? 80 : 70) * 0.4);

  return {
    overallScore: Math.min(98, overallScore),
    colorCompatibility: {
      score: colorScore,
      analysis: `Detected ${colors.length} distinct color${colors.length > 1 ? "s" : ""} in your outfit. ${
        colorScore >= 75
          ? "The color palette shows strong harmony with good contrast balance."
          : "Consider adjusting some color choices for better visual cohesion."
      }`,
      palette: colors.slice(0, 6),
    },
    occasionPrediction: occasion,
    suggestions,
    styleAnalysis,
  };
}
