"use client";

import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-20 w-full z-10 relative space-y-8">
        <h1 className="text-3xl md:text-5xl font-headline font-black text-white tracking-tight italic">
          Terms of Service
        </h1>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest border-b border-white/5 pb-4">
          Latest Update: August 2026
        </p>

        <div className="space-y-6 text-zinc-400 font-medium leading-relaxed">
          <p>
            By entering the QuickMP3 extraction chamber, you agree to comply with the terms, protocols, and usage arrays documented in this contract.
          </p>

          <h3 className="text-lg font-bold text-white mt-8">1. License & Usage Parameters</h3>
          <p>
            QuickMP3 provides metadata extraction algorithms for informational, personal use only. Users are responsible for confirming the license parameters of YouTube streams processed.
          </p>

          <h3 className="text-lg font-bold text-white mt-8">2. Quota Parameters & Plan Subscriptions</h3>
          <p>
            Free plans permit 3 lifetime downloads. STARTER and PRO plans permit higher limits as configured in our payment index. Quotas may not be shared across multi-account channels.
          </p>

          <h3 className="text-lg font-bold text-white mt-8">3. Platform Abuse Restrictions</h3>
          <p>
            Abuse of RapidAPI coordinates, scraping dashboard arrays, or violating the fair usage limits of 300 extractions/month on Pro plans will terminate your digital identity immediately.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
