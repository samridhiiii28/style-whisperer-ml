import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, User, Sparkles, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VirtualTryOnProps {
  outfitDescription: string;
}

const VirtualTryOn = ({ outfitDescription }: VirtualTryOnProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUserImage(reader.result as string);
      setTryOnResult(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUserImage(null);
    setTryOnResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTryOn = async () => {
    if (!userImage) return;
    setIsLoading(true);
    setTryOnResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: { userImageBase64: userImage, outfitDescription },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Virtual try-on failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setTryOnResult(data.imageUrl);
    } catch (err) {
      console.error("Try-on error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Upload your photo and see yourself wearing the suggested outfit
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
                      <p className="text-xs font-body text-muted-foreground mt-1">Full body photo works best</p>
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
                AI Try-On Result
              </p>
              <div className="w-full h-80 border border-gold/20 rounded-sm bg-card/50 flex items-center justify-center overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <p className="text-sm font-body text-muted-foreground">Generating try-on...</p>
                    <p className="text-xs font-body text-muted-foreground/60">This may take 15-30 seconds</p>
                  </div>
                ) : tryOnResult ? (
                  <img
                    src={tryOnResult}
                    alt="Virtual try-on result"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                    <Upload size={24} />
                    <p className="text-xs font-body">Upload your photo to start</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outfit description shown */}
          <div className="mt-6 p-4 bg-card border border-gold/10 rounded-sm">
            <p className="text-xs tracking-wider uppercase text-muted-foreground font-body mb-1">Outfit to try on</p>
            <p className="text-sm font-body text-foreground">{outfitDescription}</p>
          </div>

          {/* Try-on button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleTryOn}
              disabled={!userImage || isLoading}
              className="px-10 py-4 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light transition-colors duration-300 glow-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
            >
              <Sparkles size={16} />
              {isLoading ? "Generating..." : "Try On This Outfit"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOn;
