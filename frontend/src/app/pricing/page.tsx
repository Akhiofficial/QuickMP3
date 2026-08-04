"use client";

import React from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { useRazorpay } from "../../hooks/useRazorpay";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingPage() {
  const { pay, isProcessing } = useRazorpay();
  const { user } = useAuth();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-20 w-full z-10 relative grow space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 mb-4 rounded-full bg-primary-dim/10 border border-primary-dim/20 text-primary-dim text-xs font-bold tracking-[0.2em] uppercase">
            Pricing Framework
          </span>
          <h1 className="text-4xl md:text-6xl font-headline font-black text-white tracking-tight mb-6">
            Refinement, Scaled
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
            Choose the bandwidth configuration that aligns with your audio requirements. From free conversions to unrestricted access.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Free Plan */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between h-full"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest text-[11px] mb-2">Free Plan</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹0</span>
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ lifetime</span>
                </div>
              </div>
              
              <hr className="border-white/5 my-6" />

              <ul className="space-y-4 mb-8 text-sm text-zinc-400 font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Login Required
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  3 Lifetime Downloads
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Standard Speed
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Download History
                </li>
              </ul>
            </div>

            <Link
              href={user ? "/dashboard" : "/login"}
              className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest text-center border border-white/10 transition-all block mt-6"
            >
              {user ? "Dashboard" : "Access Vault"}
            </Link>
          </motion.div>

          {/* Starter Plan */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between h-full"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest text-[11px] mb-2">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹19</span>
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ 30 Days</span>
                </div>
              </div>
              
              <hr className="border-white/5 my-6" />

              <ul className="space-y-4 mb-8 text-sm text-zinc-400 font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  20 Downloads
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Valid 30 Days
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  320 kbps Quality
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  No recurring renewal
                </li>
              </ul>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => pay("starter")}
              className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 transition-all mt-6"
            >
              Get Starter
            </button>
          </motion.div>

          {/* Pro Monthly Plan */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-[2rem] border border-primary-dim bg-primary-dim/5 flex flex-col justify-between h-full relative"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 py-1 px-4 rounded-full bg-primary-dim text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(132,85,239,0.5)]">
              Most Popular ⭐
            </div>

            <div>
              <div className="mb-6 mt-2">
                <h3 className="text-lg font-bold text-primary-fixed uppercase tracking-widest text-[11px] mb-2">Pro Monthly</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹99</span>
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">/ month</span>
                </div>
              </div>
              
              <hr className="border-white/5 my-6" />

              <ul className="space-y-4 mb-8 text-sm text-zinc-300 font-medium">
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
                  Fast Queue Priority
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Unlimited History Logs
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  Zero Ads Panel
                </li>
              </ul>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => pay("pro_monthly")}
              className="w-full py-4 rounded-xl bg-linear-to-r from-primary-dim to-secondary text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)] hover:brightness-110 mt-6"
            >
              Get Pro Monthly
            </button>
          </motion.div>

          {/* Pro Yearly Plan */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between h-full"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest text-[11px] mb-2">Pro Yearly</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹799</span>
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ year</span>
                </div>
              </div>
              
              <hr className="border-white/5 my-6" />

              <ul className="space-y-4 mb-8 text-sm text-zinc-400 font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Everything in Monthly
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Save over 30%
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                  Priority Support
                </li>
              </ul>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => pay("pro_yearly")}
              className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 transition-all mt-6"
            >
              Get Pro Yearly
            </button>
          </motion.div>
        </div>

        <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
          *Fair usage parameter applies (300 audio extractions per billing period). Payments protected under Razorpay SSL encryption.
        </p>
      </main>

      <Footer />
    </div>
  );
}
