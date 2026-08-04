"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getDownloadHistory, getTransactions } from "../../features/conversion/api/conversionApi";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

type TabType = "downloads" | "billing" | "settings";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("downloads");
  const [downloads, setDownloads] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
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
          const hist = await getDownloadHistory(1, 20);
          setDownloads(hist.downloads || []);
          const txs = await getTransactions();
          setTransactions(txs || []);
        } catch (err) {
          console.error("Profile data load error:", err);
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    const logoutToast = toast.loading("Disconnecting link...");
    try {
      await logout();
      toast.success("Disconnected successfully", { id: logoutToast });
    } catch {
      toast.error("Logout request failed", { id: logoutToast });
    }
  };

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

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 w-full grow z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-primary-dim to-secondary" />

              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-white/10 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || ""} className="object-cover w-full h-full" />
                ) : (
                  <span className="material-symbols-outlined text-zinc-500 text-4xl">person</span>
                )}
              </div>

              {/* Basic Info */}
              <h2 className="text-xl font-headline font-black text-white italic">
                {user.name || user.email.split("@")[0]}
              </h2>
              <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mt-1 mb-6">
                {user.email}
              </p>

              {/* Badges */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-xl text-xs font-semibold border border-white/5">
                  <span className="text-zinc-500 uppercase tracking-wider">Access Token</span>
                  <span className="text-white font-black uppercase tracking-wider">{user.plan.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-xl text-xs font-semibold border border-white/5">
                  <span className="text-zinc-500 uppercase tracking-wider">Auth Status</span>
                  <span className="text-green-400 font-black uppercase tracking-wider">{user.subscriptionStatus.toUpperCase()}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest border border-red-500/20 transition-all"
              >
                Disconnect Identity
              </button>
            </div>
          </div>

          {/* Profile Tab Panel */}
          <div className="lg:col-span-8 glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-8 flex flex-col justify-between">
            {/* Tab Headers */}
            <div className="flex border-b border-white/5 pb-4 gap-6 text-sm font-bold uppercase tracking-widest">
              {[
                { key: "downloads", label: "Downloads" },
                { key: "billing", label: "Billing" },
                { key: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`pb-2 relative transition-all ${
                    activeTab === tab.key ? "text-primary-dim font-black" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-dim"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grow min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "downloads" && (
                  <motion.div
                    key="downloads"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-headline font-black text-white italic mb-4">Download Log History</h3>
                    {historyLoading ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                      </div>
                    ) : downloads.length === 0 ? (
                      <div className="text-center py-20 text-zinc-500 uppercase tracking-widest text-xs font-bold">
                        No downloads recorded in this session.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {downloads.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all"
                          >
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-950 shrink-0 relative">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-full" />
                              ) : (
                                <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-zinc-700">
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
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary-dim hover:text-white transition-all"
                            >
                              <span className="material-symbols-outlined text-zinc-400 hover:text-white text-lg">
                                download
                              </span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "billing" && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-headline font-black text-white italic mb-4">Billing History Invoices</h3>
                    {historyLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-20 text-zinc-500 uppercase tracking-widest text-xs font-bold">
                        No transactions recorded in this session.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                              <th className="pb-4">Invoice ID</th>
                              <th className="pb-4">Plan</th>
                              <th className="pb-4">Amount</th>
                              <th className="pb-4">Date</th>
                              <th className="pb-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((tx, idx) => (
                              <tr key={idx} className="border-b border-white/5 text-sm font-semibold text-zinc-300">
                                <td className="py-4 font-mono text-xs">{tx.invoiceNumber || "QMP3-CRTD"}</td>
                                <td className="py-4 text-white uppercase tracking-wider text-xs">
                                  {tx.plan.replace("_", " ")}
                                </td>
                                <td className="py-4 text-white">₹{tx.amount / 100}</td>
                                <td className="py-4 text-zinc-500 text-xs">
                                  {new Date(tx.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      tx.status === "paid"
                                        ? "bg-green-500/10 text-green-400 border border-green-500/25"
                                        : "bg-zinc-500/10 text-zinc-500 border border-white/5"
                                    }`}
                                  >
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-headline font-black text-white italic mb-4">Account Settings</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
                          Account Email
                        </label>
                        <input
                          disabled
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-zinc-500 outline-none"
                          value={user.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
                          Account Level
                        </label>
                        <input
                          disabled
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-zinc-500 outline-none"
                          value={user.role.toUpperCase()}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
