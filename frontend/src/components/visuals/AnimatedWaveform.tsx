"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnimatedWaveform = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* Realistic Fluid Wave Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <WaveLayer 
          color="#8455EF" // primary-dim
          duration={3} 
          amplitude={40} 
          frequency={0.02} 
          opacity={0.6}
        />
        <WaveLayer 
          color="#4B8CFF" // secondary blue
          duration={5} 
          amplitude={30} 
          frequency={0.015} 
          opacity={0.4}
          delay={1}
        />
        <WaveLayer 
          color="#F42BE2" // tertiary fuchsia
          duration={7} 
          amplitude={50} 
          frequency={0.01} 
          opacity={0.3}
          delay={2}
        />
      </div>

      {/* Sub-glow effect - centered and subtle */}
      <div className="absolute w-64 h-64 blur-[70px] rounded-full pointer-events-none"></div>
      
      {/* Decorative center line */}
      <div className="absolute w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent top-1/2 -translate-y-1/2"></div>
    </div>
  );
};

interface WaveLayerProps {
  color: string;
  duration: number;
  amplitude: number;
  frequency: number;
  opacity: number;
  delay?: number;
}

const WaveLayer = ({ color, duration, amplitude, frequency, opacity, delay = 0 }: WaveLayerProps) => {
  // We use a simplified path with few control points for smooth curves
  return (
    <motion.svg
      viewBox="0 0 1000 200"
      className="absolute inset-0 w-full h-full overflow-visible"
      preserveAspectRatio="none"
    >
      {/* Main Wave Path */}
      <motion.path
        animate={{
          d: [
            "M 0 100 Q 250 60 500 100 T 1000 100",
            "M 0 100 Q 250 140 500 100 T 1000 100",
            "M 0 100 Q 250 60 500 100 T 1000 100",
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ opacity }}
        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
      />
      
      {/* Blurred "Shadow" Wave for extra depth */}
      <motion.path
        animate={{
          d: [
            "M 0 100 Q 250 60 500 100 T 1000 100",
            "M 0 100 Q 250 140 500 100 T 1000 100",
            "M 0 100 Q 250 60 500 100 T 1000 100",
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        style={{ opacity: opacity * 0.3, filter: "blur(8px)" }}
      />
    </motion.svg>
  );
};
