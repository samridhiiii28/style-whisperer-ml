import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, Image as ImageIcon, X } from "lucide-react";

interface OutfitFormProps {
  onAnalyze: (imageBase64: string, description: string) => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  "Suggest me matching bottom wear and accessories for office",
  "What shoes and accessories go with this for a college look?",
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

  const usePrompt = (prompt: string) => {
    setDescription(prompt);
  };

  return (
    <section id="analyzer" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
            <span className="text-gradient-gold">Upload</span> Your Clothing
          </h2>
          <p className="text-muted-foreground text-center mb-10 font-body">
            Upload a clothing image and tell us what you need — we'll analyze colors and suggest matching pieces.
          </p>

          {/* Image Upload Area */}
          <div className="mb-8">
            {!imagePreview ? (
              <label
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gold/30 rounded-sm bg-card/50 cursor-pointer hover:border-primary/50 transition-colors group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-body text-foreground">Click to upload clothing image</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
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
                  src={imagePreview}
                  alt="Uploaded clothing"
                  className="w-full max-h-80 object-contain rounded-sm border border-gold/20 bg-card"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 border border-gold/20 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                >
                  <X size={16} className="text-foreground" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-3 py-1 bg-card/90 rounded-full border border-gold/20">
                  <ImageIcon size={12} className="text-primary" />
                  <span className="text-xs font-body text-foreground">Image uploaded</span>
                </div>
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-xs tracking-wider uppercase text-muted-foreground font-body mb-2">
              What do you need?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Suggest me matching bottom wear and accessories for office"
              rows={3}
              className="w-full bg-card border border-gold/20 rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 mb-8">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => usePrompt(prompt)}
                className="px-3 py-1.5 border border-gold/20 rounded-full text-xs text-muted-foreground font-body hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!imageBase64 || isLoading}
              className="px-10 py-4 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light transition-colors duration-300 glow-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
            >
              <Sparkles size={16} />
              {isLoading ? "Analyzing with AI..." : "Analyze & Get Suggestions"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OutfitForm;
