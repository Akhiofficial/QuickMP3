"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser } from "../../features/conversion/api/conversionApi";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(email, password);
      router.push("/login?signup=success");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-white font-body min-h-screen selection:bg-primary-dim selection:text-white overflow-x-hidden flex flex-col items-center justify-center p-6 relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-primary-dim/10 blur-[110px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[55%] h-[55%] bg-secondary/10 blur-[130px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-headline font-black tracking-tighter mb-2 text-white uppercase group">
              Quick<span className="text-primary-dim group-hover:text-violet-400 transition-colors">MP3</span>
            </h1>
          </Link>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em] opacity-80">Initialize New Extraction Link</p>
        </motion.div>

        {/* Signup Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-1 border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[2.3rem] p-10">
            <h2 className="text-2xl font-headline font-black mb-10 tracking-tight text-white italic">Create Identity</h2>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-black uppercase tracking-wider"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1" htmlFor="email">Digital Identifier (Email)</label>
                  <div className="relative group/input">
                    <input
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:border-primary-dim/40 transition-all outline-none focus:bg-white/10"
                      id="email"
                      placeholder="new@quickmp3.com"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-primary-dim transition-colors">
                      <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1" htmlFor="password">Security Protocol (Password)</label>
                  <div className="relative group/input">
                    <input
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-800 focus:border-primary-dim/40 transition-all outline-none focus:bg-white/10"
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-primary-dim transition-colors">
                      <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Account Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(132,85,239,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-linear-to-r from-primary-dim to-secondary py-5 rounded-2xl font-headline font-black text-center text-white border-none transition-all cursor-pointer uppercase tracking-[0.2em] text-xs disabled:opacity-50 relative overflow-hidden group/btn"
                type="submit"
                disabled={isLoading}
              >
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                <span className="relative z-10">{isLoading ? "Processing Encryption..." : "Create Account"}</span>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-10 flex items-center justify-center">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative px-4 bg-zinc-950/20 backdrop-blur-3xl text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 z-10">
                Alternative Keys
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:border-white/10 hover:text-white transition-all cursor-pointer group">
                <img alt="Google" className="w-4 h-4 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX5_-XtqI3PWjdj4oX9fmcMP3CJWv2QVZmNwK_fnKir4r49a9w1YX6MDjCCUEV7MF19yXYTiBpNenIXB9-z-ccQqMbxXe5upubvSrZhH-QV4dLKkjU1quwNsD3mBmezjgnvWYkQoTiNiVqEaEI7OqS5t9RQfnitJ8MXpkWZiGdx3bw4Ln9hXbl4Yw9kvyiKABszfa9ml2k6DhzUgVSWxPgd6ZCuVpbjLsaKwlF4nMHbteVS1MGG0gUMAXJfJ8VjpmRBMnZtugQtc8" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:border-white/10 hover:text-white transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-indigo-400 text-lg group-hover:scale-110 transition-transform">forum</span>
                <span>Discord</span>
              </button>
            </div>

            {/* Login Footer */}
            <div className="mt-10 text-center text-[11px] font-black uppercase tracking-widest">
              <span className="text-zinc-500">Known Entity?</span>
              <Link className="text-secondary hover:text-violet-400 ml-2 transition-colors" href="/login">Return to Chamber</Link>
            </div>
          </div>
        </motion.div>

        {/* Outer Footer */}
        <p className="text-center mt-12 text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] opacity-60">
          Neural-link encryption established.
        </p>
      </div>
    </div>
  );
}
