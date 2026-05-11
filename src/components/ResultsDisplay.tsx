import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Palette, Calendar, Shirt, Footprints, Watch, Lightbulb, Check, Loader2, ImageIcon } from "lucide-react";
import MLInsightsPanel from "./MLInsightsPanel";
import { toast } from "sonner";
import { getDemoItemImage, getDemoFullOutfitImage } from "@/assets/demo";
import { geminiImageGeneration, geminiBatchImageGeneration } from "@/lib/gemini";

const itemImageCache = new Map<string, string>();

const createFallbackItemImage = (itemName: string, itemColor: string) => {
  const label = `${itemColor} ${itemName}`.trim();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#f6f2ea'/>
      <stop offset='100%' stop-color='#e8dfd0'/>
    </linearGradient>
  </defs>
  <rect width='640' height='480' fill='url(#bg)'/>
  <rect x='56' y='56' width='528' height='368' rx='24' fill='#ffffff' stroke='#d7c5a2' stroke-width='2'/>
  <text x='320' y='220' text-anchor='middle' font-family='system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='28' fill='#5f4a28'>${label}</text>
  <text x='320' y='260' text-anchor='middle' font-family='system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='16' fill='#7a6a4c'>Preview available while image service is busy</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export interface AIAnalysisResult {
  detectedItem: string;
  detectedColors: { name: string; hex: string }[];
  occasion: {
    primary: string;
    alternatives: string[];
    reasoning: string;
  };
  suggestions: {
    bottomWear: { item: string; color: string; reason: string }[];
    footwear: { item: string; color: string; reason: string }[];
    accessories: { item: string; color: string; reason: string }[];
  };
  isFullBodyGarment?: boolean;
  colorCompatibility: {
    score: number;
    analysis: string;
  };
  styleAnalysis: string;
  overallScore: number;
}

interface ResultsDisplayProps {
  result: AIAnalysisResult;
  uploadedImage: string;
  onOutfitDescription: (desc: string) => void;
}

const ScoreRing = ({ score, label }: { score: number; label: string }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "hsl(var(--gold))" : score >= 50 ? "hsl(var(--champagne))" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="110" height="110" className="-rotate-90">
          <circle cx="55" cy="55" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <motion.circle
            cx="55" cy="55" r="40" fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body">{label}</span>
    </div>
  );
};

const ItemImageCard = ({ itemName, itemColor, preloadedUrl }: { itemName: string; itemColor: string; preloadedUrl?: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(preloadedUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (preloadedUrl) {
      setImageUrl(preloadedUrl);
      setLoading(false);
      setFailed(false);
    }
  }, [preloadedUrl]);

  const generateImage = useCallback(async () => {
    const cacheKey = `${itemColor.toLowerCase()}::${itemName.toLowerCase()}`;
    const cachedUrl = itemImageCache.get(cacheKey);
    if (cachedUrl) { setImageUrl(cachedUrl); return; }

    setLoading(true);
    setFailed(false);
    try {
      const prompt = `Generate a clean product photograph of this fashion item: ${itemColor} ${itemName}. Single item on clean white background, professional product photography, high detail, fashion e-commerce style.`;
      const url = await geminiImageGeneration(prompt);
      itemImageCache.set(cacheKey, url);
      setImageUrl(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate item image";
      console.warn("Item image generation failed, using demo fallback:", message);
      const fallbackImage = getDemoItemImage(itemName);
      itemImageCache.set(cacheKey, fallbackImage);
      setImageUrl(fallbackImage);
    } finally {
      setLoading(false);
    }
  }, [itemColor, itemName]);

  return (
    <div className="w-full h-48 rounded-lg border border-gold/10 bg-secondary/30 flex items-center justify-center overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={itemName} className="w-full h-full object-contain" />
      ) : loading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={20} className="text-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-body">Generating...</span>
        </div>
      ) : (
        <button
          onClick={generateImage}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ImageIcon size={24} />
          <span className="text-xs font-body">{failed ? "Retry" : "Generate image"}</span>
        </button>
      )}
    </div>
  );
};

