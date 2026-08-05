"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { loginWithGoogleApi } from "../../../../features/conversion/api/conversionApi";
import { useAuth } from "../../../../contexts/AuthContext";
import toast from "react-hot-toast";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const exchangeAttempted = useRef(false);
  const [statusText, setStatusText] = useState("Initializing handshake...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error(`Authentication error: ${error}`);
      router.push("/login");
      return;
    }

    if (!code) {
      setStatusText("Error: No authentication code provided.");
      toast.error("No authorization code found.");
      router.push("/login");
      return;
    }

    if (exchangeAttempted.current) return;
    exchangeAttempted.current = true;

    const performExchange = async () => {
      try {
        setStatusText("Verifying credentials with Google...");
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        
        // Call backend API to exchange code
        const data = await loginWithGoogleApi(code, redirectUri);
        
        setStatusText("Decryption successful. Welcome back!");
        toast.success("Signed in successfully!");
        
        // Log in the user on the frontend
        login(data.accessToken, data.refreshToken, data.user);
        
        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Google OAuth callback error:", err);
        toast.error(err.message || "Google authentication failed");
        router.push("/login");
      }
    };

    performExchange();
  }, [searchParams, router, login]);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[2.3rem] p-10 flex flex-col items-center justify-center space-y-8">
      {/* Spinning Loader */}
      <div className="relative w-16 h-16">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-white/5 border-t-primary-dim border-r-secondary"
        />
        {/* Inner glowing dot */}
        <div className="absolute inset-4 rounded-full bg-zinc-950 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
        </div>
      </div>

      {/* Status Text */}
      <div className="space-y-2 text-center">
        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">
          Authorizing Identity
        </h3>
        <p className="text-xs text-zinc-500 font-medium">
          {statusText}
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="bg-surface text-white font-body min-h-screen selection:bg-primary-dim selection:text-white overflow-x-hidden flex flex-col items-center justify-center p-6 relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[35%] h-[35%] bg-primary-dim/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-secondary/10 blur-[110px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px] text-center">
        {/* Branding */}
        <div className="mb-10">
          <h1 className="text-3xl font-headline font-black tracking-tighter mb-2 text-white uppercase">
            Quick<span className="text-primary-dim">MP3</span>
          </h1>
          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em] opacity-80">
            Secure Entry Chamber
          </p>
        </div>

        {/* Loading Card */}
        <div className="glass-panel p-1 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <Suspense fallback={
            <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[2.3rem] p-10 flex flex-col items-center justify-center space-y-8">
              <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary-dim animate-spin" />
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">Authorizing Identity</h3>
                <p className="text-xs text-zinc-500 font-medium">Initializing secure connection...</p>
              </div>
            </div>
          }>
            <GoogleCallbackHandler />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
