"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useConvert } from "../hooks/useConvert";
import { useAuth } from "../../../contexts/AuthContext";
import { PremiumModal } from "../../../components/ui/PremiumModal";
import toast from "react-hot-toast";

export const ConversionFlow = () => {
  const router = useRouter();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const {
    url,
    setUrl,
    metadata,
    status,
    progress,
    downloadUrl,
    error,
    getMetadata,
    startConversion,
    reset
  } = useConvert();

  const handleFetchMetadata = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to convert videos");
      router.push("/login");
      return;
    }

    getMetadata(url);
  };

  const handleStartConversion = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to convert videos");
      router.push("/login");
      return;
    }

    if (user && user.plan === "free" && user.downloadsRemaining <= 0) {
      setIsPremiumModalOpen(true);
      return;
    }

    try {
      await startConversion();
    } catch (err: any) {
      if (err.message?.includes("Quota exceeded") || err.message?.includes("downloads")) {
        setIsPremiumModalOpen(true);
      }
    }
  };

  const handleDownloadClick = () => {
    // Refresh user quota in context on download action
    setTimeout(() => {
      refreshUser();
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />

      {/* Input Section */}
      <div className="glass-panel p-2 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row gap-2 shadow-2xl overflow-hidden group focus-within:border-primary-dim/40 transition-colors">
        <form onSubmit={handleFetchMetadata} className="grow flex items-center px-6 py-4">
          <span className="material-symbols-outlined text-outline mr-3 group-focus-within:text-primary-dim transition-colors">
            link
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline w-full text-lg outline-none"
            placeholder="Paste YouTube URL..."
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </form>
        <motion.button
          whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleFetchMetadata()}
          disabled={status === "loading_metadata" || status === "converting"}
          className="bg-linear-to-r from-primary-dim to-secondary transition-all duration-300 px-8 py-4 rounded-xl text-on-primary-container font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(132,85,239,0.3)] min-w-[200px] disabled:opacity-50"
        >
          {status === "loading_metadata" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              <span>Get Details</span>
              <span className="material-symbols-outlined">search</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metadata & conversion flow */}
      <AnimatePresence mode="wait">
        {metadata && (
          <motion.div
            key="metadata"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-panel p-6 rounded-2xl border border-outline-variant/20 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                <img src={metadata.thumbnail} alt={metadata.title} className="w-full h-full object-cover" />
              </div>
              <div className="grow space-y-2">
                <h3 className="text-xl font-bold line-clamp-2">{metadata.title}</h3>
                <div className="flex gap-4 text-sm text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {metadata.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person</span>
                    {metadata.author}
                  </span>
                </div>
                
                <div className="pt-4">
                  {status === "idle" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartConversion}
                      className="w-full bg-linear-to-r from-violet-600 to-indigo-600 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Convert to MP3</span>
                      <span className="material-symbols-outlined">bolt</span>
                    </motion.button>
                  )}

                  {status === "converting" && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-primary-dim">
                        <span>Converting...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-linear-to-r from-primary-dim to-secondary"
                        />
                      </div>
                    </div>
                  )}

                  {status === "completed" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-1">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Ready for download!</span>
                      </div>
                      <motion.a
                        href={downloadUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleDownloadClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-linear-to-r from-green-600 to-emerald-600 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>Download MP3</span>
                        <span className="material-symbols-outlined">download</span>
                      </motion.a>
                      <button onClick={reset} className="text-xs text-zinc-500 hover:text-white transition-colors underline">
                        Convert another video
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
