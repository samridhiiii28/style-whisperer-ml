import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TreePine, Brain, TrendingUp, Heart, RotateCcw } from "lucide-react";
import { evaluateOutfitCompatibility, type OutfitItem, type CompatibilityResult } from "@/ml/randomForestModel";
import { recordInteraction, getPredictions, resetPreferences, scoreItemForUser, type PreferencePrediction } from "@/ml/preferenceLearningModel";
import type { AIAnalysisResult } from "./ResultsDisplay";

interface MLInsightsPanelProps {
  result: AIAnalysisResult;
}

const MiniScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-body text-muted-foreground w-28 shrink-0">{label}</span>
    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
    <span className="text-xs font-body text-foreground w-8 text-right">{score}</span>
  </div>
);

const MLInsightsPanel = ({ result }: MLInsightsPanelProps) => {
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [predictions, setPredictions] = useState<PreferencePrediction | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Run Random Forest model on mount
  useEffect(() => {
    const items: OutfitItem[] = [];

    // Detected item as top
    items.push({
      name: result.detectedItem,
      color: result.detectedColors[0]?.name || "unknown",
      hex: result.detectedColors[0]?.hex,
      category: "top",
    });

    // First suggestion from each category
    const bottom = result.suggestions.bottomWear?.[0];
    if (bottom) items.push({ name: bottom.item, color: bottom.color, category: "bottom" });

    const shoes = result.suggestions.footwear?.[0];
    if (shoes) items.push({ name: shoes.item, color: shoes.color, category: "footwear" });

    const acc = result.suggestions.accessories?.[0];
    if (acc) items.push({ name: acc.item, color: acc.color, category: "accessory" });

    const compat = evaluateOutfitCompatibility(items);
    setCompatibility(compat);

    // Load user predictions
    setPredictions(getPredictions());
  }, [result]);

  const handleLikeItem = (itemName: string, color: string, category: string) => {
    const key = `${itemName}-${color}`;
    const newLiked = new Set(likedItems);
    const isLiked = newLiked.has(key);
    
    if (isLiked) {
      newLiked.delete(key);
      recordInteraction(itemName, color, category, false);
    } else {
      newLiked.add(key);
      recordInteraction(itemName, color, category, true);
    }
    
    setLikedItems(newLiked);
    setPredictions(getPredictions());
  };

  const handleReset = () => {
    resetPreferences();
    setLikedItems(new Set());
    setPredictions(getPredictions());
  };

  // Collect all suggestion items for preference learning
  const allItems = [
    ...result.suggestions.bottomWear.map(i => ({ ...i, category: "bottom" })),
    ...result.suggestions.footwear.map(i => ({ ...i, category: "footwear" })),
    ...result.suggestions.accessories.map(i => ({ ...i, category: "accessory" })),
  ];

  return (
    <div className="space-y-6">
      {/* Random Forest Model Card */}
      {compatibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-gold/10 rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TreePine size={18} className="text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Random Forest Compatibility Model
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-5">
            Ensemble of {7} decision trees evaluating color harmony, style coherence &amp; occasion fit
          </p>

          {/* Overall score */}
          <div className="flex items-center gap-4 mb-5 p-4 bg-secondary/50 rounded-sm">
            <div className="relative w-16 h-16">
              <svg width="64" height="64" className="-rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                <motion.circle
                  cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--gold))" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 26}
                  initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - compatibility.overallScore / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-lg font-bold text-foreground">{compatibility.overallScore}</span>
              </div>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-foreground">Outfit Compatibility</p>
              <p className="text-xs text-muted-foreground font-body">
                Confidence: {compatibility.confidence}% · {compatibility.treeVotes.length} trees voted
              </p>
            </div>
          </div>

          {/* Sub-scores */}
          <div className="space-y-3 mb-5">
            <MiniScoreBar label="Color Harmony" score={compatibility.colorHarmony} color="hsl(var(--gold))" />
            <MiniScoreBar label="Style Coherence" score={compatibility.styleCoherence} color="hsl(var(--champagne))" />
            <MiniScoreBar label="Occasion Fit" score={compatibility.occasionFit} color="hsl(var(--gold-light))" />
          </div>

          {/* Tree votes */}
          <div className="mb-4">
            <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-2">
              Individual Tree Votes
            </p>
            <div className="flex gap-2">
              {compatibility.treeVotes.map((vote, i) => (
                <div
                  key={i}
                  className="flex-1 bg-secondary rounded-sm p-2 text-center"
                  title={`Tree ${i + 1}: ${vote}`}
                >
                  <p className="text-[10px] text-muted-foreground font-body">T{i + 1}</p>
                  <p className="text-sm font-display font-semibold text-foreground">{vote}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-2">
            {compatibility.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <TrendingUp size={12} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground font-body">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* User Preference Learning Model Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border border-gold/10 rounded-sm p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              User Preference Learning Model
            </h3>
          </div>
          {predictions && predictions.totalInteractions > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1"
              title="Reset learned preferences"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-body mb-5">
          Learns your style from interactions · Adapts recommendations over time · On-device processing
        </p>

        {/* Like items to train */}
        <div className="mb-5">
          <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-3">
            Like items to train the model
          </p>
          <div className="flex flex-wrap gap-2">
            {allItems.map((item, i) => {
              const key = `${item.item}-${item.color}`;
              const isLiked = likedItems.has(key);
              const matchScore = predictions && predictions.totalInteractions > 0
                ? scoreItemForUser(item.item, item.color, item.category)
                : null;

              return (
                <button
                  key={i}
                  onClick={() => handleLikeItem(item.item, item.color, item.category)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-body border transition-all duration-200 flex items-center gap-1.5 ${
                    isLiked
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-gold/20 text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  <Heart size={12} className={isLiked ? "fill-primary" : ""} />
                  {item.item}
                  {matchScore !== null && (
                    <span className="text-[10px] opacity-60">{matchScore}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Learned preferences display */}
        {predictions && predictions.totalInteractions > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm">
              <div className="text-center">
                <p className="font-display text-lg font-bold text-foreground">{predictions.totalInteractions}</p>
                <p className="text-[10px] text-muted-foreground font-body">Interactions</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-sm font-body text-foreground font-medium">{predictions.personalityType}</p>
                <p className="text-xs text-muted-foreground font-body">{predictions.adaptationLevel}</p>
              </div>
            </div>

            {predictions.topColors.length > 0 && (
              <div>
                <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-2">
                  Preferred Colors
                </p>
                <div className="flex flex-wrap gap-2">
                  {predictions.topColors.map((c, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary rounded-sm text-xs font-body text-foreground">
                      {c.color} <span className="text-muted-foreground">({c.score}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {predictions.preferredStyles.length > 0 && (
              <div>
                <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-2">
                  Style Profile
                </p>
                <div className="space-y-2">
                  {predictions.preferredStyles.map((s, i) => (
                    <MiniScoreBar key={i} label={s.trait} score={s.score} color="hsl(var(--primary))" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground font-body">
              Like some items above to start training your style profile
            </p>
            <p className="text-xs text-muted-foreground/60 font-body mt-1">
              The model adapts with each interaction
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MLInsightsPanel;
