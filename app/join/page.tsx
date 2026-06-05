/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const qCode = url.searchParams.get("code");
    if (qCode && !code) setCode(qCode.toUpperCase());
  }, [code]);

  const handleNext = () => {
    setError("");
    const trimCode = code.trim().toUpperCase();
    const trimNick = nickname.trim();

    if (!trimCode) {
      setError("Enter the battle code from your teacher.");
      return;
    }
    if (trimCode.length !== 6) {
      setError("Battle codes are 6 characters — double-check with your teacher.");
      return;
    }
    if (!trimNick) {
      setError("Pick a nickname so your classmates can find you.");
      return;
    }
    if (trimNick.length < 2) {
      setError("Nickname must be at least 2 characters.");
      return;
    }

    const params = new URLSearchParams({ roomCode: trimCode, nickname: trimNick });
    router.push(`/character?${params.toString()}`);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#0B0C0F]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/60 to-[#0B0C0F]/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        className="relative z-10 max-w-md w-full space-y-10"
      >
        {/* Mark */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
            className="w-14 h-14 mb-8 flex items-center justify-center border border-[#C9A84C]/25"
            style={{ background: "rgba(201,168,76,0.05)" }}
          >
            <div className="w-7 h-7 border border-[#EDE8DC]/40 transform rotate-45" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT_EXPO }}
            className="font-display text-[#EDE8DC] tracking-tight mb-2"
            style={{ fontSize: "clamp(1.9rem, 6vw, 2.8rem)", fontWeight: 700 }}
          >
            Enter the Battle
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[#666360] text-sm font-light tracking-wide"
          >
            Get the code from your teacher
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT_EXPO }}
          className="p-8 sm:p-10 space-y-5 rounded-sm"
          style={{
            background: "rgba(17,19,24,0.80)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          <Input
            id="battle-code"
            label="Battle Code"
            placeholder="e.g. MW4A7K"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-[0.4em] font-medium uppercase h-16"
            autoCapitalize="characters"
            autoComplete="off"
          />

          <Input
            id="nickname"
            label="Your Nickname"
            placeholder="e.g. MathWarlord"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={24}
            className="h-14 text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleNext()}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-center px-4 py-3 rounded-sm text-[#E07070]"
                style={{ background: "rgba(190,70,70,0.08)", border: "1px solid rgba(190,70,70,0.20)" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleNext}
            className="w-full mt-2 py-4 bg-[#EDE8DC] text-[#0B0C0F] font-semibold text-base rounded-sm hover:bg-white active:scale-[0.97] transition-all duration-150 cursor-pointer"
            style={{ minHeight: "52px" }}
          >
            Next — Pick Your Class
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="text-center text-xs font-light tracking-wide text-[#3A3836]"
        >
          No account needed · Code from your teacher
        </motion.p>
      </motion.div>
    </div>
  );
}
