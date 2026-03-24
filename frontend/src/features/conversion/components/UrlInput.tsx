"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const UrlInput = () => {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    const encodedUrl = encodeURIComponent(url);
    router.push(`/convert?url=${encodedUrl}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group focus-within:border-primary/40 focus-within:shadow-[0_0_30px_rgba(132,85,239,0.2)] transition-all duration-500">
        <form onSubmit={handleSubmit} className="grow flex items-center px-6 py-4">
          <motion.span 
            animate={url ? { color: "#ba9eff", scale: 1.1 } : { color: "#767576", scale: 1 }}
            className="material-symbols-outlined mr-3 transition-colors"
          >
            link
          </motion.span>
          <input
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline/50 w-full text-lg outline-none font-medium"
            placeholder="Paste YouTube video or playlist link..."
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </form>
        <motion.button
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 0 25px rgba(132, 85, 239, 0.5)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="relative overflow-hidden bg-linear-to-r from-primary-dim to-secondary px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 min-w-[200px] group/btn"
        >
          <div className="absolute inset-0 animate-shimmer opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          <span className="relative z-10">Get Details</span>
          <motion.span 
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="material-symbols-outlined relative z-10"
          >
            bolt
          </motion.span>
        </motion.button>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-4 text-xs font-medium tracking-[0.2em] uppercase text-on-surface-variant"
      >
        No registration required • High fidelity extraction
      </motion.p>
    </motion.div>
  );
};
