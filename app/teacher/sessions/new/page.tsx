"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MISSION_CATALOG } from "@/lib/utils";
import type { GradeBand } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const GRADE_BANDS: { value: GradeBand; label: string; desc: string }[] = [
  { value: "4-5",  label: "Grades 4–5",  desc: "Budgets, spending choices, saving basics" },
  { value: "6-8",  label: "Grades 6–8",  desc: "Percentages, taxes, profit and loss" },
  { value: "9-12", label: "Grades 9–12", desc: "Credit, investing, income strategy" },
];

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NewSessionPage() {
  const router = useRouter();
  const [gradeBand, setGradeBand] = useState<GradeBand | "">("");
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableMissions = gradeBand ? MISSION_CATALOG[gradeBand] ?? [] : [];

  const toggleMission = (id: string) =>
    setSelectedMissions((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleCreate = async () => {
    if (!gradeBand) {
      setError("Please select a grade band.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradeBand, missionIds: selectedMissions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create session.");
        return;
      }
      router.push(`/teacher/sessions/${data.sessionId}`);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      className="max-w-2xl mx-auto space-y-8 py-4"
    >
      <div>
        <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
          New Classroom Session
        </h1>
        <p className="text-[#666360] text-sm mt-1 font-light">
          Pick a grade level and you&apos;ll get a join code your students can use instantly.
        </p>
      </div>

      {/* Grade band selection */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-[#9A9694] uppercase tracking-[0.15em]">
          Select Grade Band
        </p>
        {GRADE_BANDS.map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => { setGradeBand(value); setSelectedMissions([]); }}
            className={`w-full text-left px-5 py-4 rounded-sm border transition-all duration-150 cursor-pointer ${
              gradeBand === value
                ? "border-[#C9A84C]/50 bg-[#C9A84C]/08"
                : "border-white/8 bg-[#111318] hover:border-white/16"
            }`}
            style={{ minHeight: "68px" }}
          >
            <p className="text-[#EDE8DC] font-semibold text-sm">{label}</p>
            <p className="text-[#666360] text-xs mt-0.5 font-light">{desc}</p>
          </button>
        ))}
      </div>

      {/* Mission selection */}
      {gradeBand && availableMissions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#9A9694] uppercase tracking-[0.15em]">Choose Missions</p>
            <p className="text-xs text-[#3A3836] font-light">Leave all unchecked to include everything</p>
          </div>
          {availableMissions.map((m) => {
            const isSelected = selectedMissions.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMission(m.id)}
                className={`w-full text-left px-5 py-3.5 rounded-sm border transition-all duration-150 flex items-center gap-3.5 cursor-pointer ${
                  isSelected
                    ? "border-[#C9A84C]/40 bg-[#C9A84C]/06"
                    : "border-white/8 bg-[#111318] hover:border-white/16"
                }`}
                style={{ minHeight: "52px" }}
              >
                <div
                  className="w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    border: `1px solid ${isSelected ? "#C9A84C" : "rgba(255,255,255,0.15)"}`,
                    background: isSelected ? "#C9A84C" : "transparent",
                    color: isSelected ? "#0B0C0F" : "transparent",
                  }}
                >
                  <CheckIcon />
                </div>
                <span className="text-[#EDE8DC] font-medium text-sm">{m.title}</span>
              </button>
            );
          })}
        </motion.div>
      )}

      {gradeBand && availableMissions.length === 0 && (
        <div
          className="rounded-sm px-5 py-4 border border-[#C9A84C]/18"
          style={{ background: "rgba(201,168,76,0.05)" }}
        >
          <p className="text-[#C9A84C]/80 text-sm font-light">
            No missions available for this grade band yet. More are coming soon.
          </p>
        </div>
      )}

      {error && (
        <p className="text-[#D47070] text-sm font-light">{error}</p>
      )}

      <Button size="lg" onClick={handleCreate} loading={loading} disabled={!gradeBand} className="w-full">
        Create Session &amp; Get Join Code
      </Button>
    </motion.div>
  );
}
