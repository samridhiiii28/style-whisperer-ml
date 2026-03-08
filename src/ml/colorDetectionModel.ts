/**
 * ══════════════════════════════════════════════════════════════════════════════
 * COLOR DETECTION MODEL
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * Client-side ML model that extracts dominant colors from clothing images
 * using HTML5 Canvas pixel sampling + K-Means clustering.
 * 
 * Pipeline:
 *   1. Load image → Canvas → pixel array
 *   2. Filter out background pixels (white/transparent)
 *   3. K-Means clustering to find dominant color centroids
 *   4. Map centroids to nearest named color from COLOR_DATASET
 *   5. Return detected colors with hex, names, and confidence
 * 
 * No external API calls — runs entirely in the browser.
 */

import { COLOR_DATASET, type ColorEntry } from "./dataset";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DetectedColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  percentage: number;  // how much of the image this color covers (0-100)
  family: string;
  warmth: string;
}

// ─── K-Means Clustering ─────────────────────────────────────────────────────

interface Point { r: number; g: number; b: number; }

function rgbDistance(a: Point, b: Point): number {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

/**
 * K-Means clustering on RGB pixels.
 * Returns K cluster centroids (dominant colors).
 */
function kMeansClustering(pixels: Point[], k: number, maxIterations = 15): Point[] {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) return [...pixels];

  // Initialize centroids using K-Means++ for better convergence
  const centroids: Point[] = [pixels[Math.floor(Math.random() * pixels.length)]];
  
  for (let c = 1; c < k; c++) {
    const distances = pixels.map(p => {
      const minDist = Math.min(...centroids.map(cent => rgbDistance(p, cent)));
      return minDist * minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalDist;
    for (let i = 0; i < pixels.length; i++) {
      random -= distances[i];
      if (random <= 0) {
        centroids.push(pixels[i]);
        break;
      }
    }
    if (centroids.length <= c) centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
  }

  // Iterate
  const assignments = new Array(pixels.length);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign each pixel to nearest centroid
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let minDist = Infinity;
      let minIdx = 0;
      for (let j = 0; j < centroids.length; j++) {
        const d = rgbDistance(pixels[i], centroids[j]);
        if (d < minDist) { minDist = d; minIdx = j; }
      }
      if (assignments[i] !== minIdx) { changed = true; assignments[i] = minIdx; }
    }

    if (!changed) break;

    // Recalculate centroids
    const sums = centroids.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c].r += pixels[i].r;
      sums[c].g += pixels[i].g;
      sums[c].b += pixels[i].b;
      sums[c].count++;
    }
    for (let j = 0; j < centroids.length; j++) {
      if (sums[j].count > 0) {
        centroids[j] = {
          r: Math.round(sums[j].r / sums[j].count),
          g: Math.round(sums[j].g / sums[j].count),
          b: Math.round(sums[j].b / sums[j].count),
        };
      }
    }
  }

  return centroids;
}

// ─── Color Matching ─────────────────────────────────────────────────────────

/**
 * Check if a pixel is essentially black.
 * True black garments often get misclassified as Navy due to camera noise.
 */
function isEssentiallyBlack(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  // Very dark (all channels < 50) with low saturation = black
  if (max < 50 && saturation < 0.35) return true;
  // Dark with extremely low values = black
  if (r < 35 && g < 35 && b < 45) return true;
  return false;
}

