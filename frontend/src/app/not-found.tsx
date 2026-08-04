"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export default function NotFound() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 pt-40 pb-20 w-full z-10 relative flex flex-col items-center justify-center text-center space-y-8">
        {/* Glow */}
        <div className="absolute w-72 h-72 bg-primary-dim/20 blur-[120px] rounded-full -z-10" />

        {/* Header Symbol */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-zinc-400 text-5xl">sensors_off</span>
        </motion.div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-7xl font-headline font-black text-white italic tracking-tighter">404</h1>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em]">Signal Disconnected</p>
        </div>

        <p className="text-zinc-400 font-medium">
          The requested coordinate matrix does not exist in our index database. Return to the main channel console.
        </p>

        {/* Action */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(132, 85, 239, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-linear-to-r from-primary-dim to-secondary px-8 py-4 rounded-2xl text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)]"
          >
            Chamber Root
          </motion.button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
