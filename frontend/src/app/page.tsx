"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleConvert = async () => {
    if (!url) return;
    setStatus("loading");

    // Simulate API call for now since backend is placeholder
    setTimeout(() => {
      // Instead of idle, we redirect to the conversion flow
      router.push("/convert");
    }, 1500);
  };

  // Animation Variants (Simplified for TS)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const glassVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0
    }
  };

  const [openFaq, setOpenFaq] = useState<number | null>(2);

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-dim selection:text-white min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-zinc-950/60 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter text-zinc-100 font-headline uppercase"
          >
            QuickMP3
          </motion.div>
          <div className="hidden md:flex gap-8 items-center font-manrope tracking-tight text-sm font-medium">
            {["Convert", "Features", "FAQ", "Sign Up"].map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Link
                  className={`${idx === 0 ? "text-violet-400 font-semibold" : idx === 3 ? "bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-zinc-100 transition-all border border-white/10" : "text-zinc-400 hover:text-zinc-100"} transition-colors`}
                  href={idx === 0 ? "/convert" : idx === 3 ? "/signup" : `/#${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="w-[100px] md:w-auto h-8 invisible" /> {/* Spacer for balance if needed, but removing toggle */}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden min-h-[850px] flex flex-col items-center justify-center">
        {/* Glows with subtle floating animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] hero-glow pointer-events-none"
        ></motion.div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-dim/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 -right-24 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.span
            variants={itemVariants}
            transition={{ duration: 0.8 }}
            className="inline-block py-1 px-4 mb-6 rounded-full bg-surface-container-high border border-outline-variant/20 text-secondary-fixed text-xs font-semibold tracking-widest uppercase"
          >
            Premium Extraction Chamber
          </motion.span>
          <motion.h1
            variants={itemVariants}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-6 leading-tight"
          >
            Refine Sound from <br />
            <span className="bg-linear-to-r from-primary-dim to-secondary bg-clip-text text-transparent">
              Digital Signal
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            transition={{ duration: 0.8 }}
            className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium"
          >
            Convert YouTube videos to high-quality MP3 instantly. Pure audio,
            zero noise, ultimate precision.
          </motion.p>

          {/* Conversion Hub */}
          <motion.div
            variants={glassVariants}
            transition={{ duration: 1 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="glass-panel p-2 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row gap-2 shadow-2xl overflow-hidden group focus-within:border-primary-dim/40 transition-colors">
              <div className="grow flex items-center px-6 py-4">
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
              </div>
              <motion.button
                whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConvert}
                className="bg-linear-to-r from-primary-dim to-secondary transition-all duration-300 px-8 py-4 rounded-xl text-on-primary-container font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(132,85,239,0.3)] min-w-[200px]"
              >
                <AnimatePresence mode="wait">
                  {status === "loading" ? (
                    <motion.div
                      key="loading"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    ></motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      className="flex items-center gap-2"
                    >
                      <span>Convert to MP3</span>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        bolt
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-xs text-on-surface-variant/60 font-medium uppercase tracking-widest">
              {[
                { icon: "check_circle", text: "320kbps Support" },
                { icon: "check_circle", text: "No Account Needed" },
                { icon: "check_circle", text: "Cloud Secure" }
              ].map((pill, idx) => (
                <motion.span
                  key={idx}
                  variants={itemVariants}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {pill.icon}
                  </span>{" "}
                  {pill.text}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Features Section: Bento Style */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "speed",
              color: "primary-dim",
              title: "Fast Conversion",
              desc: "Our high-end extraction servers process your requests in milliseconds, ensuring you spend less time waiting and more time listening."
            },
            {
              icon: "high_quality",
              color: "secondary",
              title: "High Quality Audio",
              desc: "Extract crystal clear audio at up to 320kbps. We maintain the original acoustic fidelity of every source video."
            },
            {
              icon: "all_inclusive",
              color: "tertiary",
              title: "Unlimited Downloads",
              desc: "No daily caps or subscription gates. Convert as many tracks as your library requires without ever hitting a paywall."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`group bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 hover:border-primary-dim/30 transition-all duration-500`}
            >
              <div className="w-14 h-14 bg-primary-dim/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary-dim text-3xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works: Timeline */}
      <section className="py-24 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-8"
              >
                The Alchemy <br />
                Process
              </motion.h2>
              <div className="space-y-12 relative">
                <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-linear-to-b from-primary-dim via-secondary to-tertiary opacity-20"></div>

                {[
                  { n: 1, title: "Paste URL", color: "text-primary-dim", text: "Copy the YouTube link and drop it into our refined extraction chamber." },
                  { n: 2, title: "Convert", color: "text-secondary", text: "Our engine parses the signal and extracts the highest quality audio stream available." },
                  { n: 3, title: "Download", color: "text-tertiary", text: "Save your new MP3 file directly to your device. Instant and seamless." }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex gap-8 relative z-10"
                  >
                    <div className={`w-14 h-14 shrink-0 bg-surface-container-highest border border-outline-variant/20 rounded-full flex items-center justify-center font-headline font-bold text-xl ${step.color}`}>
                      {step.n}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-on-surface-variant">
                        {step.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                viewport={{ once: true }}
                className="rounded-2xl transform-gpu overflow-hidden bg-black"
              >
                <Image
                  src="/sound-waves.webp"
                  alt="Abstract dark visual representation of sound waves"
                  width={800}
                  height={400}
                  className="w-full h-[400px] object-cover mix-blend-screen"
                />
              </motion.div>
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary-dim/20 blur-3xl rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-headline font-extrabold mb-4">
            Common Inquiries
          </h2>
          <p className="text-on-surface-variant">
            Everything you need to know about the extraction process.
          </p>
        </motion.div>
        <div className="space-y-4">
          {[
            { q: "Is there a limit on file size?", a: "We support videos up to 2 hours long for optimal processing quality." },
            { q: "What audio formats are supported?", a: "Currently we specialize in high-quality MP3 (up to 320kbps)." },
            { q: "Is the service free to use forever?", a: "Yes, QuickMP3 is committed to providing high-quality extraction for free. We sustain our infrastructure through optimized server architecture and minimal overhead." }
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-panel border border-outline-variant/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="text-lg font-bold">{faq.q}</span>
                <span className="material-symbols-outlined text-outline group-hover:text-primary-dim transition-colors">
                  {openFaq === idx ? "remove" : "add"}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 w-full py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-6">
          <div className="font-inter text-xs uppercase tracking-widest text-zinc-500">
            © 2024 QuickMP3. High-end extraction.
          </div>
          <div className="flex gap-8 font-inter text-xs uppercase tracking-widest">
            {["Privacy", "Terms", "API", "Github"].map((item) => (
              <a
                key={item}
                className="text-zinc-500 hover:text-violet-400 transition-colors opacity-80 hover:opacity-100"
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
