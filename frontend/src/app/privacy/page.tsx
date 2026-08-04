"use client";

import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-20 w-full z-10 relative space-y-8">
        <h1 className="text-3xl md:text-5xl font-headline font-black text-white tracking-tight italic">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest border-b border-white/5 pb-4">
          Latest Update: August 2026
        </p>

        <div className="space-y-6 text-zinc-400 font-medium leading-relaxed">
          <p>
            QuickMP3 values the confidentiality and parameters of your metadata. This privacy contract explains how we handle identity variables, telemetry, and payment verification parameters.
          </p>

          <h3 className="text-lg font-bold text-white mt-8">1. Credentials Arrays Collection</h3>
          <p>
            We collect your email, encrypted passwords, and name to create your unique digital identity in our database. We do not store Google OAuth passwords, as those parameters are handled entirely through Google's APIs.
          </p>

          <h3 className="text-lg font-bold text-white mt-8">2. Transmutation Stream Telemetry</h3>
          <p>
            Conversions processed through the QuickMP3 engine use external RapidAPI routes to isolate media layers. No permanent local storage logs of converted MP3 payloads are preserved on our servers after client-side download completion.
          </p>

          <h3 className="text-lg font-bold text-white mt-8">3. Billing Data Secure Protocols</h3>
          <p>
            All payment orders, validation checks, and invoice generations are routed through Razorpay Secure Socket Layers. We do not capture nor log physical credit card details.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