const SuggestionCard = ({
  icon: Icon,
  title,
  items,
  selectedIndex,
  onSelectedIndexChange,
  preloadedImages,
}: {
  icon: React.ElementType;
  title: string;
  items: { item: string; color: string; reason: string }[];
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  preloadedImages?: Map<string, string>;
}) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const currentIndex = typeof selectedIndex === "number" ? selectedIndex : internalSelectedIndex;
  const normalizedIndex = items.length > 0 ? currentIndex % items.length : 0;
  const selected = items[normalizedIndex];

  const setSelected = (nextIndex: number) => {
    if (onSelectedIndexChange) {
      onSelectedIndexChange(nextIndex);
      return;
    }
    setInternalSelectedIndex(nextIndex);
  };

  if (!selected) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={16} className="text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
        </div>
        {items.length > 1 && (
          <select
            value={normalizedIndex}
            onChange={(e) => setSelected(Number(e.target.value))}
            className="bg-secondary/80 border border-gold/15 rounded-lg px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-primary/40 transition-all cursor-pointer appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
            }}
          >
            {items.map((item, i) => (
              <option key={i} value={i} className="bg-card text-foreground">
                {item.item} — {item.color}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="p-4 bg-secondary/30 rounded-lg">
        <ItemImageCard key={`${selected.item}-${selected.color}`} itemName={selected.item} itemColor={selected.color} preloadedUrl={preloadedImages?.get(`${selected.color.toLowerCase()}::${selected.item.toLowerCase()}`)} />
        <div className="mt-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center mt-0.5 shrink-0">
            <Check size={12} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-body text-foreground font-medium">
              {selected.item} <span className="text-muted-foreground">— {selected.color}</span>
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1 leading-relaxed">{selected.reason}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const COLOR_WORDS = new Set([
  "black", "white", "blue", "red", "green", "yellow", "orange", "pink", "purple", "brown", "grey", "gray",
  "beige", "cream", "ivory", "tan", "khaki", "camel", "maroon", "navy", "teal", "olive", "gold", "silver",
]);

const stripColorWordsFromItem = (item: string): string => {
  const tokens = item
    .split(/\s+/)
    .map((token) => token.replace(/[^a-zA-Z-]/g, ""))
    .filter(Boolean);

  if (tokens.length === 0) return item;

  let firstNonColor = 0;
  while (firstNonColor < tokens.length && COLOR_WORDS.has(tokens[firstNonColor].toLowerCase())) {
    firstNonColor += 1;
  }

  const cleaned = tokens.slice(firstNonColor).join(" ").trim();
  return cleaned || item;
};

const FullOutfitImage = ({
  outfitDescription,
  sourceGarmentImage,
  sourceGarmentColorName,
  sourceGarmentColorHex,
}: {
  outfitDescription: string;
  sourceGarmentImage: string;
  sourceGarmentColorName?: string;
  sourceGarmentColorHex?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const requestIdRef = useRef(0);

  const invokeOutfitImage = async (): Promise<string> => {
    const colorLock = sourceGarmentColorName
      ? `The top/main garment must be the EXACT same item from the provided reference image — same color (${sourceGarmentColorName}${sourceGarmentColorHex ? `, ${sourceGarmentColorHex}` : ""}), same pattern, same fabric, same style. Do NOT change or substitute the garment.`
      : "The main garment must be the EXACT same item from the provided reference image — same color, pattern, fabric, and style.";
    const prompt = `I am providing a reference image of a clothing item. Generate a high-quality fashion photograph of a model wearing THIS EXACT garment from the reference image as part of a complete outfit: ${outfitDescription}. ${colorLock} Full body shot, professional studio lighting, clean white background, fashion editorial style, high resolution.`;
    return geminiImageGeneration(prompt, sourceGarmentImage);
  };

  const generateFullOutfit = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setFailed(false);

    try {
      const nextImageUrl = await invokeOutfitImage();
      if (requestId !== requestIdRef.current) return;
      setImageUrl(nextImageUrl);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      const message = error instanceof Error ? error.message : "Failed to generate outfit image";
      if (/credits exhausted|payment required/i.test(message)) {
        setImageUrl(getDemoFullOutfitImage());
        setFailed(false);
      } else {
        setFailed(true);
        toast.error(message);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    generateFullOutfit();
    return () => {
      requestIdRef.current += 1;
    };
  }, [outfitDescription, sourceGarmentImage]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated rounded-xl p-6 mb-6"
    >
      <div className="flex items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <ImageIcon size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">Styled Look</h3>
            <p className="text-[11px] text-muted-foreground font-body">AI-generated outfit preview</p>
          </div>
        </div>
      </div>

      {imageUrl ? (
        <div className="flex justify-center rounded-lg overflow-hidden bg-secondary/20">
          <img
            src={imageUrl}
            alt="AI generated full outfit"
            className="max-h-[500px] object-contain"
          />
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="relative">
            <Loader2 size={32} className="text-primary animate-spin" />
            <div className="absolute inset-0 animate-ping">
              <Loader2 size={32} className="text-primary/20" />
            </div>
          </div>
          <p className="text-sm font-body text-muted-foreground">Generating styled look...</p>
          <p className="text-xs font-body text-muted-foreground/50">This may take 15-30 seconds</p>
        </div>
      ) : failed ? (
        <div className="flex flex-col items-center justify-center h-32 gap-3">
          <p className="text-sm font-body text-muted-foreground">Failed to generate. Try again?</p>
          <button
            onClick={generateFullOutfit}
            className="px-5 py-2.5 border border-gold/20 rounded-lg text-xs text-primary font-body font-medium hover:bg-primary/10 transition-all"
          >
            Retry
          </button>
        </div>
      ) : null}
    </motion.div>
  );
};

const ResultsDisplay = ({ result, uploadedImage, onOutfitDescription }: ResultsDisplayProps) => {
  const [outfitVariant, setOutfitVariant] = useState({ bottom: 0, footwear: 0, accessories: 0 });
  const [preloadedImages, setPreloadedImages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setOutfitVariant({ bottom: 0, footwear: 0, accessories: 0 });

    // Batch-generate all item images in parallel
    const allItems: { key: string; prompt: string }[] = [];
    const addItems = (items: { item: string; color: string }[] | undefined) => {
      if (!items) return;
      for (const { item, color } of items) {
        const key = `${color.toLowerCase()}::${item.toLowerCase()}`;
        if (!itemImageCache.has(key)) {
          allItems.push({
            key,
            prompt: `Generate a clean product photograph of this fashion item: ${color} ${item}. Single item on clean white background, professional product photography, high detail, fashion e-commerce style.`,
          });
        }
      }
    };

    addItems(result.suggestions.bottomWear);
    addItems(result.suggestions.footwear);
    addItems(result.suggestions.accessories);

    if (allItems.length > 0) {
      geminiBatchImageGeneration(allItems).then((results) => {
        for (const [key, url] of results) {
          itemImageCache.set(key, url);
        }
        setPreloadedImages(new Map(itemImageCache));
      }).catch((err) => {
        console.error("Batch image preload failed:", err);
      });
    }
  }, [result]);

  const pickSuggestion = (
    items: { item: string; color: string; reason: string }[] | undefined,
    index: number,
  ) => {
    if (!items?.length) return undefined;
    return items[index % items.length];
  };

  const selectedBottom = pickSuggestion(result.suggestions.bottomWear, outfitVariant.bottom);
  const selectedFootwear = pickSuggestion(result.suggestions.footwear, outfitVariant.footwear);
  const selectedAccessory = pickSuggestion(result.suggestions.accessories, outfitVariant.accessories);

  const primaryGarmentColorName = result.detectedColors?.[0]?.name?.trim();
  const primaryGarmentColorHex = result.detectedColors?.[0]?.hex;
  const cleanedDetectedItem = stripColorWordsFromItem(result.detectedItem);

  const fullOutfitDesc = (() => {
    const garmentLead = primaryGarmentColorName
      ? `${primaryGarmentColorName} ${cleanedDetectedItem}`
      : cleanedDetectedItem;

    const parts = [garmentLead];
    if (selectedBottom) parts.push(`${selectedBottom.color} ${selectedBottom.item}`);
    if (selectedFootwear) parts.push(`${selectedFootwear.color} ${selectedFootwear.item}`);
    if (selectedAccessory) parts.push(`${selectedAccessory.color} ${selectedAccessory.item}`);
    return parts.join(", ");
  })();

  useEffect(() => {
    onOutfitDescription(fullOutfitDesc);
  }, [fullOutfitDesc, onOutfitDescription]);

  return (
    <section className="relative py-32 px-6">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-14">
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Results</span>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span className="text-gradient-gold">Analysis</span> Results
            </h2>
          </div>

          {/* Detected item + image */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated rounded-xl p-6 mb-6 flex flex-col sm:flex-row gap-6 items-center"
          >
            <div className="w-36 h-36 rounded-xl overflow-hidden border border-gold/10 bg-secondary/30 shrink-0">
              <img
                src={uploadedImage}
                alt="Analyzed clothing"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-2">Detected Item</p>
              <p className="font-display text-2xl font-bold text-foreground">{result.detectedItem}</p>
            </div>
          </motion.div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="card-elevated rounded-xl p-8 flex flex-col items-center"
            >
              <ScoreRing score={result.overallScore} label="Overall Score" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="card-elevated rounded-xl p-8 flex flex-col items-center"
            >
              <ScoreRing score={result.colorCompatibility.score} label="Color Score" />
            </motion.div>
          </div>

          {/* Detected Colors */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="card-elevated rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette size={16} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Detected Colors</h3>
            </div>
            <div className="flex flex-wrap gap-3 mb-5">
              {result.detectedColors.map((color, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/50 border border-gold/8">
                  <div
                    className="w-7 h-7 rounded-full border border-gold/15 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-body text-foreground">{color.name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.colorCompatibility.analysis}
            </p>
          </motion.div>

          {/* Occasion */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card-elevated rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar size={16} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Occasion Prediction</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-primary/15 text-primary rounded-lg text-sm font-body font-medium border border-primary/20">
                {result.occasion.primary}
              </span>
              {result.occasion.alternatives.map((alt) => (
                <span key={alt} className="tag-pill">
                  {alt}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.occasion.reasoning}
            </p>
          </motion.div>

          {/* Full Outfit AI Image */}
          <FullOutfitImage
            outfitDescription={fullOutfitDesc}
            sourceGarmentImage={uploadedImage}
            sourceGarmentColorName={primaryGarmentColorName}
            sourceGarmentColorHex={primaryGarmentColorHex}
          />

          {/* Suggestions */}
          <div className="space-y-6 mb-6">
            {result.suggestions.bottomWear?.length > 0 && (
              <SuggestionCard
                icon={Shirt}
                title="Bottom Wear"
                items={result.suggestions.bottomWear}
                selectedIndex={outfitVariant.bottom}
                onSelectedIndexChange={(index) => setOutfitVariant((prev) => ({ ...prev, bottom: index }))}
                preloadedImages={preloadedImages}
              />
            )}
            {result.suggestions.footwear?.length > 0 && (
              <SuggestionCard
                icon={Footprints}
                title="Footwear"
                items={result.suggestions.footwear}
                selectedIndex={outfitVariant.footwear}
                onSelectedIndexChange={(index) => setOutfitVariant((prev) => ({ ...prev, footwear: index }))}
                preloadedImages={preloadedImages}
              />
            )}
            {result.suggestions.accessories?.length > 0 && (
              <SuggestionCard
                icon={Watch}
                title="Accessories"
                items={result.suggestions.accessories}
                selectedIndex={outfitVariant.accessories}
                onSelectedIndexChange={(index) => setOutfitVariant((prev) => ({ ...prev, accessories: index }))}
                preloadedImages={preloadedImages}
              />
            )}
          </div>

          {/* Style Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="card-elevated rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lightbulb size={16} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Style Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.styleAnalysis}
            </p>
          </motion.div>

          <MLInsightsPanel result={result} />
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
