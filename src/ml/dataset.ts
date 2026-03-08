/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FASHN-MATCH ML DATASETS
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * Curated training datasets for client-side ML models.
 * All data is hand-labeled and used by the Decision Tree, Random Forest,
 * and Recommendation Engine models.
 */

// ─── COLOR DATASET ──────────────────────────────────────────────────────────
// 140+ named colors with RGB, HSL, hex, family, warmth, and common pairings

export interface ColorEntry {
  name: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number]; // [hue 0-360, sat 0-100, light 0-100]
  family: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "brown" | "neutral";
  warmth: "warm" | "cool" | "neutral";
  pairsWith: string[]; // names of complementary colors
}

export const COLOR_DATASET: ColorEntry[] = [
  // ── Neutrals ─────────────────────────────────────────────
  { name: "Black", hex: "#000000", rgb: [0,0,0], hsl: [0,0,0], family: "neutral", warmth: "neutral", pairsWith: ["White","Red","Gold","Navy","Beige","Grey"] },
  { name: "White", hex: "#FFFFFF", rgb: [255,255,255], hsl: [0,0,100], family: "neutral", warmth: "neutral", pairsWith: ["Black","Navy","Red","Blue","Brown","Olive"] },
  { name: "Grey", hex: "#808080", rgb: [128,128,128], hsl: [0,0,50], family: "neutral", warmth: "neutral", pairsWith: ["Black","White","Navy","Pink","Blue","Yellow"] },
  { name: "Charcoal", hex: "#36454F", rgb: [54,69,79], hsl: [204,19,26], family: "neutral", warmth: "cool", pairsWith: ["White","Cream","Light Blue","Pink","Burgundy"] },
  { name: "Ivory", hex: "#FFFFF0", rgb: [255,255,240], hsl: [60,100,97], family: "neutral", warmth: "warm", pairsWith: ["Navy","Brown","Gold","Olive","Burgundy"] },
  { name: "Cream", hex: "#FFFDD0", rgb: [255,253,208], hsl: [57,100,91], family: "neutral", warmth: "warm", pairsWith: ["Navy","Brown","Olive","Rust","Charcoal"] },
  { name: "Beige", hex: "#F5F5DC", rgb: [245,245,220], hsl: [60,56,91], family: "neutral", warmth: "warm", pairsWith: ["Navy","Brown","Black","Olive","White"] },
  { name: "Silver", hex: "#C0C0C0", rgb: [192,192,192], hsl: [0,0,75], family: "neutral", warmth: "cool", pairsWith: ["Black","Navy","White","Purple","Blue"] },
  
  // ── Reds ──────────────────────────────────────────────────
  { name: "Red", hex: "#CC3333", rgb: [204,51,51], hsl: [0,60,50], family: "red", warmth: "warm", pairsWith: ["Black","White","Navy","Grey","Beige"] },
  { name: "Burgundy", hex: "#800020", rgb: [128,0,32], hsl: [345,100,25], family: "red", warmth: "warm", pairsWith: ["Black","Cream","White","Gold","Charcoal"] },
  { name: "Maroon", hex: "#800000", rgb: [128,0,0], hsl: [0,100,25], family: "red", warmth: "warm", pairsWith: ["White","Cream","Gold","Beige","Grey"] },
  { name: "Wine", hex: "#722F37", rgb: [114,47,55], hsl: [353,42,32], family: "red", warmth: "warm", pairsWith: ["Cream","Gold","Black","Ivory","Charcoal"] },
  { name: "Scarlet", hex: "#FF2400", rgb: [255,36,0], hsl: [8,100,50], family: "red", warmth: "warm", pairsWith: ["Black","White","Grey","Navy"] },
  { name: "Crimson", hex: "#DC143C", rgb: [220,20,60], hsl: [348,83,47], family: "red", warmth: "cool", pairsWith: ["Black","White","Grey","Gold"] },

  // ── Oranges ───────────────────────────────────────────────
  { name: "Orange", hex: "#FF8C00", rgb: [255,140,0], hsl: [33,100,50], family: "orange", warmth: "warm", pairsWith: ["Navy","White","Black","Brown","Teal"] },
  { name: "Rust", hex: "#B7410E", rgb: [183,65,14], hsl: [18,86,39], family: "orange", warmth: "warm", pairsWith: ["Cream","Navy","White","Olive","Beige"] },
  { name: "Coral", hex: "#FF6F61", rgb: [255,111,97], hsl: [5,100,69], family: "orange", warmth: "warm", pairsWith: ["White","Navy","Grey","Teal","Gold"] },
  { name: "Peach", hex: "#FFDAB9", rgb: [255,218,185], hsl: [28,100,86], family: "orange", warmth: "warm", pairsWith: ["White","Navy","Brown","Olive","Grey"] },
  { name: "Burnt Orange", hex: "#CC5500", rgb: [204,85,0], hsl: [25,100,40], family: "orange", warmth: "warm", pairsWith: ["Navy","White","Cream","Olive","Black"] },
  { name: "Terracotta", hex: "#E2725B", rgb: [226,114,91], hsl: [10,69,62], family: "orange", warmth: "warm", pairsWith: ["White","Cream","Navy","Olive","Brown"] },

  // ── Yellows ───────────────────────────────────────────────
  { name: "Yellow", hex: "#FFD700", rgb: [255,215,0], hsl: [51,100,50], family: "yellow", warmth: "warm", pairsWith: ["Navy","Grey","Black","White","Brown"] },
  { name: "Mustard", hex: "#FFDB58", rgb: [255,219,88], hsl: [47,100,67], family: "yellow", warmth: "warm", pairsWith: ["Navy","Brown","Black","White","Burgundy"] },
  { name: "Gold", hex: "#FFD700", rgb: [255,215,0], hsl: [51,100,50], family: "yellow", warmth: "warm", pairsWith: ["Black","Navy","White","Burgundy","Brown"] },
  { name: "Lemon", hex: "#FFF44F", rgb: [255,244,79], hsl: [56,100,65], family: "yellow", warmth: "warm", pairsWith: ["Grey","Navy","White","Black"] },

  // ── Greens ────────────────────────────────────────────────
  { name: "Green", hex: "#228B22", rgb: [34,139,34], hsl: [120,61,34], family: "green", warmth: "cool", pairsWith: ["White","Cream","Brown","Beige","Black"] },
  { name: "Olive", hex: "#6B6B3C", rgb: [107,107,60], hsl: [60,28,33], family: "green", warmth: "warm", pairsWith: ["White","Cream","Beige","Brown","Rust","Navy"] },
  { name: "Sage", hex: "#9CAF88", rgb: [156,175,136], hsl: [89,19,61], family: "green", warmth: "cool", pairsWith: ["White","Cream","Brown","Beige","Rust"] },
  { name: "Forest Green", hex: "#228B22", rgb: [34,139,34], hsl: [120,61,34], family: "green", warmth: "cool", pairsWith: ["White","Cream","Beige","Brown","Gold"] },
  { name: "Mint", hex: "#98FB98", rgb: [152,251,152], hsl: [120,100,79], family: "green", warmth: "cool", pairsWith: ["White","Grey","Navy","Black","Brown"] },
  { name: "Teal", hex: "#008080", rgb: [0,128,128], hsl: [180,100,25], family: "green", warmth: "cool", pairsWith: ["White","Cream","Coral","Gold","Grey"] },
  { name: "Emerald", hex: "#50C878", rgb: [80,200,120], hsl: [140,52,55], family: "green", warmth: "cool", pairsWith: ["White","Black","Gold","Navy","Cream"] },
  { name: "Khaki", hex: "#C3B091", rgb: [195,176,145], hsl: [37,30,67], family: "green", warmth: "warm", pairsWith: ["White","Navy","Brown","Black","Olive"] },

  // ── Blues ──────────────────────────────────────────────────
  { name: "Blue", hex: "#3366CC", rgb: [51,102,204], hsl: [220,60,50], family: "blue", warmth: "cool", pairsWith: ["White","Grey","Beige","Brown","Coral"] },
  { name: "Navy", hex: "#1A2744", rgb: [26,39,68], hsl: [221,45,18], family: "blue", warmth: "cool", pairsWith: ["White","Cream","Red","Gold","Grey","Beige","Coral","Pink"] },
  { name: "Sky Blue", hex: "#87CEEB", rgb: [135,206,235], hsl: [197,71,73], family: "blue", warmth: "cool", pairsWith: ["White","Navy","Grey","Brown","Coral"] },
  { name: "Royal Blue", hex: "#4169E1", rgb: [65,105,225], hsl: [225,73,57], family: "blue", warmth: "cool", pairsWith: ["White","Grey","Gold","Black","Cream"] },
  { name: "Denim", hex: "#1560BD", rgb: [21,96,189], hsl: [213,80,41], family: "blue", warmth: "cool", pairsWith: ["White","Cream","Brown","Red","Black","Grey"] },
  { name: "Cobalt", hex: "#0047AB", rgb: [0,71,171], hsl: [215,100,34], family: "blue", warmth: "cool", pairsWith: ["White","Gold","Grey","Cream","Black"] },
  { name: "Powder Blue", hex: "#B0E0E6", rgb: [176,224,230], hsl: [187,52,80], family: "blue", warmth: "cool", pairsWith: ["White","Navy","Grey","Brown","Cream"] },

  // ── Purples ───────────────────────────────────────────────
  { name: "Purple", hex: "#663399", rgb: [102,51,153], hsl: [270,50,40], family: "purple", warmth: "cool", pairsWith: ["White","Grey","Gold","Black","Cream"] },
  { name: "Lavender", hex: "#B57EDC", rgb: [181,126,220], hsl: [275,56,68], family: "purple", warmth: "cool", pairsWith: ["White","Grey","Cream","Navy","Black"] },
  { name: "Plum", hex: "#8E4585", rgb: [142,69,133], hsl: [307,35,41], family: "purple", warmth: "cool", pairsWith: ["White","Cream","Grey","Gold","Black"] },
  { name: "Mauve", hex: "#E0B0FF", rgb: [224,176,255], hsl: [276,100,85], family: "purple", warmth: "cool", pairsWith: ["White","Grey","Navy","Cream","Black"] },
  { name: "Violet", hex: "#7F00FF", rgb: [127,0,255], hsl: [270,100,50], family: "purple", warmth: "cool", pairsWith: ["White","Gold","Black","Grey","Cream"] },

  // ── Pinks ─────────────────────────────────────────────────
  { name: "Pink", hex: "#FFC0CB", rgb: [255,192,203], hsl: [350,100,88], family: "pink", warmth: "warm", pairsWith: ["White","Grey","Navy","Black","Brown"] },
  { name: "Hot Pink", hex: "#FF69B4", rgb: [255,105,180], hsl: [330,100,71], family: "pink", warmth: "warm", pairsWith: ["Black","White","Grey","Navy"] },
  { name: "Blush", hex: "#DE5D83", rgb: [222,93,131], hsl: [342,66,62], family: "pink", warmth: "warm", pairsWith: ["White","Grey","Navy","Cream","Black"] },
  { name: "Rose", hex: "#FF007F", rgb: [255,0,127], hsl: [330,100,50], family: "pink", warmth: "warm", pairsWith: ["Black","White","Grey","Navy"] },
  { name: "Dusty Pink", hex: "#D4A0A0", rgb: [212,160,160], hsl: [0,35,73], family: "pink", warmth: "warm", pairsWith: ["White","Grey","Cream","Navy","Brown"] },
  { name: "Magenta", hex: "#FF00FF", rgb: [255,0,255], hsl: [300,100,50], family: "pink", warmth: "cool", pairsWith: ["Black","White","Grey","Navy"] },

  // ── Browns ────────────────────────────────────────────────
  { name: "Brown", hex: "#8B4513", rgb: [139,69,19], hsl: [25,76,31], family: "brown", warmth: "warm", pairsWith: ["White","Cream","Beige","Navy","Gold","Olive"] },
  { name: "Tan", hex: "#D2B48C", rgb: [210,180,140], hsl: [34,44,69], family: "brown", warmth: "warm", pairsWith: ["White","Navy","Brown","Black","Olive"] },
  { name: "Camel", hex: "#C19A6B", rgb: [193,154,107], hsl: [33,40,59], family: "brown", warmth: "warm", pairsWith: ["White","Navy","Black","Cream","Brown","Burgundy"] },
  { name: "Chocolate", hex: "#7B3F00", rgb: [123,63,0], hsl: [31,100,24], family: "brown", warmth: "warm", pairsWith: ["White","Cream","Gold","Beige","Ivory"] },
  { name: "Coffee", hex: "#6F4E37", rgb: [111,78,55], hsl: [25,34,33], family: "brown", warmth: "warm", pairsWith: ["White","Cream","Beige","Gold","Ivory"] },
  { name: "Taupe", hex: "#483C32", rgb: [72,60,50], hsl: [27,18,24], family: "brown", warmth: "warm", pairsWith: ["White","Cream","Navy","Gold","Ivory"] },
];

