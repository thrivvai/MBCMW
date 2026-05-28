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

  const currentAnswer =
    question.type === "numeric" ? numericInput : selected;

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
    <div className="min-h-screen bg-city-bg flex flex-col">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-city-bg/80 backdrop-blur-sm border-b border-city-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <span className="text-sm text-gray-400 shrink-0">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Progress value={progressPct} className="flex-1" />
          <span className="text-sm font-bold text-indigo-400 shrink-0">
            {currentScore} pts
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === "answering" ? (
            <motion.div
              key="answering"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl w-full space-y-6"
            >
              {/* Question card */}
              <div className="bg-city-card border border-city-border rounded-2xl p-8">
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-4">
                  {question.type === "multiple_choice"
                    ? "Choose the best answer"
                    : question.type === "numeric"
                    ? "Enter a number"
                    : "Short response"}
                </p>
                <p className="text-white text-xl font-medium leading-relaxed">
                  {question.text}
                </p>
              </div>

              {/* Answer area */}
              {question.type === "multiple_choice" && question.options && (
                <div className="space-y-3">
                  {question.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelected(opt)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        selected === opt
                          ? "border-indigo-500 bg-indigo-500/15 text-white"
                          : "border-city-border bg-city-card text-gray-300 hover:border-indigo-500/50 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

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
                  <p className="mt-1.5 text-xs text-gray-500">
                    You can include a $ sign — it will be ignored.
                  </p>
                </div>
              )}

              {question.type === "short_response" && (
                <textarea
                  className="w-full bg-city-bg border border-city-border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={4}
                  placeholder="Type your answer here…"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                />
              )}

              {/* Hint */}
              {!hintShown ? (
                <button
                  onClick={() => setHintShown(true)}
                  className="text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
                >
                  💡 Need a hint? (reduces points to 70%)
                </button>
              ) : (
                <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3">
                  <span className="text-amber-400">💡</span>
                  <p className="text-amber-200 text-sm">{question.hint}</p>
                </div>
              )}

              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit}
                loading={submitting}
                className="w-full"
              >
                Submit Answer
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
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
  return (
    <div className={`rounded-2xl border-2 p-8 space-y-6 ${
      isCorrect
        ? "bg-emerald-900/20 border-emerald-500/50"
        : "bg-red-900/20 border-red-500/50"
    }`}>
      <div className="flex items-center gap-4">
        <span className="text-5xl">{isCorrect ? "✅" : "❌"}</span>
        <div>
          <p className={`text-2xl font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
            {isCorrect ? "Correct!" : canRetry ? "Not quite — try again?" : "Incorrect"}
          </p>
          {isCorrect && (
            <p className="text-gray-300 text-sm">+{pointsEarned} points earned</p>
          )}
        </div>
      </div>

      {(isCorrect || !canRetry) && (
        <div className="bg-white/5 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Explanation</p>
          <p className="text-gray-200 leading-relaxed">{explanation}</p>
        </div>
      )}

      <div className="flex gap-3">
        {canRetry && !isCorrect ? (
          <Button variant="secondary" size="lg" onClick={onRetry} className="flex-1">
            Try Again
          </Button>
        ) : (
          <Button size="lg" onClick={onNext} loading={submitting} className="flex-1">
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
