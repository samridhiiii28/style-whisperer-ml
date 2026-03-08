import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import OutfitForm from "@/components/OutfitForm";
import HowItWorks from "@/components/HowItWorks";
import ResultsDisplay, { type AIAnalysisResult } from "@/components/ResultsDisplay";
import VirtualTryOn from "@/components/VirtualTryOn";
import {
  extractDominantColors,
  classifyOccasion,
  generateRecommendations,
} from "@/ml";

const Index = () => {
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [outfitDescription, setOutfitDescription] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = async (imageBase64: string, description: string) => {
    setIsLoading(true);
    setResult(null);
    setUploadedImage(imageBase64);
    setOutfitDescription("");

    try {
      // ──────────────────────────────────────────────────────────
      // STEP 1: Color Detection (K-Means Clustering — client-side ML)
      // ──────────────────────────────────────────────────────────
      const detectedColors = await extractDominantColors(imageBase64, 4);
      const colors = detectedColors.map(c => ({ name: c.name, hex: c.hex }));

      // Build detected item name from dominant color + generic label
      const primaryColor = colors[0]?.name || "Unknown";
      const detectedItem = description
        ? `${primaryColor} clothing item`
        : `${primaryColor} clothing item`;

      // ──────────────────────────────────────────────────────────
      // STEP 2: Occasion Classification (Decision Tree — client-side ML)
      // ──────────────────────────────────────────────────────────
      const occasion = classifyOccasion(detectedItem, colors, description);

      // ──────────────────────────────────────────────────────────
      // STEP 3: Outfit Recommendation (Rule Engine — client-side ML)
      // ──────────────────────────────────────────────────────────
      const recommendations = generateRecommendations(
        detectedItem,
        colors,
        occasion.primary
      );

      // ──────────────────────────────────────────────────────────
      // STEP 4: Assemble results (API used ONLY for image generation later)
      // ──────────────────────────────────────────────────────────
      const analysisResult: AIAnalysisResult = {
        detectedItem,
        detectedColors: colors,
        occasion: {
          primary: occasion.primary,
          alternatives: occasion.alternatives,
          reasoning: occasion.reasoning,
        },
        suggestions: {
          bottomWear: recommendations.bottomWear,
          footwear: recommendations.footwear,
          accessories: recommendations.accessories,
        },
        colorCompatibility: recommendations.colorCompatibility,
        styleAnalysis: recommendations.styleAnalysis,
        overallScore: recommendations.colorCompatibility.score,
      };

      setResult(analysisResult);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("ML Analysis error:", err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutfitDescription = useCallback((desc: string) => {
    setOutfitDescription(desc);
  }, []);

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

      <div ref={resultsRef}>
        {result && (
          <ResultsDisplay
            result={result}
            uploadedImage={uploadedImage}
            onOutfitDescription={handleOutfitDescription}
          />
        )}
      </div>

      {/* Virtual Try-On - only show after results */}
      {result && outfitDescription && (
        <VirtualTryOn outfitDescription={outfitDescription} />
      )}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-xl mb-2">
            <span className="text-gradient-gold">Fashn</span>-Match
          </p>
          <p className="text-xs text-muted-foreground font-body tracking-wider">
            ML-Powered Fashion Intelligence · K-Means Color Detection · Decision Tree Classification · Random Forest Compatibility
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
