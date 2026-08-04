"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { resetPassword } from "../../features/conversion/api/conversionApi";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid security signature payload");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Security protocol updated! Login now.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to update security credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Password */}
        <div className="space-y-2">
          <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
            New Security Key (Password)
          </label>
          <div className="relative group/input">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-800 focus:border-primary-dim/40 transition-all outline-none"
              placeholder="••••••••"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-600">
              <span className="material-symbols-outlined text-[20px]">lock_open</span>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
            Confirm Security Key
          </label>
          <div className="relative group/input">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-800 focus:border-primary-dim/40 transition-all outline-none"
              placeholder="••••••••"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-600">
              <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(132,85,239,0.3)" }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full bg-linear-to-r from-primary-dim to-secondary py-5 rounded-2xl font-headline font-black text-center text-white border-none uppercase tracking-[0.2em] text-xs transition-all"
        type="submit"
      >
        {isLoading ? "Updating Vault..." : "Save New Password"}
      </motion.button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-surface text-white font-body min-h-screen selection:bg-primary-dim selection:text-white overflow-x-hidden flex flex-col items-center justify-center p-6 relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Link href="/">
            <h1 className="text-3xl font-headline font-black tracking-tighter mb-2 text-white uppercase">
              Quick<span className="text-primary-dim">MP3</span>
            </h1>
          </Link>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em]">Vault Reconfiguration</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-1 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[2.3rem] p-10 space-y-8">
            <h2 className="text-2xl font-headline font-black tracking-tight text-white italic">
              Reset Credentials
            </h2>

            <Suspense
              fallback={
                <div className="flex justify-center py-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary-dim/20 border-t-primary-dim rounded-full"
                  />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>

            <div className="text-center text-[11px] font-black uppercase tracking-widest pt-4 border-t border-white/5">
              <Link className="text-secondary hover:text-violet-400 transition-colors" href="/login">
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
