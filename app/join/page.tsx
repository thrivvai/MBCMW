/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useStudentStore } from "@/stores/student-store";
import type { JoinSessionResponse } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function JoinPage() {
  const router = useRouter();
  const setSession = useStudentStore((s) => s.setSession);
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const qCode = url.searchParams.get("code");
    if (qCode && !code) setCode(qCode.toUpperCase());
  }, [code]);

  const handleJoin = async () => {
    setError("");
    if (!code.trim() || !nickname.trim()) {
      setError("Please enter both your class code and a nickname.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode: code.trim(), nickname: nickname.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      const session = data as JoinSessionResponse;
      setSession({
        studentId: session.studentId,
        sessionId: session.sessionId,
        sessionCode: code.trim().toUpperCase(),
        nickname: nickname.trim(),
        gradeBand: session.gradeBand,
        assignedMissions: session.assignedMissions,
      });
      router.push("/student/city");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#0B0C0F]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Earth from orbit against deep space"
          className="w-full h-full object-cover object-center opacity-28 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/50 to-[#0B0C0F]/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        className="relative z-10 max-w-md w-full space-y-10"
      >
        {/* Mark / Logo */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
            className="w-14 h-14 mb-8 flex items-center justify-center border border-[#C9A84C]/25 bg-[#C9A84C]/05"
          >
            {/* Abstract diamond mark */}
            <div className="w-7 h-7 border border-[#EDE8DC]/40 transform rotate-45" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: EASE_OUT_EXPO }}
            className="font-display text-[#EDE8DC] tracking-tight mb-2"
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 700 }}
          >
            Join Session
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-[#666360] text-sm font-light tracking-wide"
          >
            Enter the code your teacher provided
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT_EXPO }}
          className="p-8 sm:p-10 space-y-5 glass rounded-sm"
        >
          <Input
            id="join-code"
            label="Class Code"
            placeholder="e.g. RE-774"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-[0.4em] font-medium uppercase h-16"
            autoCapitalize="characters"
            autoComplete="off"
          />

          <Input
            id="nickname"
            label="Nickname"
            placeholder="e.g. Researcher_01"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
            className="h-14 text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-center px-4 py-3 bg-state-error-bg text-[#E07070] rounded-sm border border-state-error/25"
            >
              {error}
            </motion.p>
          )}

          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full mt-2 py-4 bg-[#EDE8DC] text-[#0B0C0F] font-semibold text-base rounded-sm hover:bg-white active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ minHeight: "52px" }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                Joining…
              </span>
            ) : "Join Class"}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="text-center text-xs font-light tracking-wide text-[#3A3836]"
        >
          No account needed · Code provided by your teacher
        </motion.p>
      </motion.div>
    </div>
  );
}
