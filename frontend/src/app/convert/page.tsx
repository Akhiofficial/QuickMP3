"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useConvert } from "../../features/conversion/hooks/useConvert";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

function ConvertContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  
  const {
    url,
    setUrl,
    metadata,
    status,
    progress,
    downloadUrl,
    error,
    bitrate,
    setBitrate,
    downloading,
    setDownloading,
    getMetadata,
    startConversion,
    reset
  } = useConvert();

  useEffect(() => {
    if (urlParam) {
      getMetadata(urlParam);
    }
  }, [urlParam]);

  const isComplete = status === "completed";

  const handleDownload = async () => {
    if (!downloadUrl || !metadata) return;
    
    setDownloading(true);
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const fileName = `${metadata.title.replace(/[^\w\s-]/gi, '').trim()}.mp3`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Direct download failed, falling back to new tab:", err);
      window.open(downloadUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const getExpectedSize = () => {
    if (!metadata) return "Unknown";
    
    // If we have the EXACT file size from the RapidAPI backend, use it!
    if (metadata.filesize && metadata.filesize > 0) {
      const sizeInMB = metadata.filesize / (1024 * 1024);
      return `${sizeInMB.toFixed(1)} MB`;
    }
    
    // Fallback: Size (MB) = (Duration (seconds) * Bitrate (kbps)) / 8192
    const durationSeconds = metadata.duration;
    const bitrateKbps = parseInt(bitrate, 10);
    
    if (!durationSeconds || isNaN(durationSeconds) || isNaN(bitrateKbps)) return "Unknown";
    
    const sizeInMB = (durationSeconds * bitrateKbps) / 8192;
    return `${sizeInMB.toFixed(1)} MB`;
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-dim selection:text-white min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-dim/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full"
        />
      </div>

      <Navbar />

      <main className="pt-40 pb-24 px-6 min-h-screen flex flex-col items-center justify-center relative z-10">
        {!metadata && status === "loading_metadata" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-violet-500/20 border-t-primary-dim rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-x-0 h-full w-full bg-primary-dim/20 blur-xl rounded-full"
              />
            </div>
            <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Analyzing Digital Signal</p>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
             <div className="p-10 glass-panel border border-red-500/20 rounded-[2.5rem] shadow-2xl">
               <span className="material-symbols-outlined text-red-500 text-6xl mb-6">error</span>
               <h3 className="text-2xl font-headline font-black text-white mb-2">Extraction Failed</h3>
               <p className="text-red-400 font-medium">{error}</p>
             </div>
             <Link href="/">
               <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-zinc-100 transition-all border border-white/10"
               >
                  Try Again
               </motion.button>
             </Link>
          </motion.div>
        )}

        {metadata && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Video Preview & Progress */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-12 xl:col-span-7 space-y-8"
          >
            {/* Video Preview Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="relative rounded-3xl overflow-hidden aspect-video mb-8 border border-white/10 shadow-2xl">
                <Image 
                  src={metadata.thumbnail} 
                  alt={metadata.title}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 right-5 bg-black/80 backdrop-blur-xl px-4 py-1.5 rounded-xl text-xs font-mono text-white tracking-widest font-black border border-white/10">
                  {metadata.duration}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="font-headline text-3xl md:text-4xl font-black tracking-tight text-white line-clamp-2 leading-tight">
                  {metadata.title}
                </h2>
                <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px] text-primary-dim">person</span>
                    {metadata.author || "Global Artist"}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-secondary">visibility</span>
                    {metadata.viewCount} Views
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion Progress Area */}
            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-secondary text-[10px] font-black tracking-[0.3em] uppercase">
                    {status === "converting" && <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#34b5fa]"></span>}
                    {isComplete ? "Conversion Complete" : status === "converting" ? "Transmuting Signal" : "Initial Resonance"}
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {isComplete ? "High-Fidelity Audio Ready" : status === "converting" ? "Isolating Audio Stream..." : "Awaiting Transmutation"}
                  </h3>
                </div>
                <span className="text-6xl md:text-7xl font-headline font-black text-white tracking-tighter italic tabular-nums">
                  {progress}%
                </span>
              </div>
              
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5 p-0.5">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  className="absolute inset-y-0.5 left-0.5 bg-linear-to-r from-primary-dim via-secondary to-tertiary rounded-full shadow-[0_0_20px_rgba(132,85,239,0.5)]"
                >
                  <div className="absolute inset-0 animate-shimmer opacity-30"></div>
                </motion.div>
              </div>

              <div className="mt-8 flex justify-between text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">
                <div className="flex items-center gap-3">
                  {status === "converting" && <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="material-symbols-outlined text-[14px]">sync</motion.span>}
                  {isComplete ? "Security & Integrity Verified" : status === "converting" ? "Processing VBR Layer" : "Quantum Wait State"}
                </div>
                <span className="text-zinc-400">{isComplete ? "Ready" : status === "converting" ? `Processing...` : "Awaiting"}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Settings & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-5 space-y-8"
          >
            {/* Parameters Card */}
            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <h4 className="font-headline text-[10px] font-black text-zinc-500 mb-10 tracking-[0.4em] uppercase text-center">Output Parameters</h4>
              
              <div className="space-y-10">
                <div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: "128", label: "Standard" },
                      { val: "256", label: "High Quality" },
                      { val: "320", label: "Premium" }
                    ].map((item) => (
                      <button 
                        key={item.val}
                        disabled={status === "converting"}
                        onClick={() => setBitrate(item.val)}
                        className={`py-6 px-2 rounded-2xl border transition-all duration-500 active:scale-95 group disabled:opacity-50 ${
                          bitrate === item.val
                          ? "border-primary-dim bg-primary-dim/10 text-primary-dim shadow-[0_0_30px_rgba(132,85,239,0.2)]" 
                          : "border-white/5 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="block text-xl font-black mb-1 tracking-tighter">{item.val}</span>
                        <span className="block text-[9px] uppercase tracking-widest opacity-50 font-black group-hover:opacity-100 transition-opacity">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Estimated Mass</span>
                    <span className="font-black text-white">{getExpectedSize()}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Signal Format</span>
                    <span className="font-black text-white">{bitrate === "320" ? "High Definition" : bitrate === "256" ? "Standard Quality" : "Basic Quality"} MP3</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Resonance</span>
                    <span className="font-black text-white">{bitrate} kbps / {bitrate === "320" ? "48,000" : "44,100"} Hz</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <div className="space-y-4">
               {status === "idle" && (
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(132,85,239,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startConversion}
                  className="w-full py-6 rounded-2xl font-headline font-black text-xl flex items-center justify-center gap-3 transition-all duration-500 bg-linear-to-r from-primary-dim to-secondary text-white shadow-2xl overflow-hidden relative group/cta"
                >
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover/cta:opacity-100 transition-opacity"></div>
                  <span className="material-symbols-outlined relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span className="relative z-10">Start Conversion</span>
                </motion.button>
              )}

              <motion.button 
                whileHover={isComplete && !downloading ? { scale: 1.02, boxShadow: "0 0 40px rgba(52,181,250,0.4)" } : {}}
                whileTap={isComplete && !downloading ? { scale: 0.98 } : {}}
                onClick={handleDownload}
                disabled={!isComplete || downloading}
                className={`w-full py-6 rounded-2xl font-headline font-black text-xl flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden group/dl ${
                  isComplete 
                  ? "bg-linear-to-r from-secondary to-tertiary text-white shadow-2xl cursor-pointer" 
                  : "bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5"
                } ${downloading ? "opacity-80" : ""}`}
              >
                {isComplete && <div className="absolute inset-0 animate-shimmer opacity-0 group-hover/dl:opacity-100 transition-opacity"></div>}
                {downloading ? (
                  <>
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="material-symbols-outlined"
                    >
                      sync
                    </motion.span>
                    Converting File...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>download_done</span>
                    <span className="relative z-10">Download MP3</span>
                  </>
                )}
              </motion.button>

              <Link href="/" className="block">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/5 py-5 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.3em] text-zinc-400 border border-white/5 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  Analyze New Signal
                </motion.button>
              </Link>
            </div>

            {/* Quality Badge */}
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex items-start gap-4 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-dim/10 blur-2xl rounded-full"></div>
              <span className="material-symbols-outlined text-primary-dim text-3xl">verified</span>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-black uppercase tracking-widest">
                ID3 metadata protocols automatically applied. Highest fidelity guaranteed by QuickMP3 Studio.
              </p>
            </div>
          </motion.div>
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ConvertPage() {
  return (
    <Suspense fallback={null}>
      <ConvertContent />
    </Suspense>
  );
}
