"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPassword } from "../../features/conversion/api/conversionApi";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Security keys dispatched!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-white font-body min-h-screen selection:bg-primary-dim selection:text-white overflow-x-hidden flex flex-col items-center justify-center p-6 relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-dim/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Link href="/">
            <h1 className="text-3xl font-headline font-black tracking-tighter mb-2 text-white uppercase">
              Quick<span className="text-primary-dim">MP3</span>
            </h1>
          </Link>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em]">Recovery Chamber</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-1 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[2.3rem] p-10 space-y-8">
            <h2 className="text-2xl font-headline font-black tracking-tight text-white italic">
              Restore Identity
            </h2>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                    Submit your registered digital identifier (email) to receive a secure password recovery node link.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
                      Account Email
                    </label>
                    <div className="relative group/input">
                      <input
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-700 focus:border-primary-dim/40 transition-all outline-none"
                        placeholder="agent@quickmp3.com"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-zinc-600">
                        <span className="material-symbols-outlined text-[20px]">alternate_email</span>
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
                    {isLoading ? "Dispatching link..." : "Send Reset Link"}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-6"
                >
                  <span className="material-symbols-outlined text-green-400 text-5xl">mail</span>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Node link dispatched</h3>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    If this identifier is registered in our database arrays, an encryption key reset payload will arrive shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

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
