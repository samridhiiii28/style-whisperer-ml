import { motion } from "framer-motion";
import { Upload, Cpu, Palette, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Clothing",
    description: "Snap or upload a photo of your clothing item. Our system accepts any garment image.",
    number: "01",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Machine learning extracts colors, detects the garment type, and evaluates style attributes.",
    number: "02",
  },
  {
    icon: Palette,
    title: "Smart Matching",
    description: "Color harmony algorithms and style models find the perfect bottom wear, footwear, and accessories.",
    number: "03",
  },
  {
    icon: Sparkles,
    title: "Styled Look",
    description: "See AI-generated images of a model wearing your complete outfit with all recommendations.",
    number: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-32 px-6">
      {/* Section divider top */}
      <div className="section-divider absolute top-0 left-0 right-0" />
      
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Process</span>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-5">
            <span className="text-gradient-gold">How</span> It Works
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
            Four simple steps from upload to a complete styled outfit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card-elevated rounded-lg p-6 group relative overflow-hidden transition-all duration-500"
            >
              {/* Step number watermark */}
              <span className="absolute -top-2 -right-2 font-display text-7xl font-bold text-gold/[0.04] select-none pointer-events-none">
                {step.number}
              </span>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-gold/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:border-gold/20 transition-all duration-500">
                  <step.icon size={20} className="text-primary" />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.description}</p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section divider bottom */}
      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
};

export default HowItWorks;
