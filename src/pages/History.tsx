import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Calendar, Palette, Star, Shirt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HistoryEntry {
  id: string;
  detected_item: string;
  detected_colors: { name: string; hex: string }[];
  occasion: { primary: string };
  overall_score: number;
  style_analysis: string;
  uploaded_image: string | null;
  description: string | null;
  created_at: string;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Failed to load history");
      } else {
        setEntries((data as unknown as HistoryEntry[]) || []);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("analysis_history").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Entry deleted");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-glass-heavy border-b border-gold/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient-gold">My</span>
            <span className="text-foreground/80"> History</span>
          </span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <Shirt size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground/70 mb-2">No analyses yet</h2>
            <p className="text-muted-foreground font-body text-sm mb-6">Upload an outfit to get started!</p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary-premium px-6 py-3 rounded-xl text-primary-foreground font-body font-semibold text-sm tracking-wider uppercase"
            >
              Analyze an Outfit
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-elevated rounded-2xl p-5 flex gap-5 items-start group"
              >
                {/* Thumbnail */}
                {entry.uploaded_image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                    <img src={entry.uploaded_image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold text-foreground truncate">
                      {entry.detected_item}
                    </h3>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-gold/15 text-primary text-xs font-body">
                      <Star size={10} />
                      {Math.round(entry.overall_score)}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Palette size={12} />
                      {entry.occasion?.primary || "—"}
                    </span>
                  </div>

                  {/* Color dots */}
                  {entry.detected_colors?.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {entry.detected_colors.slice(0, 5).map((c, j) => (
                        <div
                          key={j}
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
