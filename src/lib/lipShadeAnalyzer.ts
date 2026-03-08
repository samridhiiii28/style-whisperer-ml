// Client-side ML skin tone analysis and lip shade recommendation
// Uses canvas pixel sampling to detect skin tone, then recommends lip shades via color theory

export interface SkinToneResult {
  skinTone: { r: number; g: number; b: number };
  skinToneHex: string;
  undertone: "warm" | "cool" | "neutral";
  skinCategory: string;
}

export interface LipShadeRecommendation {
  name: string;
  hex: string;
  finish: string;
  reason: string;
}

export interface LipAnalysisResult {
  skinTone: SkinToneResult;
  recommendations: LipShadeRecommendation[];
}

// Convert RGB to HSL for analysis
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
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

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

// Detect if a pixel is likely skin color
function isSkinPixel(r: number, g: number, b: number): boolean {
  const [h, s, l] = rgbToHsl(r, g, b);
  // Skin tones typically fall in specific HSL ranges
  return (
    h >= 0 && h <= 50 &&
    s >= 15 && s <= 75 &&
    l >= 20 && l <= 85 &&
    r > 60 && g > 40 && b > 20 &&
    r > g && r > b &&
    Math.abs(r - g) > 10
  );
}

// Determine undertone from skin color
function getUndertone(r: number, g: number, b: number): "warm" | "cool" | "neutral" {
  const [h] = rgbToHsl(r, g, b);
  // Warm undertones lean more yellow/golden (higher hue)
  // Cool undertones lean more pink/red (lower hue)
  if (h >= 25 && h <= 45) return "warm";
  if (h < 15 || h > 45) return "cool";
  return "neutral";
}

// Categorize skin tone depth
function getSkinCategory(l: number): string {
  if (l >= 70) return "Fair";
  if (l >= 55) return "Light";
  if (l >= 42) return "Medium";
  if (l >= 30) return "Tan";
  return "Deep";
}

// Extract skin tone from image using canvas
export function analyzeSkinTone(imageBase64: string): Promise<SkinToneResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }

      // Scale down for performance
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Sample skin pixels — focus on upper-center region (face area)
      const startY = Math.floor(canvas.height * 0.1);
      const endY = Math.floor(canvas.height * 0.5);
      const startX = Math.floor(canvas.width * 0.25);
      const endX = Math.floor(canvas.width * 0.75);

      let totalR = 0, totalG = 0, totalB = 0, skinCount = 0;

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
          if (isSkinPixel(r, g, b)) {
            totalR += r; totalG += g; totalB += b;
            skinCount++;
          }
        }
      }

      // Fallback: sample entire image if not enough skin found
      if (skinCount < 50) {
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          if (isSkinPixel(r, g, b)) {
            totalR += r; totalG += g; totalB += b;
            skinCount++;
          }
        }
      }

      if (skinCount === 0) {
        // Default fallback
        resolve({
          skinTone: { r: 200, g: 170, b: 140 },
          skinToneHex: "#C8AA8C",
          undertone: "neutral",
          skinCategory: "Medium",
        });
        return;
      }

      const avgR = Math.round(totalR / skinCount);
      const avgG = Math.round(totalG / skinCount);
      const avgB = Math.round(totalB / skinCount);
      const [, , l] = rgbToHsl(avgR, avgG, avgB);

      resolve({
        skinTone: { r: avgR, g: avgG, b: avgB },
        skinToneHex: rgbToHex(avgR, avgG, avgB),
        undertone: getUndertone(avgR, avgG, avgB),
        skinCategory: getSkinCategory(l),
      });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageBase64;
  });
}

