import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, User, Sparkles, X, Loader2, Droplets, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analyzeSkinTone, recommendLipShades, type LipAnalysisResult } from "@/ml/lipShadeAnalyzer";

interface VirtualTryOnProps {
  outfitDescription: string;
  referenceGarmentImage?: string;
}

const VirtualTryOn = ({ outfitDescription, referenceGarmentImage }: VirtualTryOnProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResults, setTryOnResults] = useState<string[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lipAnalysis, setLipAnalysis] = useState<LipAnalysisResult | null>(null);
  const [lipAnalyzing, setLipAnalyzing] = useState(false);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxResults = 4;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUserImage(result);
      setTryOnResults([]);
      setCurrentResultIndex(0);
      setLipAnalysis(null);
      setSelectedShadeIndex(0);
      analyzeLipShades(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeLipShades = async (imageData: string) => {
    setLipAnalyzing(true);
    try {
      const skinTone = await analyzeSkinTone(imageData);
      const recommendations = recommendLipShades(skinTone);
      setLipAnalysis({ skinTone, recommendations });
    } catch (err) {
      console.error("Lip shade analysis error:", err);
      toast.error("Could not analyze skin tone");
    } finally {
      setLipAnalyzing(false);
    }
  };

  const removeImage = () => {
    setUserImage(null);
    setTryOnResults([]);
    setCurrentResultIndex(0);
    setLipAnalysis(null);
    setSelectedShadeIndex(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTryOn = useCallback(async () => {
    if (!userImage) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: {
          userImageBase64: userImage,
          outfitDescription,
          garmentImageBase64: referenceGarmentImage,
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Virtual try-on failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setTryOnResults((prev) => {
        const next = [...prev, data.imageUrl];
        setCurrentResultIndex(next.length - 1);
        return next.length > maxResults ? next.slice(-maxResults) : next;
      });
    } catch (err) {
      console.error("Try-on error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userImage, outfitDescription, referenceGarmentImage]);

  // Auto-generate first try-on when user uploads photo
  useEffect(() => {
    if (userImage && tryOnResults.length === 0) {
      handleTryOn();
    }
  }, [userImage]);

  const currentResult = tryOnResults[currentResultIndex] ?? null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-bold text-center mb-3">
            <span className="text-gradient-gold">Virtual</span> Try-On
          </h2>
          <p className="text-muted-foreground text-center mb-10 font-body">
            Upload your photo — see yourself in the outfit and get personalized lip shade recommendations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User photo upload */}
            <div>
              <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-3">
                Your Photo
              </p>
              {!userImage ? (
                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gold/30 rounded-sm bg-card/50 cursor-pointer hover:border-primary/50 transition-colors group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <User size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-body text-foreground">Upload your photo</p>
                      <p className="text-xs font-body text-muted-foreground mt-1">Full body or face photo</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={userImage}
                    alt="Your photo"
                    className="w-full h-80 object-contain rounded-sm border border-gold/20 bg-card"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 border border-gold/20 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  >
                    <X size={16} className="text-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Try-on result */}
            <div>
              <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-3">
                Try-On Result
              </p>
              <div className="w-full h-80 border border-gold/20 rounded-sm bg-card/50 flex items-center justify-center overflow-hidden relative">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <p className="text-sm font-body text-muted-foreground">Generating try-on...</p>
                    <p className="text-xs font-body text-muted-foreground/60">This may take 15-30 seconds</p>
                  </div>
                ) : currentResult ? (
                  <>
                    <img
                      src={currentResult}
                      alt="Virtual try-on result"
                      className="w-full h-full object-contain"
                    />
                    {/* Navigation arrows for multiple results */}
                    {tryOnResults.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentResultIndex((i) => Math.max(0, i - 1))}
                          disabled={currentResultIndex === 0}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 border border-gold/20 flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-30"
                        >
                          <ChevronLeft size={16} className="text-foreground" />
                        </button>
                        <button
                          onClick={() => setCurrentResultIndex((i) => Math.min(tryOnResults.length - 1, i + 1))}
                          disabled={currentResultIndex === tryOnResults.length - 1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 border border-gold/20 flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-30"
                        >
                          <ChevronRight size={16} className="text-foreground" />
                        </button>
                        {/* Dots indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {tryOnResults.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentResultIndex(i)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                i === currentResultIndex ? "bg-primary scale-125" : "bg-muted-foreground/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                    <Upload size={24} />
                    <p className="text-xs font-body">Upload your photo to start</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outfit description + refresh */}
          <div className="mt-6 p-4 bg-card border border-gold/10 rounded-sm flex items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-1">Outfit to try on</p>
              <p className="text-sm font-body text-foreground">{outfitDescription}</p>
            </div>
            {userImage && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-body">
                  {tryOnResults.length}/{maxResults}
                </span>
                <button
                  onClick={handleTryOn}
                  disabled={isLoading || tryOnResults.length >= maxResults}
                  title="Generate another try-on look"
                  className="w-9 h-9 rounded-full border border-gold/30 bg-secondary/50 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            )}
          </div>

          {/* Lip Shade Recommendation Section */}
          {userImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12"
            >
              <div className="bg-card border border-gold/10 rounded-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Droplets size={18} className="text-primary" />
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Lip Shade Recommendations
                  </h3>
                   <span className="ml-auto px-2 py-0.5 bg-secondary rounded-full text-[10px] tracking-wider uppercase text-muted-foreground font-body">
                     Smart Analysis
                   </span>
                </div>

                {lipAnalyzing ? (
                  <div className="flex items-center gap-3 py-8 justify-center">
                    <Loader2 size={20} className="text-primary animate-spin" />
                    <p className="text-sm font-body text-muted-foreground">Analyzing your skin tone...</p>
                  </div>
                ) : lipAnalysis ? (
                  <>
                    <div className="flex items-center gap-4 mb-6 p-4 bg-secondary/50 rounded-sm">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-gold/30 shadow-md"
                        style={{ backgroundColor: lipAnalysis.skinTone.skinToneHex }}
                      />
                      <div>
                        <p className="text-sm font-body text-foreground font-medium">
                          {lipAnalysis.skinTone.skinCategory} Skin · {lipAnalysis.skinTone.undertone.charAt(0).toUpperCase() + lipAnalysis.skinTone.undertone.slice(1)} Undertone
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          Detected: {lipAnalysis.skinTone.skinToneHex}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-2 block">
                        Select Shade
                      </label>
                      <select
                        value={selectedShadeIndex}
                        onChange={(e) => setSelectedShadeIndex(Number(e.target.value))}
                        className="w-full bg-secondary border border-gold/20 rounded-sm px-4 py-2.5 text-sm font-body text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {lipAnalysis.recommendations.map((shade, i) => (
                          <option key={i} value={i} className="bg-card text-foreground">
                            {shade.name} — {shade.finish}
                          </option>
                        ))}
                      </select>
                    </div>

                    {lipAnalysis.recommendations[selectedShadeIndex] && (
                      <motion.div
                        key={selectedShadeIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 bg-secondary/50 rounded-sm"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-16 h-16 rounded-full border-2 border-gold/30 shadow-lg"
                            style={{ backgroundColor: lipAnalysis.recommendations[selectedShadeIndex].hex }}
                          />
                          <div>
                            <p className="font-display text-lg font-semibold text-foreground">
                              {lipAnalysis.recommendations[selectedShadeIndex].name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-body">
                                {lipAnalysis.recommendations[selectedShadeIndex].finish}
                              </span>
                              <span className="text-xs text-muted-foreground font-body">
                                {lipAnalysis.recommendations[selectedShadeIndex].hex}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-body leading-relaxed">
                          {lipAnalysis.recommendations[selectedShadeIndex].reason}
                        </p>
                      </motion.div>
                    )}

                    <div className="mt-4 flex gap-3 justify-center">
                      {lipAnalysis.recommendations.map((shade, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedShadeIndex(i)}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                            i === selectedShadeIndex
                              ? "border-primary scale-110 shadow-lg"
                              : "border-gold/20 hover:border-gold/50"
                          }`}
                          style={{ backgroundColor: shade.hex }}
                          title={shade.name}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOn;
