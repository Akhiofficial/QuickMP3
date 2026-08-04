"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAdminStats,
  getAdminUsers,
  getAdminTransactions,
  getAdminDownloads,
} from "../../features/conversion/api/conversionApi";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else if (user?.role !== "admin") {
        toast.error("Unauthorized entry");
        window.location.href = "/dashboard";
      }
    }
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const fetchAdminData = async () => {
        try {
          const statsData = await getAdminStats();
          setStats(statsData);

          const usersRes = await getAdminUsers(1, 10);
          setUsers(usersRes.users || []);

          const txsRes = await getAdminTransactions(1, 10);
          setTransactions(txsRes.transactions || []);

          const downloadsRes = await getAdminDownloads(1, 10);
          setDownloads(downloadsRes.downloads || []);
        } catch (err: any) {
          console.error("Failed to load admin panel data:", err);
          toast.error("Failed to sync backend metrics");
        } finally {
          setAdminLoading(false);
        }
      };
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  if (isLoading || adminLoading || !stats) {
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

  // Dummy chart data representing split and volume
  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Premium", value: stats.premiumUsers },
    { name: "Free", value: stats.freeUsers },
    { name: "Refined", value: stats.totalDownloads },
  ];

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full z-10 relative grow space-y-10">
        {/* Header */}
        <div>
          <span className="inline-flex items-center gap-2 py-1 px-4 mb-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Admin Clearance Required
          </span>
          <h1 className="text-3xl md:text-5xl font-headline font-black text-white tracking-tight italic">
            Command Center Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Users", value: stats.totalUsers, desc: "Global registered agents", icon: "group" },
            { title: "Premium Users", value: stats.premiumUsers, desc: "Active premium channels", icon: "verified" },
            { title: "Audio Downloads", value: stats.totalDownloads, desc: "Total extractions completed", icon: "download" },
            { title: "Gross Revenue", value: `₹${stats.totalRevenue}`, desc: "Calculated invoice payments", icon: "payments" },
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{stat.title}</span>
                <span className="material-symbols-outlined text-zinc-500 text-lg">{stat.icon}</span>
              </div>
              <div>
                <h4 className="text-3xl font-headline font-black text-white tracking-tight mb-1">{stat.value}</h4>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart View */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6">
          <h3 className="text-xl font-headline font-black text-white italic">Signal Metrics Growth Array</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8455ef" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34b5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#565556" fontSize={11} tickLine={false} />
                <YAxis stroke="#565556" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1a191b",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#8455ef" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6 overflow-hidden">
            <h3 className="text-lg font-headline font-black text-white italic">Recent Registrations</h3>
            <div className="space-y-4">
              {users.map((u, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="min-w-0 grow">
                    <p className="text-sm font-bold text-white truncate">{u.name || u.email.split("@")[0]}</p>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{u.email}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-md shrink-0">
                    {u.plan}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6 overflow-hidden">
            <h3 className="text-lg font-headline font-black text-white italic">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.map((tx, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="min-w-0 grow">
                    <p className="text-sm font-bold text-white truncate">
                      {tx.userId?.name || tx.userId?.email || "Agent"}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      {tx.invoiceNumber || "QMP3-PAID"}
                    </p>
                  </div>
                  <span className="text-sm font-black text-white shrink-0">₹{tx.amount / 100}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Downloads */}
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6 overflow-hidden">
            <h3 className="text-lg font-headline font-black text-white italic">Recent Downloads</h3>
            <div className="space-y-4">
              {downloads.map((dl, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="min-w-0 grow">
                    <p className="text-sm font-bold text-white truncate line-clamp-1">{dl.title}</p>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      {dl.userId?.name || dl.userId?.email || "Agent"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-600 text-sm shrink-0">download</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