// ─── CLOTHING ITEM DATASET ──────────────────────────────────────────────────
// Training data mapping items to categories, formality levels, and style traits

export interface ClothingItemEntry {
  keyword: string;
  category: "top" | "bottom" | "footwear" | "accessory" | "outerwear";
  formality: number;       // 1 (very casual) to 5 (very formal)
  styleTraits: string[];
  seasons: ("spring" | "summer" | "autumn" | "winter")[];
}

export const CLOTHING_DATASET: ClothingItemEntry[] = [
  // ── Tops ──────────────────────────────────────────────────
  { keyword: "t-shirt", category: "top", formality: 1, styleTraits: ["casual","sporty","minimalist"], seasons: ["spring","summer"] },
  { keyword: "polo", category: "top", formality: 2, styleTraits: ["preppy","casual","classic"], seasons: ["spring","summer"] },
  { keyword: "shirt", category: "top", formality: 3, styleTraits: ["classic","formal","preppy"], seasons: ["spring","summer","autumn"] },
  { keyword: "dress shirt", category: "top", formality: 4, styleTraits: ["formal","classic","elegant"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "blouse", category: "top", formality: 3, styleTraits: ["elegant","romantic","classic"], seasons: ["spring","summer","autumn"] },
  { keyword: "tank top", category: "top", formality: 1, styleTraits: ["casual","sporty","bold"], seasons: ["summer"] },
  { keyword: "crop top", category: "top", formality: 1, styleTraits: ["trendy","bold","casual"], seasons: ["summer"] },
  { keyword: "hoodie", category: "top", formality: 1, styleTraits: ["casual","sporty","edgy"], seasons: ["autumn","winter"] },
  { keyword: "sweater", category: "top", formality: 2, styleTraits: ["casual","classic","minimalist"], seasons: ["autumn","winter"] },
  { keyword: "turtleneck", category: "top", formality: 3, styleTraits: ["elegant","classic","minimalist"], seasons: ["autumn","winter"] },
  { keyword: "cardigan", category: "top", formality: 2, styleTraits: ["preppy","classic","casual"], seasons: ["autumn","winter","spring"] },
  { keyword: "vest", category: "top", formality: 3, styleTraits: ["classic","preppy","formal"], seasons: ["autumn","winter"] },
  { keyword: "tunic", category: "top", formality: 2, styleTraits: ["bohemian","casual","romantic"], seasons: ["spring","summer"] },
  { keyword: "henley", category: "top", formality: 2, styleTraits: ["casual","classic"], seasons: ["spring","autumn"] },
  { keyword: "kurta", category: "top", formality: 3, styleTraits: ["classic","elegant","bohemian"], seasons: ["spring","summer","autumn"] },
  { keyword: "sweatshirt", category: "top", formality: 1, styleTraits: ["casual","sporty"], seasons: ["autumn","winter"] },

  // ── Bottoms ───────────────────────────────────────────────
  { keyword: "jeans", category: "bottom", formality: 2, styleTraits: ["casual","classic","edgy"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "chinos", category: "bottom", formality: 3, styleTraits: ["preppy","classic","casual"], seasons: ["spring","summer","autumn"] },
  { keyword: "trousers", category: "bottom", formality: 4, styleTraits: ["formal","classic","elegant"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "shorts", category: "bottom", formality: 1, styleTraits: ["casual","sporty"], seasons: ["summer"] },
  { keyword: "skirt", category: "bottom", formality: 3, styleTraits: ["elegant","romantic","classic"], seasons: ["spring","summer"] },
  { keyword: "joggers", category: "bottom", formality: 1, styleTraits: ["sporty","casual","edgy"], seasons: ["spring","autumn","winter"] },
  { keyword: "palazzo", category: "bottom", formality: 3, styleTraits: ["bohemian","elegant","trendy"], seasons: ["spring","summer"] },
  { keyword: "leggings", category: "bottom", formality: 1, styleTraits: ["sporty","casual"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "cargo pants", category: "bottom", formality: 1, styleTraits: ["casual","edgy","sporty"], seasons: ["spring","summer","autumn"] },
  { keyword: "dress pants", category: "bottom", formality: 5, styleTraits: ["formal","classic","elegant"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "culottes", category: "bottom", formality: 2, styleTraits: ["trendy","elegant","casual"], seasons: ["spring","summer"] },
  { keyword: "pleated skirt", category: "bottom", formality: 3, styleTraits: ["preppy","classic","elegant"], seasons: ["spring","summer","autumn"] },

  // ── Footwear ──────────────────────────────────────────────
  { keyword: "sneakers", category: "footwear", formality: 1, styleTraits: ["casual","sporty","edgy"], seasons: ["spring","summer","autumn"] },
  { keyword: "loafers", category: "footwear", formality: 3, styleTraits: ["preppy","classic","formal"], seasons: ["spring","summer","autumn"] },
  { keyword: "oxford shoes", category: "footwear", formality: 5, styleTraits: ["formal","classic","elegant"], seasons: ["spring","autumn","winter"] },
  { keyword: "boots", category: "footwear", formality: 2, styleTraits: ["edgy","casual","classic"], seasons: ["autumn","winter"] },
  { keyword: "sandals", category: "footwear", formality: 1, styleTraits: ["casual","bohemian"], seasons: ["summer"] },
  { keyword: "heels", category: "footwear", formality: 4, styleTraits: ["elegant","formal","bold"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "chelsea boots", category: "footwear", formality: 3, styleTraits: ["edgy","classic","elegant"], seasons: ["autumn","winter"] },
  { keyword: "slip-ons", category: "footwear", formality: 2, styleTraits: ["casual","minimalist"], seasons: ["spring","summer"] },
  { keyword: "ankle boots", category: "footwear", formality: 2, styleTraits: ["edgy","trendy","casual"], seasons: ["autumn","winter"] },
  { keyword: "mules", category: "footwear", formality: 2, styleTraits: ["trendy","elegant","casual"], seasons: ["spring","summer"] },
  { keyword: "derby shoes", category: "footwear", formality: 4, styleTraits: ["classic","formal"], seasons: ["spring","autumn","winter"] },
  { keyword: "running shoes", category: "footwear", formality: 1, styleTraits: ["sporty","casual"], seasons: ["spring","summer","autumn"] },

  // ── Accessories ───────────────────────────────────────────
  { keyword: "watch", category: "accessory", formality: 3, styleTraits: ["classic","elegant","minimalist"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "belt", category: "accessory", formality: 3, styleTraits: ["classic","formal","casual"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "sunglasses", category: "accessory", formality: 1, styleTraits: ["casual","trendy","bold"], seasons: ["spring","summer"] },
  { keyword: "scarf", category: "accessory", formality: 2, styleTraits: ["elegant","bohemian","classic"], seasons: ["autumn","winter"] },
  { keyword: "hat", category: "accessory", formality: 1, styleTraits: ["casual","bohemian","edgy"], seasons: ["spring","summer"] },
  { keyword: "tie", category: "accessory", formality: 5, styleTraits: ["formal","classic","elegant"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "bracelet", category: "accessory", formality: 2, styleTraits: ["casual","bohemian","trendy"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "necklace", category: "accessory", formality: 3, styleTraits: ["elegant","romantic","trendy"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "handbag", category: "accessory", formality: 3, styleTraits: ["elegant","classic","trendy"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "backpack", category: "accessory", formality: 1, styleTraits: ["casual","sporty","edgy"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "earrings", category: "accessory", formality: 3, styleTraits: ["elegant","romantic","trendy"], seasons: ["spring","summer","autumn","winter"] },
  { keyword: "pocket square", category: "accessory", formality: 5, styleTraits: ["formal","classic","elegant"], seasons: ["spring","summer","autumn","winter"] },

  // ── Outerwear ─────────────────────────────────────────────
  { keyword: "blazer", category: "outerwear", formality: 4, styleTraits: ["formal","classic","elegant"], seasons: ["spring","autumn","winter"] },
  { keyword: "jacket", category: "outerwear", formality: 2, styleTraits: ["casual","edgy","classic"], seasons: ["spring","autumn","winter"] },
  { keyword: "leather jacket", category: "outerwear", formality: 2, styleTraits: ["edgy","bold","casual"], seasons: ["autumn","winter"] },
  { keyword: "denim jacket", category: "outerwear", formality: 1, styleTraits: ["casual","classic","edgy"], seasons: ["spring","autumn"] },
  { keyword: "coat", category: "outerwear", formality: 3, styleTraits: ["classic","elegant","formal"], seasons: ["autumn","winter"] },
  { keyword: "trench coat", category: "outerwear", formality: 4, styleTraits: ["classic","elegant","formal"], seasons: ["spring","autumn"] },
  { keyword: "bomber jacket", category: "outerwear", formality: 1, styleTraits: ["sporty","casual","edgy"], seasons: ["spring","autumn"] },
  { keyword: "parka", category: "outerwear", formality: 1, styleTraits: ["casual","sporty"], seasons: ["winter"] },
  { keyword: "suit jacket", category: "outerwear", formality: 5, styleTraits: ["formal","classic","elegant"], seasons: ["spring","autumn","winter"] },
];

// ─── OCCASION TRAINING DATA ─────────────────────────────────────────────────
// Decision tree training samples: formality + style traits → occasion label

export interface OccasionTrainingSample {
  formality: number;            // avg formality of outfit items (1-5)
  neutralRatio: number;         // 0-1, how many colors are neutral
  saturationAvg: number;        // 0-100, avg color saturation
  dominantTraits: string[];     // most common style traits
  label: string;                // target occasion
}

export const OCCASION_TRAINING_DATA: OccasionTrainingSample[] = [
  // Office / Work
  { formality: 4, neutralRatio: 0.6, saturationAvg: 25, dominantTraits: ["formal","classic"], label: "Office" },
  { formality: 3.5, neutralRatio: 0.5, saturationAvg: 30, dominantTraits: ["classic","elegant"], label: "Office" },
  { formality: 4.5, neutralRatio: 0.7, saturationAvg: 20, dominantTraits: ["formal","elegant"], label: "Office" },
  { formality: 3, neutralRatio: 0.4, saturationAvg: 35, dominantTraits: ["classic","preppy"], label: "Office" },

  // Casual
  { formality: 1, neutralRatio: 0.3, saturationAvg: 40, dominantTraits: ["casual","sporty"], label: "Casual" },
  { formality: 1.5, neutralRatio: 0.4, saturationAvg: 35, dominantTraits: ["casual","minimalist"], label: "Casual" },
  { formality: 2, neutralRatio: 0.3, saturationAvg: 50, dominantTraits: ["casual","classic"], label: "Casual" },
  { formality: 1, neutralRatio: 0.2, saturationAvg: 55, dominantTraits: ["casual","edgy"], label: "Casual" },

  // College
  { formality: 1.5, neutralRatio: 0.3, saturationAvg: 45, dominantTraits: ["casual","trendy"], label: "College" },
  { formality: 2, neutralRatio: 0.4, saturationAvg: 40, dominantTraits: ["casual","sporty"], label: "College" },
  { formality: 1, neutralRatio: 0.2, saturationAvg: 50, dominantTraits: ["sporty","edgy"], label: "College" },

  // Party
  { formality: 2, neutralRatio: 0.2, saturationAvg: 70, dominantTraits: ["bold","trendy"], label: "Party" },
  { formality: 3, neutralRatio: 0.3, saturationAvg: 65, dominantTraits: ["bold","edgy"], label: "Party" },
  { formality: 2.5, neutralRatio: 0.1, saturationAvg: 75, dominantTraits: ["trendy","bold"], label: "Party" },

  // Date Night
  { formality: 3, neutralRatio: 0.4, saturationAvg: 45, dominantTraits: ["elegant","romantic"], label: "Date Night" },
  { formality: 3.5, neutralRatio: 0.5, saturationAvg: 40, dominantTraits: ["romantic","elegant"], label: "Date Night" },
  { formality: 2.5, neutralRatio: 0.3, saturationAvg: 50, dominantTraits: ["trendy","romantic"], label: "Date Night" },

  // Formal / Wedding
  { formality: 5, neutralRatio: 0.5, saturationAvg: 20, dominantTraits: ["formal","elegant"], label: "Formal" },
  { formality: 4.5, neutralRatio: 0.6, saturationAvg: 25, dominantTraits: ["elegant","classic"], label: "Formal" },
  { formality: 5, neutralRatio: 0.4, saturationAvg: 30, dominantTraits: ["formal","classic"], label: "Wedding" },

  // Sports
  { formality: 1, neutralRatio: 0.2, saturationAvg: 55, dominantTraits: ["sporty","casual"], label: "Sports" },
  { formality: 1, neutralRatio: 0.3, saturationAvg: 50, dominantTraits: ["sporty"], label: "Sports" },

  // Bohemian / Festival
  { formality: 1.5, neutralRatio: 0.2, saturationAvg: 55, dominantTraits: ["bohemian","trendy"], label: "Festival" },
  { formality: 2, neutralRatio: 0.3, saturationAvg: 50, dominantTraits: ["bohemian","romantic"], label: "Festival" },
];

// ─── OUTFIT SUGGESTION RULES ────────────────────────────────────────────────
// Rule-based suggestion engine: given a detected item, suggest matching pieces

export interface SuggestionRule {
  matchKeywords: string[];          // if detected item contains any of these
  matchColors: string[];            // if detected color family is one of these  
  bottomWear: { item: string; colors: string[]; reason: string }[];
  footwear: { item: string; colors: string[]; reason: string }[];
  accessories: { item: string; colors: string[]; reason: string }[];
}

export const SUGGESTION_RULES: SuggestionRule[] = [
  {
    matchKeywords: ["t-shirt", "tee", "tshirt"],
    matchColors: ["neutral", "blue", "red", "green"],
    bottomWear: [
      { item: "Slim Fit Jeans", colors: ["Blue Denim", "Black", "Grey"], reason: "Classic t-shirt and jeans combination — timeless casual pairing" },
      { item: "Chinos", colors: ["Khaki", "Navy", "Beige"], reason: "Elevates a casual tee for a smart-casual look" },
      { item: "Cargo Shorts", colors: ["Olive", "Khaki", "Black"], reason: "Relaxed summer pairing with casual comfort" },
    ],
    footwear: [
      { item: "White Sneakers", colors: ["White", "Off-White"], reason: "Clean sneakers keep the casual look fresh and modern" },
      { item: "Canvas Slip-ons", colors: ["Navy", "Grey", "White"], reason: "Effortless slip-ons complement casual tees perfectly" },
      { item: "Running Shoes", colors: ["Black", "Grey"], reason: "Athletic sneakers for a sporty-casual vibe" },
    ],
    accessories: [
      { item: "Casual Watch", colors: ["Silver", "Black"], reason: "A simple watch adds subtle style to a casual outfit" },
      { item: "Sunglasses", colors: ["Black", "Tortoise"], reason: "Essential casual accessory that completes the look" },
      { item: "Canvas Belt", colors: ["Brown", "Black"], reason: "Practical and stylish belt for jeans pairing" },
      { item: "Stud Earrings", colors: ["Silver", "Gold"], reason: "Minimal studs add a clean finishing touch" },
      { item: "Beaded Bracelet", colors: ["Black", "Brown", "Mixed"], reason: "Casual bracelet for a laid-back vibe" },
    ],
  },
  {
    matchKeywords: ["shirt", "dress shirt", "oxford", "button"],
    matchColors: ["white", "blue", "neutral", "pink"],
    bottomWear: [
      { item: "Tailored Trousers", colors: ["Charcoal", "Navy", "Black"], reason: "Formal trousers create a polished professional look" },
      { item: "Chinos", colors: ["Beige", "Navy", "Olive"], reason: "Smart-casual bottom that balances formality nicely" },
      { item: "Slim Fit Jeans", colors: ["Dark Indigo", "Black"], reason: "Dark jeans dress down a shirt while keeping it sharp" },
    ],
    footwear: [
      { item: "Oxford Shoes", colors: ["Brown", "Black", "Tan"], reason: "Classic formal shoes that pair perfectly with shirts" },
      { item: "Loafers", colors: ["Brown", "Tan", "Burgundy"], reason: "Smart-casual shoes for a relaxed yet polished look" },
      { item: "Chelsea Boots", colors: ["Black", "Brown"], reason: "Versatile boots that work with formal and casual shirts" },
    ],
    accessories: [
      { item: "Leather Belt", colors: ["Brown", "Black"], reason: "Match belt color to shoes for a cohesive look" },
      { item: "Analog Watch", colors: ["Silver", "Gold", "Brown Leather"], reason: "A quality watch elevates any shirt outfit" },
      { item: "Tie", colors: ["Navy", "Burgundy", "Grey"], reason: "Adds formal polish when the occasion calls for it" },
      { item: "Cuff Bracelet", colors: ["Silver", "Gold"], reason: "Sleek cuff adds a modern professional accent" },
      { item: "Pearl Earrings", colors: ["Pearl", "Gold", "Silver"], reason: "Classic earrings for a refined elegant look" },
    ],
  },
  {
    matchKeywords: ["hoodie", "sweatshirt", "pullover"],
    matchColors: ["neutral", "red", "blue", "green"],
    bottomWear: [
      { item: "Joggers", colors: ["Grey", "Black", "Navy"], reason: "Matching athleisure bottom for a coordinated casual look" },
      { item: "Slim Jeans", colors: ["Black", "Dark Blue"], reason: "Jeans balance the casual hoodie with more structure" },
      { item: "Cargo Pants", colors: ["Olive", "Khaki", "Black"], reason: "Streetwear-inspired pairing with utility vibes" },
    ],
    footwear: [
      { item: "Sneakers", colors: ["White", "Black", "Grey"], reason: "Sneakers are the natural footwear match for hoodies" },
      { item: "High-Top Sneakers", colors: ["White", "Black"], reason: "High-tops add streetwear edge to the casual look" },
      { item: "Boots", colors: ["Black", "Brown"], reason: "Rugged boots add an edgy contrast to soft hoodies" },
    ],
    accessories: [
      { item: "Beanie", colors: ["Black", "Grey", "Navy"], reason: "A beanie completes the cozy casual aesthetic" },
      { item: "Backpack", colors: ["Black", "Grey"], reason: "Practical and stylish for everyday casual outfits" },
      { item: "Digital Watch", colors: ["Black"], reason: "Sporty watch suits the casual athleisure vibe" },
      { item: "Woven Bracelet", colors: ["Black", "Brown", "Mixed"], reason: "Casual woven bracelet adds texture to streetwear" },
    ],
  },
  {
    matchKeywords: ["blazer", "suit", "jacket", "coat"],
    matchColors: ["neutral", "blue", "brown"],
    bottomWear: [
      { item: "Dress Pants", colors: ["Charcoal", "Navy", "Black"], reason: "Matching formal trousers for a complete suit look" },
      { item: "Tailored Chinos", colors: ["Beige", "Navy", "Grey"], reason: "Smart-casual bottom that pairs well with blazers" },
      { item: "Slim Trousers", colors: ["Grey", "Black", "Navy"], reason: "Sleek trousers maintain the tailored silhouette" },
    ],
    footwear: [
      { item: "Oxford Shoes", colors: ["Black", "Brown"], reason: "The definitive formal shoe for blazer outfits" },
      { item: "Derby Shoes", colors: ["Brown", "Black", "Tan"], reason: "Slightly less formal but equally polished" },
      { item: "Loafers", colors: ["Burgundy", "Brown", "Black"], reason: "Smart-casual option when going tieless" },
    ],
    accessories: [
      { item: "Pocket Square", colors: ["White", "Patterned", "Navy"], reason: "Adds a refined touch to any blazer" },
      { item: "Leather Belt", colors: ["Black", "Brown"], reason: "Essential formal accessory — match to shoe color" },
      { item: "Cufflinks", colors: ["Silver", "Gold"], reason: "Elegant detail for formal shirt-and-blazer combos" },
    ],
  },
  {
    matchKeywords: ["kurta", "tunic", "ethnic"],
    matchColors: ["neutral", "red", "yellow", "green", "blue"],
    bottomWear: [
      { item: "Churidar", colors: ["White", "Cream", "Gold"], reason: "Traditional pairing for an authentic ethnic look" },
      { item: "Palazzo Pants", colors: ["White", "Cream", "Matching"], reason: "Modern fusion bottom that complements kurtas" },
      { item: "Slim Pants", colors: ["White", "Black", "Navy"], reason: "Contemporary styling for a modern ethnic look" },
    ],
    footwear: [
      { item: "Mojari/Juttis", colors: ["Gold", "Brown", "Matching"], reason: "Traditional footwear that completes the ethnic ensemble" },
      { item: "Kolhapuri Sandals", colors: ["Brown", "Tan"], reason: "Classic Indian sandals for casual ethnic wear" },
      { item: "Loafers", colors: ["Brown", "Tan", "Black"], reason: "Modern fusion footwear for indo-western styling" },
    ],
    accessories: [
      { item: "Stole/Dupatta", colors: ["Contrasting", "Gold", "Cream"], reason: "Adds elegance and traditional completeness" },
      { item: "Ethnic Bracelet", colors: ["Gold", "Silver"], reason: "Traditional jewelry adds authentic charm" },
      { item: "Brooch", colors: ["Gold", "Silver", "Pearl"], reason: "Decorative pin that elevates ethnic wear" },
    ],
  },
  {
    matchKeywords: ["blouse", "top", "camisole", "wrap"],
    matchColors: ["neutral", "pink", "purple", "red"],
    bottomWear: [
      { item: "High-Waist Trousers", colors: ["Black", "Navy", "Cream"], reason: "Flattering silhouette that pairs beautifully with blouses" },
      { item: "Pencil Skirt", colors: ["Black", "Navy", "Grey"], reason: "Classic feminine pairing for a polished look" },
      { item: "Wide-Leg Pants", colors: ["White", "Cream", "Black"], reason: "Modern and elegant bottom for dressy blouses" },
    ],
    footwear: [
      { item: "Heels", colors: ["Black", "Nude", "Red"], reason: "Heels elevate the feminine elegance of blouses" },
      { item: "Pointed Flats", colors: ["Black", "Nude", "Metallic"], reason: "Chic yet comfortable alternative to heels" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Edgy contrast for a modern feminine look" },
    ],
    accessories: [
      { item: "Statement Necklace", colors: ["Gold", "Silver", "Pearl"], reason: "Bold necklace enhances the neckline of blouses" },
      { item: "Clutch", colors: ["Black", "Gold", "Matching"], reason: "Elegant handbag for a polished feminine outfit" },
      { item: "Chandelier Earrings", colors: ["Gold", "Silver", "Crystal"], reason: "Chandelier earrings add drama and movement" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Classic hoops frame the face beautifully" },
      { item: "Chain Bracelet", colors: ["Gold", "Silver", "Rose Gold"], reason: "Elegant chain bracelet for a refined wrist accent" },
      { item: "Tennis Bracelet", colors: ["Silver", "Gold", "Crystal"], reason: "A sparkling tennis bracelet elevates any blouse" },
    ],
  },
  {
    matchKeywords: ["dress", "gown", "frock", "sundress", "bodycon", "maxi", "mini dress", "saree", "sari", "lehenga"],
    matchColors: ["neutral", "red", "pink", "purple", "brown", "blue", "green"],
    bottomWear: [],
    footwear: [
      { item: "Strappy Heels", colors: ["Black", "Nude", "Gold"], reason: "Elegant heels that complement any dress beautifully" },
      { item: "Ankle Boots", colors: ["Black", "Brown", "Tan"], reason: "Trendy boots add an edgy contrast to dresses" },
      { item: "Block Heels", colors: ["Black", "Nude", "Burgundy"], reason: "Comfortable yet stylish — perfect for all-day wear" },
      { item: "White Sneakers", colors: ["White", "Off-White"], reason: "Casual-cool pairing for a laid-back college vibe" },
    ],
    accessories: [
      { item: "Statement Earrings", colors: ["Gold", "Silver", "Crystal"], reason: "Earrings draw attention and frame the face beautifully" },
      { item: "Drop Earrings", colors: ["Gold", "Silver", "Pearl"], reason: "Elegant drop earrings add movement and glamour" },
      { item: "Charm Bracelet", colors: ["Gold", "Silver", "Rose Gold"], reason: "A delicate bracelet adds subtle wrist detail" },
      { item: "Bangle Set", colors: ["Gold", "Silver", "Mixed Metal"], reason: "Stacked bangles create a chic layered look" },
      { item: "Clutch Bag", colors: ["Black", "Gold", "Matching"], reason: "A sleek clutch keeps the look polished and put-together" },
      { item: "Layered Necklace", colors: ["Gold", "Silver"], reason: "Delicate layers add charm to dress necklines" },
      { item: "Hair Accessories", colors: ["Black", "Gold", "Matching"], reason: "Clips or headbands add a finishing touch" },
    ],
  },
  {
    matchKeywords: ["skirt", "pleated skirt", "mini skirt", "midi skirt", "a-line"],
    matchColors: ["neutral", "pink", "red", "blue", "green"],
    bottomWear: [
      { item: "Sheer Tights", colors: ["Black", "Nude"], reason: "Tights pair naturally with skirts for a polished look" },
      { item: "Knee-High Socks", colors: ["Black", "White", "Grey"], reason: "Preppy socks add a fun collegiate touch to skirts" },
    ],
    footwear: [
      { item: "Loafers", colors: ["Black", "Brown", "Burgundy"], reason: "Classic loafers for a smart preppy pairing" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Boots and skirts create a trendy modern look" },
      { item: "Ballet Flats", colors: ["Black", "Nude", "Red"], reason: "Feminine and comfortable everyday option" },
    ],
    accessories: [
      { item: "Tote Bag", colors: ["Brown", "Black", "Canvas"], reason: "Spacious and stylish bag for daily use" },
      { item: "Belt", colors: ["Black", "Brown", "Gold"], reason: "Define the waist for a more structured silhouette" },
      { item: "Earrings", colors: ["Gold", "Silver", "Pearl"], reason: "Simple earrings complete the feminine look" },
    ],
  },
  {
    matchKeywords: ["jumpsuit", "romper", "overalls", "dungarees"],
    matchColors: ["neutral", "blue", "red", "green"],
    bottomWear: [],
    footwear: [
      { item: "Platform Sneakers", colors: ["White", "Black"], reason: "Casual sneakers for an effortless everyday look" },
      { item: "Wedge Sandals", colors: ["Tan", "Black", "Brown"], reason: "Wedges add height while keeping it comfortable" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Boots give jumpsuits an edgy modern vibe" },
    ],
    accessories: [
      { item: "Statement Belt", colors: ["Black", "Brown", "Gold"], reason: "A belt cinches the waist and adds definition" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Hoops add a bold finishing touch" },
      { item: "Crossbody Bag", colors: ["Black", "Tan", "Brown"], reason: "Hands-free bag for a practical stylish outfit" },
    ],
  },
];

// ─── COLOR HARMONY RULES (for Random Forest features) ────────────────────────

export const COLOR_HARMONY_RULES = {
  // Colors that always work together (high compatibility)
  universalPairs: [
    ["Black", "White"], ["Navy", "White"], ["Navy", "Cream"],
    ["Black", "Red"], ["Navy", "Gold"], ["Brown", "Cream"],
    ["Grey", "Pink"], ["Navy", "Coral"], ["Black", "Gold"],
    ["White", "Blue"], ["Charcoal", "White"], ["Brown", "White"],
  ],
  // Colors that clash (low compatibility)
  clashingPairs: [
    ["Red", "Orange"], ["Red", "Pink"], ["Orange", "Pink"],
    ["Purple", "Red"], ["Green", "Orange"], ["Brown", "Black"],
  ],
  // Neutral colors that go with everything
  universalNeutrals: ["Black", "White", "Grey", "Navy", "Cream", "Beige", "Charcoal", "Ivory"],
};
