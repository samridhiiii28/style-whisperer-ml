import { motion } from "framer-motion";
import { FileText, Cpu, Palette, Calendar } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Describe Items",
    description: "Enter natural language descriptions of your clothing items with details about color, style, and material.",
  },
  {
    icon: Cpu,
    title: "Smart Feature Extraction",
    description: "Our system extracts color, category, style, and material features using natural language processing.",
  },
  {
    icon: Palette,
    title: "Color Compatibility",
    description: "A trained model evaluates color harmony across your outfit using color theory and compatibility scoring.",
  },
  {
    icon: Calendar,
    title: "Occasion Prediction",
    description: "A classification model predicts suitable occasions — casual, business, formal, or special events.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-gradient-gold">How</span> It Works
        </h2>
        <p className="text-muted-foreground text-center mb-16 font-body max-w-xl mx-auto">
          Fashn-Match uses a multi-stage pipeline to analyze and recommend outfits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card border border-gold/10 rounded-sm p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <step.icon size={18} className="text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-body tracking-wider uppercase">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
