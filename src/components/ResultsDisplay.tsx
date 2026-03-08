import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Calendar, Shirt, Footprints, Watch, Lightbulb, Check, Loader2, ImageIcon } from "lucide-react";
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
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-xs tracking-wider uppercase text-muted-foreground font-body">{label}</span>
    </div>
  );
};

// Component for generating & displaying an item image
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
    <div className="w-full h-48 rounded-sm border border-gold/20 bg-card/50 flex items-center justify-center overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={itemName} className="w-full h-full object-contain" />
      ) : loading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={20} className="text-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-body">Generating...</span>
        </div>
      ) : failed ? (
        <button onClick={generateImage} className="text-xs text-muted-foreground font-body hover:text-primary transition-colors">
          Retry
        </button>
      ) : null}
    </div>
  );
};

const SuggestionCard = ({ icon: Icon, title, items }: { 
  icon: React.ElementType; 
  title: string; 
  items: { item: string; color: string; reason: string }[] 
}) => (
  <div className="bg-card border border-gold/10 rounded-sm p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon size={18} className="text-primary" />
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-4 p-3 bg-secondary/50 rounded-sm">
          <ItemImageCard itemName={item.item} itemColor={item.color} />
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <Check size={14} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-body text-foreground font-medium">
                  {item.item} <span className="text-muted-foreground">— {item.color}</span>
                </p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{item.reason}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Full outfit model image
const FullOutfitImage = ({ outfitDescription }: { outfitDescription: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const generateFullOutfit = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const { data, error } = await supabase.functions.invoke("generate-outfit-image", {
        body: { prompt: outfitDescription, type: "full_outfit" },
      });
      if (error || data?.error) {
        setFailed(true);
        toast.error("Failed to generate outfit image");
      } else {
        setImageUrl(data.imageUrl);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon size={18} className="text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">AI Styled Look</h3>
      </div>
      
      {imageUrl ? (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="AI generated full outfit"
            className="max-h-[500px] object-contain rounded-sm border border-gold/20"
          />
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 size={32} className="text-primary animate-spin" />
          <p className="text-sm font-body text-muted-foreground">Generating full outfit on model...</p>
          <p className="text-xs font-body text-muted-foreground/60">This may take 15-30 seconds</p>
        </div>
      ) : failed ? (
        <div className="flex flex-col items-center justify-center h-32 gap-3">
          <p className="text-sm font-body text-muted-foreground">Failed to generate. Try again?</p>
          <button
            onClick={generateFullOutfit}
            className="px-4 py-2 border border-gold/30 rounded-sm text-xs text-primary font-body hover:bg-primary/10 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <p className="text-sm font-body text-muted-foreground text-center max-w-md">
            Generate an AI model wearing your complete suggested outfit
          </p>
          <button
            onClick={generateFullOutfit}
            className="px-6 py-3 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-xs rounded-sm hover:bg-gold-light transition-colors glow-gold flex items-center gap-2"
          >
            <ImageIcon size={14} />
            Generate Styled Look
          </button>
        </div>
      )}
    </div>
  );
};

const ResultsDisplay = ({ result, uploadedImage, onOutfitDescription }: ResultsDisplayProps) => {
  // Build full outfit description for image generation and try-on
  useEffect(() => {
    const topItem = result.detectedItem;
    const bottom = result.suggestions.bottomWear?.[0];
    const shoes = result.suggestions.footwear?.[0];
    const acc = result.suggestions.accessories?.[0];
    
    const parts = [topItem];
    if (bottom) parts.push(`${bottom.color} ${bottom.item}`);
    if (shoes) parts.push(`${shoes.color} ${shoes.item}`);
    if (acc) parts.push(`${acc.color} ${acc.item}`);
    
    onOutfitDescription(parts.join(", "));
  }, [result, onOutfitDescription]);

  const fullOutfitDesc = (() => {
    const topItem = result.detectedItem;
    const bottom = result.suggestions.bottomWear?.[0];
    const shoes = result.suggestions.footwear?.[0];
    const acc = result.suggestions.accessories?.[0];
    const parts = [topItem];
    if (bottom) parts.push(`${bottom.color} ${bottom.item}`);
    if (shoes) parts.push(`${shoes.color} ${shoes.item}`);
    if (acc) parts.push(`${acc.color} ${acc.item}`);
    return parts.join(", ");
  })();

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-bold text-center mb-12">
            <span className="text-gradient-gold">AI Analysis</span> Results
          </h2>

          {/* Detected item + image */}
          <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6 flex flex-col sm:flex-row gap-6 items-center">
            <img
              src={uploadedImage}
              alt="Analyzed clothing"
              className="w-32 h-32 object-contain rounded-sm border border-gold/20"
            />
            <div>
              <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-1">Detected Item</p>
              <p className="font-display text-xl font-semibold text-foreground">{result.detectedItem}</p>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-gold/10 rounded-sm p-6 flex flex-col items-center">
              <ScoreRing score={result.overallScore} label="Overall Score" />
            </div>
            <div className="bg-card border border-gold/10 rounded-sm p-6 flex flex-col items-center">
              <ScoreRing score={result.colorCompatibility.score} label="Color Score" />
            </div>
          </div>

          {/* Detected Colors */}
          <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={18} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Detected Colors</h3>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {result.detectedColors.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border border-gold/20 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-body text-muted-foreground">{color.name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.colorCompatibility.analysis}
            </p>
          </div>

          {/* Occasion */}
          <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Occasion Prediction</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-body font-medium">
                {result.occasion.primary}
              </span>
              {result.occasion.alternatives.map((alt) => (
                <span key={alt} className="px-3 py-1 border border-gold/20 rounded-full text-xs text-muted-foreground font-body">
                  {alt}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.occasion.reasoning}
            </p>
          </div>

          {/* Full Outfit AI Image */}
          <FullOutfitImage outfitDescription={fullOutfitDesc} />

          {/* Suggestions with images */}
          <div className="space-y-6 mb-6">
            {result.suggestions.bottomWear?.length > 0 && (
              <SuggestionCard icon={Shirt} title="Suggested Bottom Wear" items={result.suggestions.bottomWear} />
            )}
            {result.suggestions.footwear?.length > 0 && (
              <SuggestionCard icon={Footprints} title="Suggested Footwear" items={result.suggestions.footwear} />
            )}
            {result.suggestions.accessories?.length > 0 && (
              <SuggestionCard icon={Watch} title="Suggested Accessories" items={result.suggestions.accessories} />
            )}
          </div>

          {/* Style Analysis */}
          <div className="bg-card border border-gold/10 rounded-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Style Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.styleAnalysis}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
