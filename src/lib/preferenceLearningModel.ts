/**
 * User Preference Learning Model
 * 
 * A client-side model that learns user style preferences from interactions.
 * Uses weighted feature vectors stored in localStorage to adapt recommendations
 * over time — no API calls, fully on-device.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StylePreferences {
  colorPreferences: Record<string, number>;   // color name → affinity score
  categoryPreferences: Record<string, number>; // category → affinity
  styleTraits: Record<string, number>;        // trait → weight
  interactionCount: number;
  lastUpdated: string;
}

export interface PreferencePrediction {
  topColors: { color: string; score: number }[];
  preferredStyles: { trait: string; score: number }[];
  personalityType: string;
  adaptationLevel: string;
  totalInteractions: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "fashn_match_user_preferences";
const LEARNING_RATE = 0.15;
const DECAY_RATE = 0.98;

const STYLE_TRAITS = [
  "minimalist", "bold", "classic", "trendy", "casual", "formal",
  "bohemian", "sporty", "elegant", "edgy", "romantic", "preppy",
];

const COLOR_FAMILIES: Record<string, string[]> = {
  warm: ["red", "orange", "yellow", "coral", "rust", "mustard", "gold", "peach", "burgundy", "wine", "maroon"],
  cool: ["blue", "navy", "teal", "purple", "lavender", "mint", "plum"],
  neutral: ["black", "white", "grey", "gray", "beige", "cream", "tan", "brown", "khaki", "charcoal", "ivory", "camel"],
  earth: ["olive", "sage", "brown", "tan", "rust", "khaki", "camel", "denim"],
};

// ─── Storage ─────────────────────────────────────────────────────────────────

function loadPreferences(): StylePreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    colorPreferences: {},
    categoryPreferences: {},
    styleTraits: Object.fromEntries(STYLE_TRAITS.map(t => [t, 0.5])),
    interactionCount: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function savePreferences(prefs: StylePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

// ─── Learning Functions ──────────────────────────────────────────────────────

function inferStyleTraits(itemName: string, color: string): string[] {
  const name = (itemName + " " + color).toLowerCase();
  const traits: string[] = [];

  if (name.match(/blazer|suit|oxford|loafer|tie/)) traits.push("formal", "classic");
  if (name.match(/sneaker|hoodie|jogger|cap|tracksuit/)) traits.push("casual", "sporty");
  if (name.match(/leather|chain|stud|boot/)) traits.push("edgy", "bold");
  if (name.match(/floral|lace|silk|satin/)) traits.push("romantic", "elegant");
  if (name.match(/denim|plaid|flannel|chino/)) traits.push("casual", "classic");
  if (name.match(/sequin|metallic|neon|bright/)) traits.push("bold", "trendy");
  if (name.match(/linen|cotton|basic|plain|simple/)) traits.push("minimalist", "casual");
  if (name.match(/boho|fringe|macrame|tie-dye/)) traits.push("bohemian", "trendy");
  if (name.match(/polo|vest|cardigan|loafer/)) traits.push("preppy", "classic");

  if (traits.length === 0) traits.push("casual");
  return traits;
}

function getColorFamily(color: string): string {
  const lower = color.toLowerCase();
  for (const [family, colors] of Object.entries(COLOR_FAMILIES)) {
    if (colors.some(c => lower.includes(c))) return family;
  }
  return "neutral";
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Record a user interaction (liked/selected an item).
 * The model updates its internal weights accordingly.
 */
