"use client";

import { useState } from "react";
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

  // Pre-fill code from ?code= query param (teacher copy-link feature).
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
    <div className="min-h-screen bg-city-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo / branding */}
        <div className="text-center">
          <div className="inline-block text-5xl mb-4">🏙️</div>
          <h1 className="text-3xl font-black text-white">MathWorld Classroom</h1>
          <p className="text-gray-400 mt-2">Enter your class code to join today's session</p>
        </div>

        <div className="bg-city-card border border-city-border rounded-2xl p-8 space-y-5">
          <Input
            id="join-code"
            label="Class Code"
            placeholder="e.g. MATH42"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-widest font-bold uppercase"
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
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            size="lg"
            onClick={handleJoin}
            loading={loading}
            className="w-full"
          >
            Enter MathWorld City →
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          No account needed — your teacher's class code is all you need.
        </p>
      </motion.div>
    </div>
  );
}
