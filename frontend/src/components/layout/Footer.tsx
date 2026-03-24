"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-black w-full py-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-px h-full bg-linear-to-b from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-white/10 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        <div className="max-w-sm">
          <div className="text-2xl font-headline font-black tracking-tighter text-white uppercase mb-6">
            Quick<span className="text-primary-dim">MP3</span>
          </div>
          <p className="text-zinc-500 font-medium leading-relaxed mb-8">
            The world's most refined digital extraction chamber. High-fidelity audio, converted instantly.
          </p>
          <div className="font-inter text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
            © 2027 QuickMP3 Studio. All rights reserved.
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4">
              {["Features", "API", "Mobile"].map(item => (
                <li key={item}>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors font-medium">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4">
              {["Privacy", "Terms", "Cookies", "License"].map(item => (
                <li key={item}>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors font-medium">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Connect</h4>
            <div className="flex gap-6">
              {["Github", "Twitter", "Email"].map(item => (
                <a key={item} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all group">
                  <span className="material-symbols-outlined text-sm">{item === "Email" ? "mail" : "link"}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
