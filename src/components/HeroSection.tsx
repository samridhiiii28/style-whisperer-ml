import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Zap, Eye, Wand2 } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with advanced overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury fashion collection"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        {/* Radial gold accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/20 bg-secondary/50 mb-8"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-primary">
              AI-Powered Fashion Intelligence
            </span>
          </motion.div>

          <h1 className="font-display text-7xl md:text-9xl font-bold mb-8 leading-[0.85] tracking-tight">
            <span className="text-gradient-shine">Fashn</span>
            <span className="text-foreground/90">-Match</span>
          </h1>

          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload your clothing, get instant color analysis, smart outfit pairings, 
            and AI-generated styled looks — all powered by machine learning.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onGetStarted}
            className="btn-primary-premium px-10 py-4 text-primary-foreground font-body font-semibold tracking-wider uppercase text-sm rounded-lg flex items-center justify-center gap-3"
          >
            <Wand2 size={16} />
            Analyze Your Outfit
          </button>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 border border-gold/20 bg-card/50 text-foreground font-body font-medium tracking-wider uppercase text-sm rounded-lg hover:bg-card hover:border-gold/40 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Eye size={16} className="text-primary" />
            How It Works
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Palette, label: "Color Analysis" },
            { icon: Zap, label: "Smart Matching" },
            { icon: Eye, label: "Virtual Try-On" },
            { icon: Sparkles, label: "AI Styled Looks" },
          ].map((tag) => (
            <span
              key={tag.label}
              className="tag-pill flex items-center gap-2"
            >
              <tag.icon size={12} className="text-primary" />
              {tag.label}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={onGetStarted}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-body">Scroll</span>
            <ArrowDown size={14} className="text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Need Palette imported for feature pills
import { Palette } from "lucide-react";

export default HeroSection;
