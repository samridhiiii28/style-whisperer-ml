import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, LogIn, LogOut, User, History, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const [showAuthGate, setShowAuthGate] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading } = useAuth();

  const scrollToForm = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveToHistory = async (analysisResult: AIAnalysisResult, imageBase64: string, description: string) => {
    if (!user) return;
    try {
      await supabase.from("analysis_history").insert({
        user_id: user.id,
        detected_item: analysisResult.detectedItem,
        detected_colors: analysisResult.detectedColors as any,
        occasion: analysisResult.occasion as any,
        suggestions: analysisResult.suggestions as any,
        color_compatibility: analysisResult.colorCompatibility as any,
        style_analysis: analysisResult.styleAnalysis,
        overall_score: analysisResult.overallScore,
        uploaded_image: imageBase64,
        description,
      });
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  };

  const handleAnalyze = async (imageBase64: string, description: string) => {
    setIsLoading(true);
    setResult(null);
    setUploadedImage(imageBase64);
    setOutfitDescription("");

    try {
      const analysisResult = await runFashionMLAnalysis(imageBase64, description);
      setResult(analysisResult);
      await saveToHistory(analysisResult, imageBase64, description);
      toast.success("Analysis saved to your history!");
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
    <div className="min-h-screen bg-background noise-overlay">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-glass-heavy border-b border-gold/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-xl font-bold tracking-tight"
          >
            <span className="text-gradient-gold">Fashn</span>
            <span className="text-foreground/80">-Match</span>
          </motion.span>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToForm}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground font-body transition-colors duration-300"
            >
              Try Now
            </button>

            {user && (
              <button
                onClick={() => navigate("/history")}
                className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground font-body transition-colors duration-300"
              >
                <Clock size={12} />
                History
              </button>
            )}

            <button
              onClick={scrollToForm}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-gold/15 text-primary text-xs font-body font-medium tracking-wider uppercase hover:bg-primary/20 hover:border-gold/25 transition-all duration-300"
            >
              <Sparkles size={12} />
              Analyze
            </button>

            {/* Auth buttons */}
            {authLoading ? null : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User size={14} className="text-primary" />
                  )}
                  <span className="text-xs font-body text-foreground/80 hidden sm:inline max-w-[100px] truncate">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-gold/20 transition-all duration-300 text-xs font-body"
                >
                  <LogOut size={12} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary-premium text-primary-foreground text-xs font-body font-semibold tracking-wider uppercase"
              >
                <LogIn size={12} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <HeroSection onGetStarted={scrollToForm} />
      <HowItWorks />

      {/* Only show form & results for authenticated users */}
      {user && (
        <div ref={formRef}>
          <OutfitForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      )}

      {user && (
        <>
          <div ref={resultsRef}>
            {result && (
              <ResultsDisplay
                result={result}
                uploadedImage={uploadedImage}
                onOutfitDescription={handleOutfitDescription}
              />
            )}
          </div>

          {result && outfitDescription && (
            <VirtualTryOn
              outfitDescription={outfitDescription}
              referenceGarmentImage={uploadedImage}
            />
          )}
        </>
      )}

      {/* Footer */}
      <footer className="relative py-16 px-6">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-2xl font-bold mb-3">
            <span className="text-gradient-gold">Fashn</span>
            <span className="text-foreground/60">-Match</span>
          </p>
          <p className="text-xs text-muted-foreground/60 font-body tracking-wider max-w-md mx-auto leading-relaxed">
            ML-Powered Fashion Intelligence · Color Detection · Style Classification · AI Outfit Generation
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {["K-Means", "Decision Tree", "Random Forest", "Neural Networks"].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full border border-gold/8 text-[10px] tracking-wider uppercase text-muted-foreground/40 font-body">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
