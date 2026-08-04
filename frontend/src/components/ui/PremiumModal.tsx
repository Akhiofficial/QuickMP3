"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRazorpay } from "../../hooks/useRazorpay";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const { pay, isProcessing } = useRazorpay();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-4xl glass-panel rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Glowing Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-linear-to-r from-transparent via-primary-dim to-transparent" />

            <div className="bg-zinc-950/55 p-8 md:p-12">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Header */}
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="inline-flex items-center gap-2 py-1 px-4 mb-4 rounded-full bg-primary-dim/10 border border-primary-dim/20 text-primary-dim text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Quota Exhausted
                </span>
                <h3 className="text-3xl md:text-4xl font-headline font-black text-white tracking-tight mb-4">
                  Refine Without Boundaries
                </h3>
                <p className="text-zinc-400 font-medium">
                  You've used all your free downloads. Upgrade your plan to continue extracting high-fidelity audio.
                </p>
              </div>

              {/* Grid of Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Starter */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/5 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-lg font-bold text-zinc-300 uppercase tracking-widest text-[11px] mb-2">Starter Plan</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-black text-white">₹19</span>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ 30 Days</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-zinc-400 font-medium">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        20 Downloads
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        Valid for 30 days
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        320 kbps Quality
                      </li>
                    </ul>
                  </div>
                  <button
                    disabled={isProcessing}
                    onClick={() => pay("starter")}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all border border-white/10"
                  >
                    Select Starter
                  </button>
                </motion.div>

                {/* Pro Monthly */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-panel p-6 rounded-3xl border border-primary-dim bg-primary-dim/5 relative flex flex-col justify-between"
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 py-1 px-3 rounded-full bg-primary-dim text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(132,85,239,0.5)]">
                    Most Popular ⭐
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary text-primary-fixed uppercase tracking-widest text-[11px] mb-2 mt-2">Pro Monthly</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-black text-white">₹99</span>
                      <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">/ month</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-zinc-300 font-medium">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        Unlimited Downloads*
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        Highest Audio Quality
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        Fast Queue Processing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        Unlimited History Logs
                      </li>
                    </ul>
                  </div>
                  <button
                    disabled={isProcessing}
                    onClick={() => pay("pro_monthly")}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-primary-dim to-secondary text-white font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)] hover:brightness-110"
                  >
                    Select Pro Monthly
                  </button>
                </motion.div>

                {/* Pro Yearly */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/5 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-lg font-bold text-zinc-300 uppercase tracking-widest text-[11px] mb-2">Pro Yearly</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-black text-white">₹799</span>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ year</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-zinc-400 font-medium">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        Save over 30%
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        All Pro Monthly features
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        Priority VIP Support
                      </li>
                    </ul>
                  </div>
                  <button
                    disabled={isProcessing}
                    onClick={() => pay("pro_yearly")}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all border border-white/10"
                  >
                    Select Pro Yearly
                  </button>
                </motion.div>
              </div>

              <p className="text-center text-[10px] text-zinc-500 mt-8 font-semibold uppercase tracking-wider">
                *Fair usage policy of 300 downloads/month applies. Payments secured by Razorpay.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
