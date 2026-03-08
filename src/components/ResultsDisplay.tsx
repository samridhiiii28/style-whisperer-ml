import { motion } from "framer-motion";
import { Check, AlertTriangle, Palette, Calendar, Lightbulb } from "lucide-react";

export interface AnalysisResult {
  overallScore: number;
  colorCompatibility: {
    score: number;
    analysis: string;
    palette: string[];
  };
  occasionPrediction: {
    primary: string;
    alternatives: string[];
    reasoning: string;
  };
  suggestions: string[];
  styleAnalysis: string;
}

interface ResultsDisplayProps {
  result: AnalysisResult;
  items: string[];
}

const ScoreRing = ({ score, label }: { score: number; label: string }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "hsl(var(--gold))" : score >= 50 ? "hsl(var(--champagne))" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-2">
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
      <div className="absolute flex flex-col items-center justify-center" style={{ width: 100, height: 100 }}>
        <span className="font-display text-2xl font-bold text-foreground">{score}</span>
      </div>
      <span className="text-xs tracking-wider uppercase text-muted-foreground font-body">{label}</span>
    </div>
  );
};

const ResultsDisplay = ({ result, items }: ResultsDisplayProps) => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-bold text-center mb-12">
            <span className="text-gradient-gold">Analysis</span> Results
          </h2>

          {/* Score cards */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-gold/10 rounded-sm p-6 flex flex-col items-center relative">
              <ScoreRing score={result.overallScore} label="Overall Match" />
            </div>
            <div className="bg-card border border-gold/10 rounded-sm p-6 flex flex-col items-center relative">
              <ScoreRing score={result.colorCompatibility.score} label="Color Score" />
            </div>
          </div>

          {/* Color analysis */}
          <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={18} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Color Compatibility</h3>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
              {result.colorCompatibility.analysis}
            </p>
            <div className="flex gap-2">
              {result.colorCompatibility.palette.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border border-gold/20"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Occasion prediction */}
          <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Occasion Prediction</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-body font-medium">
                {result.occasionPrediction.primary}
              </span>
              {result.occasionPrediction.alternatives.map((alt) => (
                <span key={alt} className="px-3 py-1 border border-gold/20 rounded-full text-xs text-muted-foreground font-body">
                  {alt}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.occasionPrediction.reasoning}
            </p>
          </div>

          {/* Style analysis */}
          <div className="bg-card border border-gold/10 rounded-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Check size={18} className="text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">Style Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {result.styleAnalysis}
            </p>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="bg-card border border-gold/10 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                    <AlertTriangle size={14} className="text-primary mt-0.5 shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Items analyzed */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mb-2">Items Analyzed</p>
            <div className="flex flex-wrap justify-center gap-2">
              {items.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground font-body">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
