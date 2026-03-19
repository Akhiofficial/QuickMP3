"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ConvertPage() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-dim selection:text-white min-h-screen relative overflow-hidden">
      {/* Background Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-primary-dim/20 top-[-10%] left-[-5%] blur-[100px] rounded-full absolute animate-float"></div>
        <div className="orb w-[600px] h-[600px] bg-secondary/15 bottom-[-10%] right-[-5%] blur-[100px] rounded-full absolute animate-float-delayed"></div>
      </div>

      {/* TopNavBar */}
      <nav className="bg-zinc-950/60 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-100 font-headline uppercase">
            QuickMP3
          </Link>
          <div className="hidden md:flex gap-8 items-center font-manrope tracking-tight text-sm font-medium">
            {["Convert", "Features", "FAQ"].map((item, idx) => (
              <Link
                key={item}
                href={idx === 0 ? "/convert" : `/#${item.toLowerCase()}`}
                className={`${idx === 0 ? "text-violet-400 font-semibold" : "text-zinc-400 hover:text-zinc-100"} transition-colors`}
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="w-[100px] md:w-auto h-8 invisible" />
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Video Preview & Progress */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Video Preview Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative rounded-xl overflow-hidden aspect-video mb-6 border border-white/10 shadow-lg">
                <Image 
                  src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop" 
                  alt="Video Thumbnail"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-secondary-fixed tracking-wider font-bold">
                  04:22
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface line-clamp-2 leading-tight">
                  Synthetic Echoes — Late Night Session (4K)
                </h2>
                <div className="flex items-center gap-4 text-on-surface-variant text-sm font-medium">
                  <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Resonance Lab
                  </span>
                  <span className="w-1.5 h-1.5 bg-outline-variant/40 rounded-full"></span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    1.2M Views
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion State Area */}
            <div className="bg-surface-container-lowest/50 backdrop-blur-md p-8 rounded-2xl border border-outline-variant/10 shadow-2xl">
              <div className="flex justify-between items-end mb-6">
                <div className="space-y-2">
                  <p className="text-secondary font-headline text-xs font-bold tracking-widest uppercase">
                    {isComplete ? "Process Complete" : "Process Active"}
                  </p>
                  <h3 className="text-xl md:text-2xl font-medium text-on-surface flex items-center gap-3">
                    {!isComplete && <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(52,181,250,0.8)]"></span>}
                    {isComplete ? "Audio Ready for Download" : "Extracting Audio Stream..."}
                  </h3>
                </div>
                <span className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tighter italic tabular-nums">
                  {progress}%
                </span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  className="absolute inset-0 bg-linear-to-r from-primary-dim via-secondary to-tertiary shadow-[0_0_20px_rgba(52,181,250,0.4)]"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-white/30 blur-md animate-shimmer"></div>
                </motion.div>
              </div>

              <div className="mt-6 flex justify-between text-sm font-medium text-on-surface-variant tracking-wide">
                <div className="flex items-center gap-2">
                  {!isComplete && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                  {isComplete ? "Encoding 100% Verified" : "Encoding VBR Layer"}
                </div>
                <span>{isComplete ? "Done" : `Estimated: ${Math.ceil((100 - progress) / 10)}s`}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Settings & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Output Parameters Card */}
            <div className="glass-panel p-8 rounded-2xl border border-outline-variant/10 shadow-2xl">
              <h4 className="font-headline text-xs font-bold text-on-surface-variant mb-8 tracking-widest uppercase">Output Parameters</h4>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                    Bitrate Selection
                    <span className="material-symbols-outlined text-[16px] text-primary/60 cursor-help">info</span>
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: 128, label: "Standard" },
                      { val: 256, label: "High" },
                      { val: 320, label: "Master" }
                    ].map((bitrate) => (
                      <button 
                        key={bitrate.val}
                        className={`py-4 px-2 rounded-xl border transition-all duration-300 active:scale-95 group ${
                          bitrate.val === 320 
                          ? "border-primary-dim bg-primary-dim/10 text-primary-dim shadow-[0_0_15px_rgba(132,85,239,0.2)]" 
                          : "border-outline-variant/20 bg-surface-container-highest text-on-surface-variant hover:border-primary-dim/40"
                        }`}
                      >
                        <span className="block text-base font-bold">{bitrate.val}</span>
                        <span className="block text-[10px] uppercase tracking-tighter opacity-60 font-bold group-hover:opacity-100 transition-opacity">
                          {bitrate.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center text-sm py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Expected Size</span>
                    <span className="font-bold text-on-surface">11.4 MB</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant font-medium">Format</span>
                    <span className="font-bold text-on-surface">MPEG Layer-3</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3">
                    <span className="text-on-surface-variant font-medium">Sample Rate</span>
                    <span className="font-bold text-on-surface">48 kHz</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-4">
              <motion.button 
                whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 rounded-xl font-headline font-black text-xl flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl ${
                  isComplete 
                  ? "bg-linear-to-r from-primary-dim to-secondary text-white shadow-[0_10px_40px_-10px_rgba(132,85,239,0.5)] cursor-pointer" 
                  : "bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed border border-white/5"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
                Download MP3
              </motion.button>

              <Link href="/">
                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-zinc-900/50 backdrop-blur-md py-4 rounded-xl font-headline font-bold text-on-surface border border-outline-variant/20 hover:border-primary-dim/30 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">add_circle</span>
                  Convert Another
                </motion.button>
              </Link>
            </div>

            {/* Info Badge */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary-dim/5 border border-primary-dim/10">
              <span className="material-symbols-outlined text-primary-dim">verified</span>
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                Metadata and ID3 tags have been automatically extracted and applied to your MP3 file. Pure audio experience guaranteed.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950/80 backdrop-blur-lg w-full py-12 border-t border-white/5 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          <div className="font-inter text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
            © 2024 QuickMP3. HIGH-END EXTRACTION.
          </div>
          <div className="flex gap-10 font-inter text-xs uppercase tracking-[0.15em] font-bold">
            {["Privacy", "Terms", "API", "Github"].map((item) => (
              <a
                key={item}
                className="text-zinc-500 hover:text-violet-400 transition-all duration-300 opacity-80 hover:opacity-100"
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 25s ease-in-out infinite -5s;
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
