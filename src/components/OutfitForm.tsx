import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Sparkles } from "lucide-react";

interface OutfitFormProps {
  onAnalyze: (items: string[]) => void;
  isLoading: boolean;
}

const EXAMPLE_ITEMS = [
  "Navy blue slim-fit blazer with gold buttons",
  "White cotton crew-neck t-shirt",
  "Black skinny jeans with slight distressing",
  "Brown leather chelsea boots",
  "Burgundy silk pocket square",
];

const OutfitForm = ({ onAnalyze, isLoading }: OutfitFormProps) => {
  const [items, setItems] = useState<string[]>([""]);

  const addItem = () => {
    if (items.length < 6) setItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const loadExample = () => {
    setItems([...EXAMPLE_ITEMS]);
  };

  const handleSubmit = () => {
    const filled = items.filter((item) => item.trim());
    if (filled.length >= 2) onAnalyze(filled);
  };

  const filledCount = items.filter((i) => i.trim()).length;

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
            <span className="text-gradient-gold">Describe</span> Your Outfit
          </h2>
          <p className="text-muted-foreground text-center mb-8 font-body">
            Enter at least 2 clothing items with detailed descriptions for best results.
          </p>

          <div className="flex justify-center mb-8">
            <button
              onClick={loadExample}
              className="text-xs tracking-wider uppercase text-primary font-body hover:text-gold-light transition-colors border-b border-primary/30 pb-0.5"
            >
              Load example outfit
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-2 items-center"
              >
                <span className="text-xs text-muted-foreground font-body w-6 text-right shrink-0">
                  {index + 1}.
                </span>
                <input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder="e.g., Light grey wool overcoat"
                  className="flex-1 bg-card border border-gold/20 rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {items.length < 6 && (
            <button
              onClick={addItem}
              className="mt-3 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm ml-8"
            >
              <Plus size={14} />
              Add item
            </button>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={filledCount < 2 || isLoading}
              className="px-10 py-4 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light transition-colors duration-300 glow-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
            >
              <Sparkles size={16} />
              {isLoading ? "Analyzing..." : "Analyze Compatibility"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OutfitForm;