// Recommend lip shades based on skin tone analysis
export function recommendLipShades(skinTone: SkinToneResult): LipShadeRecommendation[] {
  const { undertone, skinCategory } = skinTone;

  const shadeDatabase: Record<string, Record<string, LipShadeRecommendation[]>> = {
    warm: {
      Fair: [
        { name: "Peach Kiss", hex: "#F4A68C", finish: "Satin", reason: "A soft peach enhances warm fair skin without overpowering" },
        { name: "Coral Dream", hex: "#E8735A", finish: "Cream", reason: "Coral flatters warm undertones and adds a healthy flush" },
        { name: "Warm Nude", hex: "#C4956A", finish: "Matte", reason: "A warm nude that blends naturally with fair warm skin" },
        { name: "Terracotta Rose", hex: "#C75B5B", finish: "Satin", reason: "An earthy rose that complements golden undertones" },
      ],
      Light: [
        { name: "Cinnamon Spice", hex: "#C45C3E", finish: "Matte", reason: "A warm cinnamon that enhances light warm skin beautifully" },
        { name: "Honey Mauve", hex: "#B5727D", finish: "Cream", reason: "Mauve with warm undertones creates a natural harmony" },
        { name: "Toffee Rose", hex: "#B56B6B", finish: "Satin", reason: "Warm rosy toffee for an effortless everyday look" },
        { name: "Burnt Sienna", hex: "#A0522D", finish: "Matte", reason: "Rich earthy tone that deepens the warmth naturally" },
      ],
      Medium: [
        { name: "Russet Red", hex: "#A52A2A", finish: "Cream", reason: "A warm red that pops beautifully against medium warm skin" },
        { name: "Copper Berry", hex: "#8B4557", finish: "Satin", reason: "Berry with copper undertones for a sophisticated look" },
        { name: "Warm Brick", hex: "#9C3E2E", finish: "Matte", reason: "An earthy brick shade that enhances warm medium tones" },
        { name: "Spiced Plum", hex: "#7B3F5E", finish: "Cream", reason: "Warm plum that adds depth without looking harsh" },
      ],
      Tan: [
        { name: "Burnt Orange", hex: "#CC5500", finish: "Matte", reason: "A bold warm shade that complements tan warm skin gorgeously" },
        { name: "Mahogany", hex: "#6E3030", finish: "Satin", reason: "Rich mahogany enhances the warmth of tan skin" },
        { name: "Caramel Wine", hex: "#7A3B3B", finish: "Cream", reason: "Wine with caramel warmth for an elegant look" },
        { name: "Bronze Berry", hex: "#8B3A62", finish: "Matte", reason: "A bronzed berry that glows on warm tan skin" },
      ],
      Deep: [
        { name: "Rich Burgundy", hex: "#5C1A1A", finish: "Satin", reason: "Deep burgundy creates stunning contrast on deep warm skin" },
        { name: "Warm Oxblood", hex: "#4A0000", finish: "Matte", reason: "Intense oxblood with warm depth for a powerful look" },
        { name: "Chocolate Cherry", hex: "#5A2D2D", finish: "Cream", reason: "Warm chocolate cherry that enhances deep skin beautifully" },
        { name: "Burnt Plum", hex: "#5D2B4E", finish: "Satin", reason: "A rich warm plum for deep skin with golden undertones" },
      ],
    },
    cool: {
      Fair: [
        { name: "Rose Petal", hex: "#E8A0BF", finish: "Satin", reason: "Soft pink-rose that complements cool fair skin naturally" },
        { name: "Mauve Blush", hex: "#C88EA7", finish: "Cream", reason: "Cool mauve that enhances pink undertones in fair skin" },
        { name: "Berry Frost", hex: "#B5507B", finish: "Satin", reason: "A frosty berry that flatters cool complexions" },
        { name: "Dusty Rose", hex: "#C48B9F", finish: "Matte", reason: "Classic dusty rose for an elegant cool-toned look" },
      ],
      Light: [
        { name: "Raspberry", hex: "#A03060", finish: "Cream", reason: "Cool raspberry pops against light cool skin" },
        { name: "Plum Rose", hex: "#955070", finish: "Satin", reason: "Plum with rosy undertones for a sophisticated look" },
        { name: "Cool Mauve", hex: "#9B6B8B", finish: "Matte", reason: "A perfectly balanced cool mauve for light skin" },
        { name: "Wine Kiss", hex: "#7A2045", finish: "Cream", reason: "Deep wine with cool undertones for dramatic effect" },
      ],
      Medium: [
        { name: "Berry Wine", hex: "#8B2252", finish: "Matte", reason: "A rich berry wine that enhances cool medium skin" },
        { name: "Cranberry", hex: "#9B1B30", finish: "Satin", reason: "Cool cranberry red for a bold, flattering look" },
        { name: "Mulberry", hex: "#77405D", finish: "Cream", reason: "Cool mulberry adds depth to medium cool skin" },
        { name: "Cool Red", hex: "#C41E3A", finish: "Matte", reason: "A blue-based red that complements cool undertones perfectly" },
      ],
      Tan: [
        { name: "Deep Fuchsia", hex: "#8B2260", finish: "Satin", reason: "Fuchsia creates beautiful contrast on cool tan skin" },
        { name: "Plum Night", hex: "#5C2D5C", finish: "Matte", reason: "Deep cool plum for a glamorous evening look" },
        { name: "Merlot", hex: "#6B1B30", finish: "Cream", reason: "Cool merlot that deepens and flatters tan skin" },
        { name: "Violet Berry", hex: "#6B3A7A", finish: "Satin", reason: "A violet-berry that enhances cool undertones" },
      ],
      Deep: [
        { name: "Deep Plum", hex: "#3D1C3D", finish: "Matte", reason: "Rich deep plum for stunning impact on deep cool skin" },
        { name: "Blackberry", hex: "#3A1B3A", finish: "Satin", reason: "Cool blackberry shade for deep skin with blue undertones" },
        { name: "Dark Cherry", hex: "#4A0E22", finish: "Cream", reason: "Cool dark cherry that glows on deep skin" },
        { name: "Aubergine", hex: "#3D0C4E", finish: "Matte", reason: "Deep aubergine for a striking, cool-toned look" },
      ],
    },
    neutral: {
      Fair: [
        { name: "Nude Pink", hex: "#D4A0A0", finish: "Satin", reason: "A balanced nude pink that suits neutral fair skin perfectly" },
        { name: "Soft Berry", hex: "#B86078", finish: "Cream", reason: "Neither too warm nor cool — ideal for neutral undertones" },
        { name: "Rose", hex: "#C46B7C", finish: "Matte", reason: "Classic rose that harmonizes with neutral fair complexions" },
        { name: "Peach Rose", hex: "#D4897B", finish: "Satin", reason: "A peach-rose blend that flatters balanced undertones" },
      ],
      Light: [
        { name: "Medium Rose", hex: "#B5606B", finish: "Cream", reason: "A versatile rose shade for neutral light skin" },
        { name: "Rosewood", hex: "#9C5060", finish: "Matte", reason: "Balanced rosewood suits neutral undertones beautifully" },
        { name: "Blush Mauve", hex: "#A0707A", finish: "Satin", reason: "Soft mauve-blush for an effortless neutral look" },
        { name: "Fig", hex: "#8B4060", finish: "Cream", reason: "Fig shade bridges warm and cool for neutral skin" },
      ],
      Medium: [
        { name: "True Red", hex: "#B22222", finish: "Matte", reason: "A balanced true red that flatters all neutral medium skin" },
        { name: "Rosy Brown", hex: "#8B5050", finish: "Satin", reason: "A neutral rosy brown for everyday elegance" },
        { name: "Muted Berry", hex: "#7B3B55", finish: "Cream", reason: "Balanced berry shade ideal for neutral complexions" },
        { name: "Dusty Mauve", hex: "#7A5060", finish: "Matte", reason: "Neutral dusty mauve for sophisticated style" },
      ],
      Tan: [
        { name: "Warm Berry", hex: "#7A3040", finish: "Satin", reason: "Berry with balanced warmth for neutral tan skin" },
        { name: "Clay Red", hex: "#8B3535", finish: "Matte", reason: "An earthy balanced red for neutral tan complexions" },
        { name: "Deep Rose", hex: "#6B2B45", finish: "Cream", reason: "Deep rose that works with neutral undertones" },
        { name: "Raisin", hex: "#5B2B3B", finish: "Matte", reason: "Rich raisin for a balanced dramatic look" },
      ],
      Deep: [
        { name: "Deep Wine", hex: "#4A1525", finish: "Satin", reason: "Balanced deep wine for neutral deep skin" },
        { name: "Espresso", hex: "#3D1B1B", finish: "Matte", reason: "Rich espresso shade for a bold neutral look" },
        { name: "Dark Berry", hex: "#3D1530", finish: "Cream", reason: "Balanced dark berry for deep neutral complexions" },
        { name: "Mahogany Rose", hex: "#4A2030", finish: "Satin", reason: "A deep rosy mahogany that suits neutral deep skin" },
      ],
    },
  };

  return shadeDatabase[undertone]?.[skinCategory] || shadeDatabase.neutral.Medium;
}
