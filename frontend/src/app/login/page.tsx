"use client";

import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-surface text-white font-body min-h-screen selection:bg-primary-dim/30 overflow-x-hidden flex flex-col items-center justify-center p-6 sm:p-8">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-radial-[circle_at_center,var(--color-primary-dim)_0%,transparent_70%] opacity-[0.05]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-bold tracking-tighter mb-1 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
            QuickMP3
          </h1>
          <p className="text-on-surface-variant font-medium text-sm tracking-tight opacity-80">Fast. Simple. High Quality.</p>
        </div>

        {/* Login Container with Gradient Border */}
        <div className="relative p-px rounded-[32px] overflow-hidden shadow-2xl">
          {/* Gradient Border Mask */}
          <div className="absolute inset-0 bg-linear-to-b from-primary via-secondary to-secondary" />
          
          <div className="relative bg-surface-container-low rounded-[31px] p-8 sm:p-10">
            <h2 className="text-2xl font-headline font-bold mb-8 tracking-tight">Log In</h2>
            
            <form className="space-y-6">
              <div className="space-y-4">
                {/* Email Address */}
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-700 transition-all outline-none" 
                      id="email" 
                      placeholder="john@alchemy.io" 
                      type="email"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-600">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="password">Password</label>
                    <Link href="/forgot-password" className="text-[10px] text-primary-dim hover:underline font-bold uppercase tracking-widest">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <input 
                      className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-800 focus:border-zinc-700 transition-all outline-none" 
                      id="password" 
                      placeholder="••••••••" 
                      type="password"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-600">
                      <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button 
                className="w-full bg-linear-to-r from-primary-dim to-secondary py-3.5 rounded-2xl font-bold text-center text-[#131214] border-none hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider text-xs" 
                type="submit"
              >
                Log In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 flex items-center justify-center">
              <div className="absolute w-full border-t border-zinc-800/50"></div>
              <span className="relative px-3 bg-surface-container-low text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 z-10">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-zinc-900/40 border border-zinc-800/50 py-3 rounded-2xl hover:bg-zinc-800/40 transition-all cursor-pointer group">
                <img alt="Google" className="w-4 h-4 grayscale group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX5_-XtqI3PWjdj4oX9fmcMP3CJWv2QVZmNwK_fnKir4r49a9w1YX6MDjCCUEV7MF19yXYTiBpNenIXB9-z-ccQqMbxXe5upubvSrZhH-QV4dLKkjU1quwNsD3mBmezjgnvWYkQoTiNiVqEaEI7OqS5t9RQfnitJ8MXpkWZiGdx3bw4Ln9hXbl4Yw9kvyiKABszfa9ml2k6DhzUgVSWxPgd6ZCuVpbjLsaKwlF4nMHbteVS1MGG0gUMAXJfJ8VjpmRBMnZtugQtc8" />
                <span className="text-xs font-bold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-zinc-900/40 border border-zinc-800/50 py-3 rounded-2xl hover:bg-zinc-800/40 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-indigo-400 text-lg">forum</span>
                <span className="text-xs font-bold">Discord</span>
              </button>
            </div>

            {/* Signup Footer */}
            <div className="mt-8 text-center text-[12px] font-medium">
              <span className="text-zinc-500">Don't have an account?</span>
              <Link className="text-secondary hover:underline ml-1.5" href="/signup">Sign Up</Link>
            </div>
          </div>
        </div>

        {/* Outer Footer */}
        <p className="text-center mt-8 text-[10px] text-zinc-600 font-medium">
          © 2024 QuickMP3. Fast. Simple. High Quality.
        </p>
      </div>
    </div>
  );
}
