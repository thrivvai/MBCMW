"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface QuestionSet {
  id: string;
  title: string;
  grade_band: string | null;
  question_count: number;
}

export default function NewRoomPage() {
  const router = useRouter();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [mode, setMode] = useState<"individual" | "team">("individual");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      const res = await fetch("/api/question-sets");
      if (res.ok) {
        const data = await res.json();
        setQuestionSets(data.questionSets ?? []);
        if (data.questionSets?.[0]) setSelectedSet(data.questionSets[0].id);
      }
      setLoading(false);
    };
    fetchSets();
  }, []);

  const handleCreate = async () => {
    if (!selectedSet) {
      setError("Select a question set.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionSetId: selectedSet, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create room.");
        return;
      }
      router.push(`/teacher/rooms/${data.roomId}`);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      >
        <h1 className="font-display text-2xl text-[#EDE8DC] font-[600] tracking-tight">
          Create Battle Room
        </h1>
        <p className="text-[#666360] text-sm mt-1 font-light">
          Pick a question set and launch your class into battle.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-2 border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE_OUT_EXPO }}
          className="space-y-6"
        >
          {/* Question set selection */}
          <div
            className="rounded-sm p-6 space-y-4"
            style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm font-semibold text-[#EDE8DC]">Question Set</p>
            <div className="space-y-2">
              {questionSets.map((qs) => {
                const isSelected = selectedSet === qs.id;
                return (
                  <button
                    key={qs.id}
                    onClick={() => setSelectedSet(qs.id)}
                    className="w-full text-left px-4 py-4 rounded-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
                    style={{
                      background: isSelected ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#EDE8DC]">{qs.title}</p>
                        <p className="text-xs text-[#666360] font-light mt-0.5">
                          {qs.question_count} questions
                          {qs.grade_band && ` · Grade ${qs.grade_band}`}
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "#C9A84C" }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 3" stroke="#0B0C0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
              {questionSets.length === 0 && (
                <p className="text-sm text-[#3A3836] font-light text-center py-4">
                  No question sets found. Run the seed SQL in Supabase first.
                </p>
              )}
            </div>
          </div>

          {/* Mode selection */}
          <div
            className="rounded-sm p-6 space-y-4"
            style={{ background: "rgba(17,19,24,0.80)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm font-semibold text-[#EDE8DC]">Battle Mode</p>
            <div className="grid grid-cols-2 gap-3">
              {(["individual", "team"] as const).map((m) => {
                const isSelected = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="px-4 py-4 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: isSelected ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`,
                      color: isSelected ? "#EDE8DC" : "#666360",
                    }}
                  >
                    {m === "individual" ? "Individual" : "Team vs Team"}
                    <p className="text-xs mt-1 font-light" style={{ color: isSelected ? "#9A9694" : "#3A3836" }}>
                      {m === "individual" ? "Every player for themselves" : "Assign students to teams"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p
              className="text-sm text-center px-4 py-3 rounded-sm text-[#E07070]"
              style={{ background: "rgba(190,70,70,0.08)", border: "1px solid rgba(190,70,70,0.20)" }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleCreate}
            disabled={creating || !selectedSet}
            className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: "#EDE8DC", color: "#0B0C0F", minHeight: "52px" }}
          >
            {creating ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                Creating room…
              </span>
            ) : "Create Room"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
