"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    router.refresh();
  };

  return (
    <nav className="bg-zinc-950/60 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter text-zinc-100 font-headline uppercase"
        >
          <Link href="/">Quick<span className="text-primary-dim">MP3</span></Link>
        </motion.div>
        
        <div className="hidden md:flex gap-8 items-center font-manrope tracking-tight text-sm font-medium">
          {["Features", "FAQ", isLoggedIn ? "Logout" : "Sign Up"].map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              {item === "Logout" ? (
                <button
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-zinc-100 transition-all border border-white/10"
                >
                  Logout
                </button>
              ) : (
                <Link
                  className={`${idx === 2 ? "bg-primary-dim hover:brightness-110 px-4 py-2 rounded-lg text-white transition-all shadow-[0_0_20px_rgba(132,85,239,0.3)]" : "text-zinc-400 hover:text-zinc-100"} transition-colors`}
                  href={idx === 2 ? "/signup" : `/#${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
};
