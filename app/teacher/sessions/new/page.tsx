"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MISSION_CATALOG } from "@/lib/utils";
import type { GradeBand } from "@/lib/types";

const GRADE_BANDS: { value: GradeBand; label: string; desc: string }[] = [
  { value: "4-5", label: "Grades 4–5", desc: "Foundations: budgeting, price comparison, basic arithmetic" },
  { value: "6-8", label: "Grades 6–8", desc: "Applied Math: percentages, interest, profit & loss" },
  { value: "9-12", label: "Grades 9–12", desc: "Financial Strategy: credit, investing, income" },
];

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
        body: JSON.stringify({
          gradeBand,
          missionIds: selectedMissions,
        }),
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl font-black text-white">New Classroom Session</h1>
        <p className="text-gray-400 text-sm mt-1">
          Set up a session and you&apos;ll get a 6-letter code your students can use to join.
        </p>
      </div>

      {/* Grade band selection */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-300">Select Grade Band</p>
        {GRADE_BANDS.map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => {
              setGradeBand(value);
              setSelectedMissions([]);
            }}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
              gradeBand === value
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-city-border bg-city-card hover:border-indigo-500/40"
            }`}
          >
            <p className="text-white font-semibold">{label}</p>
            <p className="text-gray-400 text-sm">{desc}</p>
          </button>
        ))}
      </div>

      {/* Mission selection */}
      {gradeBand && availableMissions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-300">Choose Missions</p>
            <p className="text-xs text-gray-500">Leave all unchecked to assign all available missions</p>
          </div>
          {availableMissions.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleMission(m.id)}
              className={`w-full text-left px-5 py-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                selectedMissions.includes(m.id)
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-city-border bg-city-card hover:border-indigo-500/40"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedMissions.includes(m.id)
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-gray-500"
                }`}
              >
                {selectedMissions.includes(m.id) && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-white font-medium">{m.title}</span>
            </button>
          ))}
        </div>
      )}

      {gradeBand && availableMissions.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4">
          <p className="text-amber-300 text-sm">
            No missions are available for this grade band yet. More are coming soon!
          </p>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button
        size="lg"
        onClick={handleCreate}
        loading={loading}
        disabled={!gradeBand}
        className="w-full"
      >
        Create Session & Get Join Code
      </Button>
    </motion.div>
  );
}
