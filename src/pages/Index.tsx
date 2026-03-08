import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import OutfitForm from "@/components/OutfitForm";
import HowItWorks from "@/components/HowItWorks";
import ResultsDisplay, { type AnalysisResult } from "@/components/ResultsDisplay";
import { analyzeOutfit } from "@/lib/fashionAnalyzer";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedItems, setAnalyzedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = (items: string[]) => {
    setIsLoading(true);
    setResult(null);

    // Simulate ML processing time
    setTimeout(() => {
      const analysis = analyzeOutfit(items);
      setResult(analysis);
      setAnalyzedItems(items);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-glass border-b border-gold/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">
            <span className="text-gradient-gold">Fashn</span>
            <span className="text-foreground">-Match</span>
          </span>
          <button
            onClick={scrollToForm}
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-primary font-body transition-colors"
          >
            Try Now
          </button>
        </div>
      </nav>

      <HeroSection onGetStarted={scrollToForm} />
      <HowItWorks />

      <div ref={formRef}>
        <OutfitForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      </div>

      {result && <ResultsDisplay result={result} items={analyzedItems} />}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-xl mb-2">
            <span className="text-gradient-gold">Fashn</span>-Match
          </p>
          <p className="text-xs text-muted-foreground font-body tracking-wider">
            ML-Powered Fashion Intelligence · Color Compatibility · Occasion Prediction
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
