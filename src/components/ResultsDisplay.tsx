import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Palette, Calendar, Shirt, Footprints, Watch, Lightbulb, Check, Loader2, ImageIcon, RefreshCw } from "lucide-react";
import MLInsightsPanel from "./MLInsightsPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const ItemImageCard = ({ itemName, itemColor }: { itemName: string; itemColor: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const { data, error } = await supabase.functions.invoke("generate-outfit-image", {
        body: { prompt: `${itemColor} ${itemName}`, type: "item" },
      });
      if (error || data?.error) {
        setFailed(true);
        if (data?.error) toast.error(data.error);
      } else {
        setImageUrl(data.imageUrl);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateImage();
  }, [itemName, itemColor]);

  return (
    <div className="w-full h-48 rounded-lg border border-gold/10 bg-secondary/30 flex items-center justify-center overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={itemName} className="w-full h-full object-contain" />
      ) : loading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={20} className="text-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-body">Generating...</span>
        </div>
      ) : failed ? (
        <button
          onClick={generateImage}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ImageIcon size={24} />
          <span className="text-xs font-body">Retry</span>
        </button>
      ) : null}
    </div>
  );
};

const SuggestionCard = ({
  icon: Icon,
  title,
  items,
  selectedIndex,
  onSelectedIndexChange,
}: {
  icon: React.ElementType;
  title: string;
  items: { item: string; color: string; reason: string }[];
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
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
        <ItemImageCard key={`${selected.item}-${selected.color}`} itemName={selected.item} itemColor={selected.color} />
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

const FullOutfitImage = ({
  outfitDescription,
  sourceGarmentImage,
  onRefreshLook,
  refreshKey,
}: {
  outfitDescription: string;
  sourceGarmentImage: string;
  onRefreshLook: () => void;
  refreshKey: number;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const requestIdRef = useRef(0);

  const invokeOutfitImage = async (maxAttempts = 3): Promise<string> => {
    let lastError = "Failed to generate outfit image";

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const { data, error } = await supabase.functions.invoke("generate-outfit-image", {
        body: {
          prompt: outfitDescription,
          type: "full_outfit",
          sourceImageBase64: sourceGarmentImage,
        },
      });

      if (!error && !data?.error && data?.imageUrl) {
        return data.imageUrl;
      }

      lastError = data?.error || error?.message || lastError;

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
      }
    }

    throw new Error(lastError);
  };

  const generateFullOutfit = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setFailed(false);
    setImageUrl(null);

    try {
      const nextImageUrl = await invokeOutfitImage();
      if (requestId !== requestIdRef.current) return;
      setImageUrl(nextImageUrl);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setFailed(true);
      toast.error(error instanceof Error ? error.message : "Failed to generate outfit image");
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
  }, [outfitDescription, sourceGarmentImage, refreshKey]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated rounded-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <ImageIcon size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">Styled Look</h3>
            <p className="text-[11px] text-muted-foreground font-body">AI-generated outfit preview</p>
          </div>
        </div>
        <button
          onClick={onRefreshLook}
          disabled={loading}
          aria-label="Try another recommendation look"
          title="Try another recommendation look"
          className="w-10 h-10 rounded-xl border border-gold/15 bg-secondary/50 text-primary flex items-center justify-center hover:bg-primary/10 hover:border-gold/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
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
  const [styledLookRefreshKey, setStyledLookRefreshKey] = useState(0);

  useEffect(() => {
    setOutfitVariant({ bottom: 0, footwear: 0, accessories: 0 });
    setStyledLookRefreshKey(0);
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

  const fullOutfitDesc = (() => {
    const parts = [result.detectedItem];
    if (selectedBottom) parts.push(`${selectedBottom.color} ${selectedBottom.item}`);
    if (selectedFootwear) parts.push(`${selectedFootwear.color} ${selectedFootwear.item}`);
    if (selectedAccessory) parts.push(`${selectedAccessory.color} ${selectedAccessory.item}`);
    return parts.join(", ");
  })();

  useEffect(() => {
    onOutfitDescription(fullOutfitDesc);
  }, [fullOutfitDesc, onOutfitDescription]);

  const cycleOutfitVariant = () => {
    const bottomCount = result.suggestions.bottomWear?.length ?? 0;
    const footwearCount = result.suggestions.footwear?.length ?? 0;
    const accessoriesCount = result.suggestions.accessories?.length ?? 0;

    setOutfitVariant((prev) => ({
      bottom: bottomCount > 0 ? (prev.bottom + 1) % bottomCount : 0,
      footwear: footwearCount > 0 ? (prev.footwear + 1) % footwearCount : 0,
      accessories: accessoriesCount > 0 ? (prev.accessories + 1) % accessoriesCount : 0,
    }));
    setStyledLookRefreshKey((prev) => prev + 1);
  };

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
            onRefreshLook={cycleOutfitVariant}
            refreshKey={styledLookRefreshKey}
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
              />
            )}
            {result.suggestions.footwear?.length > 0 && (
              <SuggestionCard
                icon={Footprints}
                title="Footwear"
                items={result.suggestions.footwear}
                selectedIndex={outfitVariant.footwear}
                onSelectedIndexChange={(index) => setOutfitVariant((prev) => ({ ...prev, footwear: index }))}
              />
            )}
            {result.suggestions.accessories?.length > 0 && (
              <SuggestionCard
                icon={Watch}
                title="Accessories"
                items={result.suggestions.accessories}
                selectedIndex={outfitVariant.accessories}
                onSelectedIndexChange={(index) => setOutfitVariant((prev) => ({ ...prev, accessories: index }))}
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
