import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to verify your account!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background noise-overlay flex items-center justify-center px-4">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Fashn</span>
            <span className="text-foreground/80">-Match</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {isLogin ? "Welcome back, fashionista" : "Join the style revolution"}
          </p>
        </div>

        {/* Card */}
        <div className="card-elevated rounded-2xl p-8">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:border-gold/20 transition-all duration-300 font-body text-sm text-foreground mb-6 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="font-body text-xs text-muted-foreground tracking-wider uppercase">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-secondary/50 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-secondary/50 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-secondary/50 border border-border text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-premium py-3.5 rounded-xl text-primary-foreground font-body font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={14} />
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
