import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, Image as ImageIcon, X, Camera, FlaskConical } from "lucide-react";
import testShirt from "@/assets/demo/test-shirt.jpg";

interface OutfitFormProps {
  onAnalyze: (imageBase64: string, description: string) => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  "Suggest matching bottom wear and accessories for office",
  "What shoes and accessories go with this for college?",
  "Style this for a date night with matching bottoms",
  "Suggest casual outfit pieces to go with this",
];

const OutfitForm = ({ onAnalyze, isLoading }: OutfitFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!imageBase64) return;
    onAnalyze(imageBase64, description || "Suggest me matching bottom wear and accessories");
  };

  const testDemoMode = async () => {
    const response = await fetch(testShirt);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
      onAnalyze(result, "Suggest matching bottom wear and accessories for office");
    };
    reader.readAsDataURL(blob);
  };

  const usePrompt = (prompt: string) => {
    setDescription(prompt);
  };

  return (
    <section id="analyzer" className="relative py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Analyzer</span>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-gold">Upload</span> Your Clothing
            </h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
              Upload a clothing image and tell us what you need — we'll handle the rest.
            </p>
          </div>

          {/* Image Upload Area */}
          <div className="mb-8">
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gold/15 rounded-xl bg-card/30 cursor-pointer hover:border-primary/30 hover:bg-card/50 transition-all duration-500 group">
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-primary/10 border border-gold/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-gold/20 transition-all duration-500"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <Camera size={28} className="text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-body text-foreground font-medium">Drop your clothing image here</p>
                    <p className="text-xs font-body text-muted-foreground mt-1.5">JPG, PNG, WebP · Max 5MB</p>
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative card-elevated rounded-xl overflow-hidden"
              >
                <img
                  src={imagePreview}
                  alt="Uploaded clothing"
                  className="w-full max-h-80 object-contain bg-card p-4"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-card/90 border border-gold/20 flex items-center justify-center hover:bg-destructive/20 hover:border-destructive/30 transition-all duration-300"
                >
                  <X size={16} className="text-foreground" />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-card/90 rounded-lg border border-gold/10">
                  <ImageIcon size={12} className="text-primary" />
                  <span className="text-xs font-body text-foreground">Ready to analyze</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-5">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-3 ml-1">
              What do you need?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Suggest matching bottom wear and accessories for a casual day out"
              rows={3}
              className="w-full bg-card/50 border border-gold/10 rounded-xl px-5 py-4 text-foreground font-body text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:bg-card/80 transition-all duration-300 resize-none"
            />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 mb-10">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => usePrompt(prompt)}
                className="tag-pill text-[11px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleSubmit}
              disabled={!imageBase64 || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary-premium px-12 py-4 text-primary-foreground font-body font-semibold tracking-wider uppercase text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              <Sparkles size={16} />
              {isLoading ? "Analyzing..." : "Analyze & Get Suggestions"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OutfitForm;