export function recordInteraction(
  itemName: string,
  color: string,
  category: string,
  liked: boolean = true,
): void {
  const prefs = loadPreferences();
  const signal = liked ? 1 : -0.5;

  // Update color preferences
  const colorKey = color.toLowerCase().trim();
  prefs.colorPreferences[colorKey] = (prefs.colorPreferences[colorKey] || 0.5) + LEARNING_RATE * signal;

  // Update color family
  const family = getColorFamily(color);
  prefs.colorPreferences[`_family_${family}`] = (prefs.colorPreferences[`_family_${family}`] || 0.5) + LEARNING_RATE * 0.5 * signal;

  // Update category preferences
  prefs.categoryPreferences[category] = (prefs.categoryPreferences[category] || 0.5) + LEARNING_RATE * signal;

  // Infer and update style traits
  const traits = inferStyleTraits(itemName, color);
  for (const trait of traits) {
    prefs.styleTraits[trait] = (prefs.styleTraits[trait] || 0.5) + LEARNING_RATE * signal;
  }

  // Apply decay to all values (prevent unbounded growth)
  for (const key of Object.keys(prefs.colorPreferences)) {
    prefs.colorPreferences[key] = Math.max(0, Math.min(1, prefs.colorPreferences[key] * DECAY_RATE));
  }
  for (const key of Object.keys(prefs.categoryPreferences)) {
    prefs.categoryPreferences[key] = Math.max(0, Math.min(1, prefs.categoryPreferences[key] * DECAY_RATE));
  }
  for (const key of Object.keys(prefs.styleTraits)) {
    prefs.styleTraits[key] = Math.max(0, Math.min(1, prefs.styleTraits[key] * DECAY_RATE));
  }

  prefs.interactionCount++;
  prefs.lastUpdated = new Date().toISOString();
  savePreferences(prefs);
}

/**
 * Get current user preference prediction.
 */
export function getPredictions(): PreferencePrediction {
  const prefs = loadPreferences();

  // Top colors (exclude family keys)
  const colorEntries = Object.entries(prefs.colorPreferences)
    .filter(([k]) => !k.startsWith("_family_"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color, score]) => ({ color, score: Math.round(score * 100) }));

  // Preferred styles
  const styleEntries = Object.entries(prefs.styleTraits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([trait, score]) => ({ trait: trait.charAt(0).toUpperCase() + trait.slice(1), score: Math.round(score * 100) }));

  // Personality type based on dominant traits
  const topTrait = styleEntries[0]?.trait.toLowerCase() || "casual";
  const personalityMap: Record<string, string> = {
    minimalist: "Modern Minimalist",
    bold: "Bold Trendsetter",
    classic: "Timeless Classic",
    trendy: "Fashion Forward",
    casual: "Relaxed & Easy",
    formal: "Polished Professional",
    bohemian: "Free Spirit",
    sporty: "Active & Dynamic",
    elegant: "Refined Elegance",
    edgy: "Urban Edge",
    romantic: "Soft Romantic",
    preppy: "Smart Casual",
  };
  const personalityType = personalityMap[topTrait] || "Eclectic Explorer";

  // Adaptation level
  let adaptationLevel = "New";
  if (prefs.interactionCount >= 20) adaptationLevel = "Highly Adapted";
  else if (prefs.interactionCount >= 10) adaptationLevel = "Well Adapted";
  else if (prefs.interactionCount >= 5) adaptationLevel = "Learning";
  else if (prefs.interactionCount >= 1) adaptationLevel = "Getting Started";

  return {
    topColors: colorEntries,
    preferredStyles: styleEntries,
    personalityType,
    adaptationLevel,
    totalInteractions: prefs.interactionCount,
  };
}

/**
 * Score how well an item matches learned preferences (0-100).
 */
export function scoreItemForUser(itemName: string, color: string, category: string): number {
  const prefs = loadPreferences();
  if (prefs.interactionCount === 0) return 50; // No data yet

  let score = 50;

  // Color affinity
  const colorKey = color.toLowerCase().trim();
  if (prefs.colorPreferences[colorKey]) {
    score += (prefs.colorPreferences[colorKey] - 0.5) * 40;
  }

  // Color family affinity
  const family = getColorFamily(color);
  const familyKey = `_family_${family}`;
  if (prefs.colorPreferences[familyKey]) {
    score += (prefs.colorPreferences[familyKey] - 0.5) * 20;
  }

  // Category affinity
  if (prefs.categoryPreferences[category]) {
    score += (prefs.categoryPreferences[category] - 0.5) * 20;
  }

  // Style trait affinity
  const traits = inferStyleTraits(itemName, color);
  for (const trait of traits) {
    if (prefs.styleTraits[trait]) {
      score += (prefs.styleTraits[trait] - 0.5) * 15;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Reset all learned preferences.
 */
export function resetPreferences(): void {
  localStorage.removeItem(STORAGE_KEY);
}
