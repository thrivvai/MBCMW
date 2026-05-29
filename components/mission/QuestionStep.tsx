"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { checkAnswer, scoreAnswer } from "@/lib/scoring/engine";
import type { MissionQuestion } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

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

/* SVG icons replacing emoji */
function LightbulbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 2C5 2 3 4 3 6.5c0 1.5.7 2.8 1.8 3.7V12h5.4v-1.8C11.3 9.3 12 8 12 6.5 12 4 10 2 7.5 2Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 12.5h5M5.5 14h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 14L12.5 18L19.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L18 18M18 10L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-[#0B0C0F]">

      {/* Ambient background — slow cosmic drift */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ animation: "cosmicDrift 42s ease-in-out infinite" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "60vw", height: "60vw",
            left: "20%", top: "10%",
            background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "45vw", height: "45vw",
            left: "60%", top: "50%",
            background: "radial-gradient(circle, rgba(106,138,122,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 px-6 py-3.5"
        style={{
          background: "rgba(11,12,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <span className="text-sm shrink-0 font-light" style={{ color: "#666360" }}>
            <span style={{ color: "#9A9694" }}>{questionNumber}</span>
            <span style={{ color: "#3A3836" }}> / {totalQuestions}</span>
          </span>
          <Progress value={progressPct} className="flex-1" />
          <span className="text-sm font-semibold shrink-0 tabular-nums" style={{ color: "#C9A84C" }}>
            {currentScore} pts
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {phase === "answering" ? (
            <motion.div
              key="answering"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="max-w-2xl w-full space-y-4"
            >
              {/* Question card */}
              <div
                className="rounded-sm p-7"
                style={{
                  background: "rgba(17,19,24,0.80)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-5 text-[#666360]"
                >
                  {question.type === "multiple_choice"
                    ? "Choose the best answer"
                    : question.type === "numeric"
                    ? "Enter a number"
                    : "Short response"}
                </p>
                <p className="text-xl leading-relaxed text-[#EDE8DC] font-light">
                  {question.text}
                </p>
              </div>

              {/* Multiple choice */}
              {question.type === "multiple_choice" && question.options && (
                <div className="space-y-2.5">
                  {question.options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setSelected(opt)}
                        className="w-full text-left px-5 py-4 rounded-sm font-medium transition-all duration-200 active:scale-[0.99] cursor-pointer"
                        style={{
                          background: isSelected ? "rgba(201,168,76,0.10)" : "rgba(17,19,24,0.75)",
                          border: `1px solid ${isSelected ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.07)"}`,
                          color: isSelected ? "#EDE8DC" : "#9A9694",
                          backdropFilter: "blur(8px)",
                          minHeight: "52px",
                        }}
                      >
                        {opt}
                      </button>
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
                  <p className="mt-2 text-xs text-[#3A3836] font-light">
                    You can include a $ sign — it will be ignored.
                  </p>
                </div>
              )}

              {/* Short response */}
              {question.type === "short_response" && (
                <textarea
                  className="w-full rounded-sm px-5 py-4 text-sm resize-none focus:outline-none"
                  rows={4}
                  placeholder="Type your answer here…"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  style={{
                    background: "rgba(17,19,24,0.75)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#EDE8DC",
                    caretColor: "#C9A84C",
                    minHeight: "100px",
                  }}
                />
              )}

              {/* Hint */}
              {!hintShown ? (
                <button
                  onClick={() => setHintShown(true)}
                  className="flex items-center gap-2 text-sm transition-colors duration-200 text-[#666360] hover:text-[#C9A84C] cursor-pointer"
                  style={{ minHeight: "44px" }}
                >
                  <LightbulbIcon />
                  <span>Need a hint? <span className="opacity-60">(reduces points to 70%)</span></span>
                </button>
              ) : (
                <div
                  className="flex gap-3 rounded-sm px-5 py-3.5"
                  style={{
                    background: "rgba(201,168,76,0.06)",
                    border: "1px solid rgba(201,168,76,0.18)",
                  }}
                >
                  <span className="text-[#C9A84C] shrink-0 mt-0.5"><LightbulbIcon /></span>
                  <p className="text-sm font-light text-[#C9A84C]/80 leading-relaxed">{question.hint}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: "#EDE8DC",
                  color: "#0B0C0F",
                  minHeight: "52px",
                }}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                    Checking…
                  </span>
                ) : "Submit Answer"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
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
    ? { border: "rgba(74,154,106,0.35)", bg: "rgba(74,154,106,0.07)", text: "#6AC98A", icon: "#6AC98A" }
    : { border: "rgba(190,70,70,0.30)",  bg: "rgba(190,70,70,0.06)",  text: "#D47070", icon: "#D47070" };

  return (
    <div
      className="rounded-sm p-7 space-y-5"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center gap-4">
        <span style={{ color: colors.icon }}>
          {isCorrect ? <CheckIcon /> : <XIcon />}
        </span>
        <div>
          <p className="text-xl font-semibold" style={{ color: colors.text }}>
            {isCorrect ? "Correct!" : canRetry ? "Not quite — try again?" : "Incorrect"}
          </p>
          {isCorrect && (
            <p className="text-sm mt-0.5 text-[#666360] font-light">
              +{pointsEarned} points earned
            </p>
          )}
        </div>
      </div>

      {(isCorrect || !canRetry) && (
        <div
          className="rounded-sm p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.15em] mb-2 font-semibold text-[#3A3836]">
            Explanation
          </p>
          <p className="leading-relaxed text-[#9A9694] font-light text-base">{explanation}</p>
        </div>
      )}

      <div className="flex gap-3">
        {canRetry && !isCorrect ? (
          <button
            onClick={onRetry}
            className="flex-1 py-3.5 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#EDE8DC",
              minHeight: "52px",
            }}
          >
            Try Again
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-40 cursor-pointer"
            style={{
              background: "#EDE8DC",
              color: "#0B0C0F",
              minHeight: "52px",
            }}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
              </span>
            ) : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
