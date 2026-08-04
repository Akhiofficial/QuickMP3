"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const logoutToast = toast.loading("Disconnecting link...");
    try {
      await logout();
      toast.success("Disconnected successfully", { id: logoutToast });
    } catch {
      toast.error("Logout request failed", { id: logoutToast });
    }
  };

  return (
    <nav className="bg-zinc-950/60 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter text-zinc-100 font-headline uppercase"
        >
          <Link href="/">
            Quick<span className="text-primary-dim">MP3</span>
          </Link>
        </motion.div>

        <div className="flex gap-6 md:gap-8 items-center font-manrope tracking-tight text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Profile
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="text-red-400 hover:text-red-300 font-bold transition-colors">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-zinc-100 transition-all border border-white/10 text-xs font-bold uppercase tracking-wider"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/#features" className="text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:inline">
                Features
              </Link>
              <Link href="/#faq" className="text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:inline">
                FAQ
              </Link>
              <Link href="/pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-primary-dim hover:brightness-110 px-4 py-2 rounded-lg text-white transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)] text-xs font-bold uppercase tracking-wider"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