function matchToNamedColor(rgb: Point): ColorEntry {
  // Priority: detect true black before matching
  if (isEssentiallyBlack(rgb.r, rgb.g, rgb.b)) {
    return COLOR_DATASET.find(c => c.name === "Black") || COLOR_DATASET[0];
  }

  let bestMatch = COLOR_DATASET[0];
  let bestDist = Infinity;

  for (const entry of COLOR_DATASET) {
    const d = rgbDistance(rgb, { r: entry.rgb[0], g: entry.rgb[1], b: entry.rgb[2] });
    if (d < bestDist) {
      bestDist = d;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

function isBackgroundPixel(r: number, g: number, b: number, a: number): boolean {
  // Skip transparent, near-white, or near-black background
  if (a < 200) return true;
  if (r > 240 && g > 240 && b > 240) return true; // white bg
  if (r < 10 && g < 10 && b < 10) return true;     // pure black bg
  // Light grey backgrounds
  if (r > 220 && g > 220 && b > 220 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) return true;
  return false;
}

/**
 * Detect if a pixel is likely a skin tone.
 * Uses multiple heuristics to cover a wide range of skin colors.
 */
function isSkinTonePixel(r: number, g: number, b: number): boolean {
  // ── Yellow / Gold exclusion ──
  // Yellow garments have high R, high G, and LOW B — skin never has B this low relative to R & G
  // This prevents yellow/mustard/gold fabrics from being filtered as skin
  const blueRatio = b / Math.max(r, 1);
  const greenRatio = g / Math.max(r, 1);
  if (blueRatio < 0.45 && greenRatio > 0.65 && r > 120) {
    // This is a yellow/gold pixel, NOT skin
    return false;
  }

  // Rule 1: Classic skin-tone detection (works for lighter to medium tones)
  if (r > 95 && g > 40 && b > 20 &&
      r > g && r > b &&
      (r - g) > 15 &&
      Math.abs(r - g) < 100 &&
      (r - b) > 15) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    if (saturation > 0.1 && saturation < 0.55) {
      return true;
    }
  }
  
  // Rule 2: Detect beige/tan skin tones specifically
  if (r > 160 && g > 120 && b > 90 &&
      r < 240 && g < 200 && b < 170 &&
      (r - b) > 30 && (r - b) < 100 &&
      (r - g) > 5 && (r - g) < 60) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    if (saturation < 0.4) return true;
  }

  return false;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Extract dominant colors from a base64-encoded image.
 * Uses K-Means clustering to find the most prominent colors,
 * then maps them to the nearest named color from our dataset.
 * 
 * @param imageBase64 - Base64 data URL of the image
 * @param numColors - Number of dominant colors to extract (default: 4)
 * @returns Promise<DetectedColor[]> - Array of detected colors
 */
export function extractDominantColors(imageBase64: string, numColors = 4): Promise<DetectedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas not supported")); return; }

        // Scale down for performance (max 150px)
        const maxSize = 150;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels: Point[] = [];

        // Focus on center 70% of the image where the garment is most likely
        const marginX = Math.floor(canvas.width * 0.15);
        const marginY = Math.floor(canvas.height * 0.10);
        const endX = canvas.width - marginX;
        const endY = canvas.height - Math.floor(canvas.height * 0.05);

        // First pass: collect non-background, non-skin pixels (garment pixels)
        const garmentPixels: Point[] = [];
        const allNonBgPixels: Point[] = [];

        for (let y = marginY; y < endY; y += 2) {
          for (let x = marginX; x < endX; x += 2) {
            const i = (y * canvas.width + x) * 4;
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];
            if (isBackgroundPixel(r, g, b, a)) continue;
            allNonBgPixels.push({ r, g, b });
            if (!isSkinTonePixel(r, g, b)) {
              garmentPixels.push({ r, g, b });
            }
          }
        }

        // Use garment pixels if we have enough, otherwise fall back to all non-bg pixels
        const selectedPixels = garmentPixels.length >= 30 ? garmentPixels : allNonBgPixels;

        if (selectedPixels.length < 10) {
          // Not enough non-background pixels
          resolve([{
            name: "Unknown", hex: "#808080", rgb: [128, 128, 128],
            percentage: 100, family: "neutral", warmth: "neutral"
          }]);
          return;
        }

        // Run K-Means
        const centroids = kMeansClustering(selectedPixels, Math.min(numColors, 6));

        // Count pixels per centroid
        const counts = new Array(centroids.length).fill(0);
        for (const p of selectedPixels) {
          let minDist = Infinity;
          let minIdx = 0;
          for (let j = 0; j < centroids.length; j++) {
            const d = rgbDistance(p, centroids[j]);
            if (d < minDist) { minDist = d; minIdx = j; }
          }
          counts[minIdx]++;
        }

        // Map centroids to named colors and sort by frequency
        const results: DetectedColor[] = centroids
          .map((c, i) => {
            const named = matchToNamedColor(c);
            return {
              name: named.name,
              hex: rgbToHex(c.r, c.g, c.b),
              rgb: [c.r, c.g, c.b] as [number, number, number],
              percentage: Math.round((counts[i] / selectedPixels.length) * 100),
              family: named.family,
              warmth: named.warmth,
            };
          })
          .sort((a, b) => b.percentage - a.percentage);

        // Deduplicate by name (keep highest percentage)
        const seen = new Set<string>();
        const deduped = results.filter(c => {
          if (seen.has(c.name)) return false;
          seen.add(c.name);
          return true;
        });

        resolve(deduped.slice(0, numColors));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for color detection"));
    img.src = imageBase64;
  });
}
