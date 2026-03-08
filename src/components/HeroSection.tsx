import { motion } from "framer-motion";
import heroImage from "@/assets/hero-fashion.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury fashion collection"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-6">
            Smart Fashion Intelligence
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 leading-[0.9]">
            <span className="text-gradient-gold">Fashn</span>
            <span className="text-foreground">-Match</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Intelligent outfit recommendations powered by machine learning.
            Analyze color compatibility, predict occasions, and discover
            perfect clothing combinations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-primary text-primary-foreground font-body font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light transition-colors duration-300 glow-gold"
          >
            Analyze Your Outfit
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 border border-gold bg-transparent text-primary font-body font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-primary/10 transition-colors duration-300"
          >
            How It Works
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {["Color Compatibility", "Occasion Prediction", "Style Analysis", "NLP-Powered"].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 border border-gold rounded-full text-xs tracking-wider uppercase text-muted-foreground font-body"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
