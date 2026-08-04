"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UrlInput } from "../features/conversion/components/UrlInput";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { AnimatedWaveform } from "../components/visuals/AnimatedWaveform";
import Link from "next/link";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-dim selection:text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 overflow-hidden min-h-[900px] flex flex-col items-center justify-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full hero-glow"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 py-1.5 px-4 mb-8 rounded-full bg-white/5 border border-white/10 text-primary-dim text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-dim opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-dim"></span>
            </span>
            Premium Extraction Chamber
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-headline font-black tracking-[-0.04em] mb-8 leading-[0.9] text-white"
          >
            Refine Sound from <br />
            <span className="text-gradient">Digital Signal</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
          >
            Convert YouTube videos to studio-grade MP3 instantly.
            <span className="text-zinc-100"> Pure audio, zero noise, ultimate precision.</span>
          </motion.p>

          <UrlInput />

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
            {[
              { icon: "slow_motion_video", text: "320kbps High-Fidelity" },
              { icon: "bolt", text: "Sub-Second Processing" },
              { icon: "enhanced_encryption", text: "Secure & Anonymous" }
            ].map((pill, idx) => (
              <motion.span
                key={idx}
                variants={itemVariants}
                className="flex items-center gap-2 group cursor-default"
              >
                <span className="material-symbols-outlined text-[16px] text-zinc-400 group-hover:text-primary-dim transition-colors">
                  {pill.icon}
                </span>
                {pill.text}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </header>

      {/* Features Section: Modern Bento */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-black mb-6">Engineered for Excellence</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">Our platform leverages cutting-edge signal processing to ensure your downloads are nothing short of perfect.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "speed",
              gradient: "from-violet-500/20 to-transparent",
              title: "Instantaneous",
              desc: "Proprietary caching and extraction algorithms process your requests in milliseconds."
            },
            {
              icon: "high_quality",
              gradient: "from-blue-500/20 to-transparent",
              title: "Studio Quality",
              desc: "Extract crystal clear audio at up to 320kbps with meticulous acoustic fidelity."
            },
            {
              icon: "all_inclusive",
              gradient: "from-fuchsia-500/20 to-transparent",
              title: "Pure Freedom",
              desc: "Unlimited conversions. No caps, no registration, no compromise on your experience."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 w-full h-full bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:border-white/10 transition-all duration-500">
                  <span className="material-symbols-outlined text-zinc-100 text-3xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works: The Alchemy Process */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="md:w-1/2">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-headline font-black tracking-tighter mb-12 text-white"
              >
                The Alchemy <br />
                <span className="text-gradient">Process</span>
              </motion.h2>
              <div className="space-y-12 relative">
                <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-white/5">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="w-full bg-linear-to-b from-primary-dim via-secondary to-tertiary shadow-[0_0_10px_rgba(132,85,239,0.5)]"
                  />
                </div>

                {[
                  { n: 1, title: "Initialize", dot: "bg-primary-dim", text: "Drop your target URL into the extraction chamber for initial resonance scanning." },
                  { n: 2, title: "Transmute", dot: "bg-secondary", text: "Our engine parses the digital signature and isolates the highest fidelity audio stream." },
                  { n: 3, title: "Ready", dot: "bg-tertiary", text: "Your refined MP3 is ready instantly for high-quality listening anywhere." }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.3 }}
                    className="flex gap-10 relative z-10 group"
                  >
                    <div className={`w-14 h-14 shrink-0 glass-panel border border-white/10 rounded-full flex items-center justify-center font-headline font-black text-xl text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500`}>
                      <span className={`absolute -inset-1 blur-md rounded-full ${step.dot} opacity-0 group-hover:opacity-20 transition-opacity`}></span>
                      {step.n}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 text-zinc-100">{step.title}</h4>
                      <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative lg:pl-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="rounded-xl p-4 bg-white/5 border border-white/10 overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
              >
                <div className="rounded-[2.2rem] overflow-hidden bg-transparent aspect-video relative group flex items-center justify-center">
                  <AnimatedWaveform />
                </div>
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-80 h-80 bg-primary-dim/20 blur-[100px] rounded-full -z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-black mb-6">Pricing Plans</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">Choose the processing speed and download quota that fits your requirements.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Free Card */}
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest text-[11px] mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹0</span>
              </div>
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
              </ul>
            </div>
            <Link href="/login" className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest text-center border border-white/10 transition-all block">
              Get Started
            </Link>
          </div>

          {/* Starter Card */}
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest text-[11px] mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹19</span>
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ 30 Days</span>
              </div>
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
              </ul>
            </div>
            <Link href="/pricing" className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest text-center border border-white/10 transition-all block">
              Choose Starter
            </Link>
          </div>

          {/* Pro Monthly Card */}
          <div className="glass-panel p-8 rounded-[2rem] border border-primary-dim bg-primary-dim/5 flex flex-col justify-between h-full relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 py-0.5 px-3 rounded-full bg-primary-dim text-white text-[8px] font-black uppercase tracking-widest">
              Most Popular ⭐
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-fixed uppercase tracking-widest text-[11px] mb-2 mt-2">Pro Monthly</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹99</span>
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">/ month</span>
              </div>
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
              </ul>
            </div>
            <Link href="/pricing" className="w-full py-3.5 rounded-xl bg-linear-to-r from-primary-dim to-secondary text-white font-bold text-xs uppercase tracking-widest text-center transition-all block shadow-[0_0_20px_rgba(132,85,239,0.3)]">
              Choose Pro Monthly
            </Link>
          </div>

          {/* Pro Yearly Card */}
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest text-[11px] mb-2">Pro Yearly</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹799</span>
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">/ year</span>
              </div>
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
            <Link href="/pricing" className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest text-center border border-white/10 transition-all block">
              Choose Pro Yearly
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-black mb-6">
            Common Inquiries
          </h2>
          <p className="text-zinc-400 text-lg font-medium">
            Everything you need to know about the extraction process.
          </p>
        </motion.div>
        <div className="space-y-4">
          {[
            { q: "Is there a limit on file size?", a: "We support videos up to 2 hours long for optimal processing quality. For longer content, please reach out to our API support." },
            { q: "What audio formats are supported?", a: "Currently we specialize in high-quality MP3 (up to 320kbps). We are working on adding FLAC and WAV support soon." },
            { q: "Is the service free to use forever?", a: "Yes, QuickMP3 is committed to providing high-quality extraction for free. We sustain our infrastructure through optimized server architecture and minimal overhead." }
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-8 text-left hover:bg-white/5 transition-all group"
              >
                <span className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === idx ? 45 : 0 }}
                  className="material-symbols-outlined text-zinc-500 group-hover:text-primary-dim transition-colors"
                >
                  add
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-zinc-400 text-lg leading-relaxed font-medium border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
