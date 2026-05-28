/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "@/stores/student-store";
import type { JoinSessionResponse } from "@/lib/types";

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#010101]">

      {/* Photorealistic space background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/40 to-[#010101]/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full space-y-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-8 border border-[#D4AF37]/30 bg-black/40"
          >
            <div className="w-10 h-10 border border-[#F0F0F0]/50 transform rotate-45" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-display font-medium text-4xl sm:text-5xl mb-3 tracking-tight text-[#F0F0F0]"
          >
            Student Login
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#888888] text-sm font-light tracking-widest uppercase"
          >
            Enter your class session
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="p-8 sm:p-12 space-y-6 relative rounded-sm glass"
          style={{ perspective: 1000 }}
        >
          <Input
            id="join-code"
            label="Class Code"
            placeholder="e.g. RE-774"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-[0.4em] font-medium uppercase bg-[#020202] text-[#F0F0F0] h-16 border-white/10"
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
            className="bg-[#020202] h-14 text-lg border-white/10 text-[#F0F0F0]"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-center font-medium px-4 py-3 bg-[#1A1010] text-[#D45555] rounded-sm border border-[#D45555]/30"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={handleJoin}
            disabled={loading}
            size="lg"
            className="w-full mt-4 py-6 bg-[#F0F0F0] text-[#010101] hover:bg-white rounded-sm font-semibold tracking-wide"
          >
            {loading ? "Joining..." : "Join Class"}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs font-light tracking-widest uppercase text-[#555555]"
        >
          No account needed · Join code provided by your teacher
        </motion.p>
      </motion.div>
    </div>
  );
}
