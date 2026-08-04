"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getDownloadHistory, getTransactions } from "../../features/conversion/api/conversionApi";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { PremiumModal } from "../../components/ui/PremiumModal";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const hist = await getDownloadHistory(1, 5);
          setDownloads(hist.downloads || []);
          const txs = await getTransactions();
          setTransactions(txs || []);
        } catch (err: any) {
          console.error("Failed to load dashboard data:", err);
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading || !user) {
    return (
      <div className="bg-surface text-white min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-dim/20 border-t-primary-dim rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full grow space-y-10 z-10 relative">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-10 rounded-[2.5rem] bg-linear-to-r from-primary-dim/10 to-secondary/10 border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-dim/10 blur-[100px] rounded-full -z-10" />
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-black text-white tracking-tight mb-2 italic">
              Hello, {user.name || user.email.split("@")[0]}
            </h1>
            <p className="text-zinc-400 font-medium max-w-xl">
              Welcome back to your QuickMP3 control deck. Configure parameter arrays and initiate audio extraction below.
            </p>
          </div>
          <div className="shrink-0 flex gap-4">
            {user.plan === "free" ? (
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="bg-primary-dim hover:brightness-110 px-6 py-3.5 rounded-2xl text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)]"
              >
                Upgrade Plan
              </button>
            ) : (
              <span className="bg-primary-dim/25 border border-primary-dim/40 px-6 py-3.5 rounded-2xl text-primary-fixed font-black text-sm tracking-wider uppercase text-center block">
                {user.plan.replace("_", " ")} Active
              </span>
            )}
            <Link
              href="/convert"
              className="bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-2xl text-white font-bold text-sm tracking-wider uppercase border border-white/10 flex items-center gap-2 transition-all"
            >
              Convert <span className="material-symbols-outlined text-sm">bolt</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Current Plan",
              value: user.plan.replace("_", " ").toUpperCase(),
              desc: user.plan === "free" ? "Limited lifetime access" : "Premium Tier active",
              icon: "star",
              color: "text-yellow-400",
            },
            {
              title: "Downloads Remaining",
              value: user.plan.includes("pro") ? "UNLIMITED" : user.downloadsRemaining.toString(),
              desc: "Based on your active quota",
              icon: "download",
              color: "text-primary-dim",
            },
            {
              title: "Total Refined",
              value: user.downloadsUsed.toString(),
              desc: "Refined audio signals",
              icon: "verified",
              color: "text-green-400",
            },
            {
              title: "Vault Level",
              value: user.role.toUpperCase(),
              desc: "Your authorization tier",
              icon: "shield_person",
              color: "text-blue-400",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                  {stat.title}
                </span>
                <span className={`material-symbols-outlined ${stat.color} text-lg`}>{stat.icon}</span>
              </div>
              <div>
                <h4 className="text-3xl font-headline font-black text-white tracking-tight mb-1">
                  {stat.value}
                </h4>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Downloads */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-headline font-black text-white italic">Recent Audio Extractions</h3>
              <Link
                href="/profile?tab=downloads"
                className="text-xs text-primary-dim hover:text-violet-400 font-black uppercase tracking-widest transition-all"
              >
                View All
              </Link>
            </div>

            {historyLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : downloads.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <span className="material-symbols-outlined text-zinc-600 text-4xl">headphones_off</span>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No extractions logged</p>
                <Link
                  href="/convert"
                  className="inline-block bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white transition-all"
                >
                  Start First Conversion
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {downloads.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
                  >
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-900 shrink-0 relative">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-full" />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-zinc-700 text-lg">
                          music_note
                        </span>
                      )}
                    </div>
                    <div className="grow min-w-0">
                      <h4 className="text-sm font-bold text-white truncate line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase mt-1">
                        {item.bitrate}kbps · {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary-dim group-hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-zinc-400 group-hover:text-white text-lg">
                        download
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Convert widget & Billing Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Convert Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="text-xl font-headline font-black text-white italic">Quick Transmutation</h3>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                Paste any YouTube URL directly into the field below to launch a background parameter parse sequence.
              </p>
              <Link
                href="/convert"
                className="w-full bg-linear-to-r from-primary-dim to-secondary py-4 rounded-2xl font-headline font-black text-center text-white block transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)] hover:brightness-110 uppercase tracking-widest text-xs"
              >
                Open Chamber
              </Link>
            </div>

            {/* Billing Summary */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-4">
              <h3 className="text-xl font-headline font-black text-white italic">Billing Summary</h3>
              
              {transactions.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No invoices logged</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 2).map((tx, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wider">{tx.plan.replace("_", " ")}</p>
                        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">
                          {tx.invoiceNumber || "Vault Record"}
                        </p>
                      </div>
                      <span className="text-sm font-black text-white">₹{tx.amount / 100}</span>
                    </div>
                  ))}
                  <Link
                    href="/profile?tab=billing"
                    className="text-[10px] text-zinc-500 hover:text-white transition-all font-black uppercase tracking-widest block text-center mt-4"
                  >
                    View Billing History
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
