"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      
      // Store auth info
      localStorage.setItem("securecorp_auth", JSON.stringify(data));
      
      // Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/employee");
      }
    } catch (err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : "Invalid credentials or Server Error";

  setError(message);
}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">SecureCorp</h1>
            <p className="text-slate-300 text-sm">Enterprise Security Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive-foreground text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-slate-400 transition-all"
                placeholder="Ex: admin@securecorp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-slate-400 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] disabled:opacity-70"
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-slate-400 relative z-10">
            <p>Protected by Advanced Threat Detection</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
