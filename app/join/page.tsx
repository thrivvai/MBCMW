"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StarField } from "@/components/ui/StarField";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { useStudentStore } from "@/stores/student-store";
import type { JoinSessionResponse } from "@/lib/types";

export default function JoinPage() {
  const router = useRouter();
  const setSession = useStudentStore((s) => s.setSession);
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const qCode = url.searchParams.get("code");
    if (qCode && !code) setCode(qCode.toUpperCase());
  }

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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#030507" }}
    >
      <StarField count={80} />
      <CosmicBackground />

      {/* Portal ring — decorative orbit around the form */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(139,92,246,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "orbitSlow 60s linear infinite",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(0,204,216,0.06)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "orbitSlow 40s linear infinite reverse",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full space-y-8"
      >
        {/* Branding */}
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 text-4xl"
            style={{
              background: "radial-gradient(circle, rgba(232,168,32,0.15) 0%, rgba(139,92,246,0.08) 100%)",
              border: "1px solid rgba(232,168,32,0.20)",
              boxShadow: "0 0 40px rgba(232,168,32,0.10), inset 0 0 20px rgba(232,168,32,0.05)",
            }}
          >
            🏙️
          </div>
          <h1
            className="font-display font-extrabold text-4xl mb-2"
            style={{ color: "#E8E4D8" }}
          >
            MathWorld City
          </h1>
          <p style={{ color: "#5A5A6E", fontWeight: 300 }}>
            Enter your class code to join today&apos;s session
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8 space-y-5"
          style={{
            background: "rgba(13,16,32,0.80)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(139,92,246,0.05), 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <Input
            id="join-code"
            label="Class Code"
            placeholder="e.g. MATH42"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-[0.3em] font-bold uppercase"
            autoCapitalize="characters"
            autoComplete="off"
          />

          <Input
            id="nickname"
            label="Your Nickname"
            placeholder="e.g. MathWizard99"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-center"
              style={{ color: "#F87171" }}
            >
              {error}
            </motion.p>
          )}

          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #E8A820, #F5C040 50%, #00CCD8)",
              color: "#030507",
              boxShadow: "0 0 40px rgba(232,168,32,0.20), 0 0 80px rgba(0,204,216,0.08)",
            }}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#030507] border-t-transparent rounded-full animate-spin" />
            ) : (
              "Enter MathWorld City →"
            )}
          </button>
        </div>

        <p className="text-center text-sm" style={{ color: "#2A2A3A" }}>
          No account needed — your teacher&apos;s class code is all you need.
        </p>
      </motion.div>
    </div>
  );
}
