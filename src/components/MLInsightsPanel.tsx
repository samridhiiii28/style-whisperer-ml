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
    <div className="flex-1 h-2 bg-secondary/80 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
    <span className="text-xs font-body text-foreground w-8 text-right tabular-nums">{score}</span>
  </div>
);

const MLInsightsPanel = ({ result }: MLInsightsPanelProps) => {
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [predictions, setPredictions] = useState<PreferencePrediction | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const items: OutfitItem[] = [];
    items.push({
      name: result.detectedItem,
      color: result.detectedColors[0]?.name || "unknown",
      hex: result.detectedColors[0]?.hex,
      category: "top",
    });
    const bottom = result.suggestions.bottomWear?.[0];
    if (bottom) items.push({ name: bottom.item, color: bottom.color, category: "bottom" });
    const shoes = result.suggestions.footwear?.[0];
    if (shoes) items.push({ name: shoes.item, color: shoes.color, category: "footwear" });
    const acc = result.suggestions.accessories?.[0];
    if (acc) items.push({ name: acc.item, color: acc.color, category: "accessory" });

    const compat = evaluateOutfitCompatibility(items);
    setCompatibility(compat);
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
          className="card-elevated rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <TreePine size={16} className="text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Random Forest Model
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-6 ml-12">
            Ensemble of {7} decision trees evaluating color harmony, style coherence &amp; occasion fit
          </p>

          <div className="flex items-center gap-4 mb-6 p-4 bg-secondary/30 rounded-lg border border-gold/8">
            <div className="relative w-16 h-16">
              <svg width="64" height="64" className="-rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
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

          <div className="space-y-3 mb-6">
            <MiniScoreBar label="Color Harmony" score={compatibility.colorHarmony} color="hsl(var(--gold))" />
            <MiniScoreBar label="Style Coherence" score={compatibility.styleCoherence} color="hsl(var(--champagne))" />
            <MiniScoreBar label="Occasion Fit" score={compatibility.occasionFit} color="hsl(var(--gold-light))" />
          </div>

          <div className="mb-5">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-3">
              Individual Tree Votes
            </p>
            <div className="flex gap-2">
              {compatibility.treeVotes.map((vote, i) => (
                <div
                  key={i}
                  className="flex-1 bg-secondary/50 rounded-lg p-2.5 text-center border border-gold/5"
                  title={`Tree ${i + 1}: ${vote}`}
                >
                  <p className="text-[10px] text-muted-foreground/60 font-body">T{i + 1}</p>
                  <p className="text-sm font-display font-bold text-foreground">{vote}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {compatibility.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <TrendingUp size={12} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{insight}</p>
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
        className="card-elevated rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain size={16} className="text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Preference Learning
            </h3>
          </div>
          {predictions && predictions.totalInteractions > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5"
              title="Reset learned preferences"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-body mb-6 ml-12">
          Learns your style from interactions · Adapts recommendations over time
        </p>

        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-3">
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
                  className={`px-3 py-2 rounded-lg text-xs font-body border transition-all duration-300 flex items-center gap-2 ${
                    isLiked
                      ? "border-primary/30 bg-primary/15 text-primary"
                      : "border-gold/10 bg-secondary/30 text-muted-foreground hover:border-gold/25 hover:bg-secondary/50"
                  }`}
                >
                  <Heart size={12} className={isLiked ? "fill-primary" : ""} />
                  {item.item}
                  {matchScore !== null && (
                    <span className="text-[10px] opacity-50 tabular-nums">{matchScore}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {predictions && predictions.totalInteractions > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border border-gold/8">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-foreground">{predictions.totalInteractions}</p>
                <p className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">Interactions</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm font-body text-foreground font-medium">{predictions.personalityType}</p>
                <p className="text-xs text-muted-foreground font-body">{predictions.adaptationLevel}</p>
              </div>
            </div>

            {predictions.topColors.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-3">
                  Preferred Colors
                </p>
                <div className="flex flex-wrap gap-2">
                  {predictions.topColors.map((c, i) => (
                    <span key={i} className="px-3 py-1.5 bg-secondary/50 rounded-lg text-xs font-body text-foreground border border-gold/8">
                      {c.color} <span className="text-muted-foreground/60">({c.score}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {predictions.preferredStyles.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-3">
                  Style Profile
                </p>
                <div className="space-y-2.5">
                  {predictions.preferredStyles.map((s, i) => (
                    <MiniScoreBar key={i} label={s.trait} score={s.score} color="hsl(var(--primary))" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground font-body">
              Like some items above to start training your style profile
            </p>
            <p className="text-xs text-muted-foreground/40 font-body mt-1.5">
              The model adapts with each interaction
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MLInsightsPanel;
