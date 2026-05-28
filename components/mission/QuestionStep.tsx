"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { checkAnswer, scoreAnswer } from "@/lib/scoring/engine";
import type { MissionQuestion } from "@/lib/types";

interface Props {
  question: MissionQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentScore: number;
  onAnswered: (record: {
    answer: string;
    isCorrect: boolean;
    hintUsed: boolean;
    retryCount: number;
    pointsEarned: number;
    timeSpentSeconds: number;
  }) => Promise<void>;
}

type PhaseType = "answering" | "feedback";

export function QuestionStep({
  question,
  questionNumber,
  totalQuestions,
  currentScore,
  onAnswered,
}: Props) {
  const [selected, setSelected] = useState<string>("");
  const [numericInput, setNumericInput] = useState("");
  const [hintShown, setHintShown] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [phase, setPhase] = useState<PhaseType>("answering");
  const [isCorrect, setIsCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const currentAnswer = question.type === "numeric" ? numericInput : selected;
  const canSubmit = currentAnswer.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const correct = checkAnswer(question, currentAnswer);
    const points = scoreAnswer(question, correct, hintShown, retryCount);

    if (!correct && retryCount < 1) {
      setRetryCount((r) => r + 1);
      setPhase("feedback");
      setIsCorrect(false);
      setPointsEarned(0);
      setSubmitting(false);
      return;
    }

    setIsCorrect(correct);
    setPointsEarned(points);
    setPhase("feedback");

    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    await onAnswered({
      answer: currentAnswer,
      isCorrect: correct,
      hintUsed: hintShown,
      retryCount,
      pointsEarned: points,
      timeSpentSeconds: elapsed,
    });
    setSubmitting(false);
  }, [canSubmit, submitting, question, currentAnswer, hintShown, retryCount, startedAt, onAnswered]);

  const handleRetry = () => {
    setPhase("answering");
    setSelected("");
    setNumericInput("");
  };

  const progressPct = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "#030507" }}
    >
      {/* Slow-drifting cosmic bg for "in motion" feel */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ animation: "cosmicDrift 40s ease-in-out infinite" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "60vw",
            height: "60vw",
            left: "20%",
            top: "10%",
            background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "45vw",
            height: "45vw",
            left: "55%",
            top: "50%",
            background: "radial-gradient(circle, rgba(0,204,216,0.04) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Header bar */}
      <div
        className="sticky top-0 z-10 px-6 py-4"
        style={{
          background: "rgba(3,5,7,0.80)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <span className="text-sm shrink-0" style={{ color: "#5A5A6E" }}>
            {questionNumber} <span style={{ color: "#2A2A3A" }}>of</span> {totalQuestions}
          </span>
          <Progress value={progressPct} className="flex-1" />
          <span className="text-sm font-bold shrink-0" style={{ color: "#E8A820" }}>
            {currentScore} pts
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {phase === "answering" ? (
            <motion.div
              key="answering"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl w-full space-y-5"
            >
              {/* Question card — glassmorphism */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: "rgba(13,16,32,0.75)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 0 60px rgba(139,92,246,0.06), 0 24px 48px rgba(0,0,0,0.5)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em] mb-5"
                  style={{ color: "#8B5CF6" }}
                >
                  {question.type === "multiple_choice"
                    ? "Choose the best answer"
                    : question.type === "numeric"
                    ? "Enter a number"
                    : "Short response"}
                </p>
                <p
                  className="text-xl leading-relaxed"
                  style={{ color: "#E8E4D8", fontWeight: 400 }}
                >
                  {question.text}
                </p>
              </div>

              {/* Multiple choice */}
              {question.type === "multiple_choice" && question.options && (
                <div className="space-y-3">
                  {question.options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => setSelected(opt)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full text-left px-5 py-4 rounded-xl font-medium transition-all duration-200"
                        style={{
                          background: isSelected
                            ? "rgba(139,92,246,0.15)"
                            : "rgba(13,16,32,0.70)",
                          border: `1px solid ${isSelected ? "rgba(139,92,246,0.50)" : "rgba(255,255,255,0.06)"}`,
                          color: isSelected ? "#E8E4D8" : "#9A9AB0",
                          backdropFilter: "blur(8px)",
                          boxShadow: isSelected ? "0 0 20px rgba(139,92,246,0.12), inset 0 0 20px rgba(139,92,246,0.06)" : "none",
                        }}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Numeric */}
              {question.type === "numeric" && (
                <div>
                  <Input
                    label="Your answer"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 24.05"
                    value={numericInput}
                    onChange={(e) => setNumericInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <p className="mt-2 text-xs" style={{ color: "#2A2A3A" }}>
                    You can include a $ sign — it will be ignored.
                  </p>
                </div>
              )}

              {/* Short response */}
              {question.type === "short_response" && (
                <textarea
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1"
                  rows={4}
                  placeholder="Type your answer here…"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  style={{
                    background: "rgba(13,16,32,0.70)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#E8E4D8",
                    caretColor: "#8B5CF6",
                  }}
                />
              )}

              {/* Hint */}
              {!hintShown ? (
                <button
                  onClick={() => setHintShown(true)}
                  className="text-sm transition-colors"
                  style={{ color: "rgba(232,168,32,0.5)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8A820")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,168,32,0.5)")}
                >
                  💡 Need a hint? (reduces points to 70%)
                </button>
              ) : (
                <div
                  className="flex gap-3 rounded-xl px-5 py-3"
                  style={{
                    background: "rgba(232,168,32,0.08)",
                    border: "1px solid rgba(232,168,32,0.20)",
                  }}
                >
                  <span className="text-amber-400">💡</span>
                  <p className="text-sm" style={{ color: "#D4B060" }}>{question.hint}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
                  color: "#E8E4D8",
                  boxShadow: "0 0 30px rgba(109,40,217,0.25)",
                }}
              >
                {submitting ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  "Submit Answer"
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl w-full"
            >
              <Feedback
                isCorrect={isCorrect}
                pointsEarned={pointsEarned}
                explanation={question.explanation}
                canRetry={!isCorrect && retryCount <= 1}
                onRetry={handleRetry}
                onNext={handleSubmit}
                submitting={submitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Feedback({
  isCorrect,
  pointsEarned,
  explanation,
  canRetry,
  onRetry,
  onNext,
  submitting,
}: {
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
  canRetry: boolean;
  onRetry: () => void;
  onNext: () => Promise<void>;
  submitting: boolean;
}) {
  const colors = isCorrect
    ? { border: "rgba(16,185,129,0.40)", bg: "rgba(16,185,129,0.08)", text: "#34D399", glow: "rgba(16,185,129,0.15)" }
    : { border: "rgba(239,68,68,0.35)",  bg: "rgba(239,68,68,0.07)",  text: "#F87171", glow: "rgba(239,68,68,0.10)" };

  return (
    <div
      className="rounded-2xl p-8 space-y-6"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        backdropFilter: "blur(16px)",
        boxShadow: `0 0 60px ${colors.glow}`,
      }}
    >
      <div className="flex items-center gap-4">
        <span className="text-5xl">{isCorrect ? "✅" : "❌"}</span>
        <div>
          <p className="text-2xl font-bold" style={{ color: colors.text }}>
            {isCorrect ? "Correct!" : canRetry ? "Not quite — try again?" : "Incorrect"}
          </p>
          {isCorrect && (
            <p className="text-sm mt-0.5" style={{ color: "#5A5A6E" }}>
              +{pointsEarned} points earned
            </p>
          )}
        </div>
      </div>

      {(isCorrect || !canRetry) && (
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs uppercase tracking-[0.15em] mb-2 font-semibold" style={{ color: "#5A5A6E" }}>
            Explanation
          </p>
          <p className="leading-relaxed" style={{ color: "#D4D0C8", fontWeight: 300 }}>{explanation}</p>
        </div>
      )}

      <div className="flex gap-3">
        {canRetry && !isCorrect ? (
          <Button variant="secondary" size="lg" onClick={onRetry} className="flex-1">
            Try Again
          </Button>
        ) : (
          <button
            onClick={onNext}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
              color: "#E8E4D8",
              boxShadow: "0 0 30px rgba(109,40,217,0.20)",
            }}
          >
            {submitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              "Next →"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
