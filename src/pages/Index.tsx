import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import OutfitForm from "@/components/OutfitForm";
import HowItWorks from "@/components/HowItWorks";
import ResultsDisplay, { type AIAnalysisResult } from "@/components/ResultsDisplay";
import VirtualTryOn from "@/components/VirtualTryOn";
import { runFashionMLAnalysis } from "@/ml";

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
      const analysisResult = await runFashionMLAnalysis(imageBase64, description);

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
        <VirtualTryOn
          outfitDescription={outfitDescription}
          referenceGarmentImage={uploadedImage}
        />
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
