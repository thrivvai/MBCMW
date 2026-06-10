"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { usePlayerStore } from "@/stores/player-store";
import type { SafeBattleQuestion, LeaderboardPlayer, CharacterClass } from "@/lib/types";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const CLASS_COLORS: Record<CharacterClass, string> = {
  speedster: "#C9A84C",
  tactician: "#6A8A7A",
  berserker: "#BE6060",
  scholar: "#8A7AAA",
};

type BattlePhase =
  | "waiting"
  | "question"
  | "answered"
  | "reveal"
  | "leaderboard";

interface AnswerResult {
  isCorrect: boolean;
  finalScore: number;
  correctAnswer: string;
  explanation: string;
  abilityTriggered: string | null;
}

export default function BattlePage() {
  const { roomId } = useParams() as { roomId: string };
  const router = useRouter();
  const player = usePlayerStore();

  const [phase, setPhase] = useState<BattlePhase>("waiting");
  const [currentQuestion, setCurrentQuestion] = useState<SafeBattleQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selected, setSelected] = useState("");
  const [numericInput, setNumericInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [allQuestions, setAllQuestions] = useState<SafeBattleQuestion[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/leaderboard`);
    if (!res.ok) return;
    const data = await res.json();
    setLeaderboard(data.leaderboard ?? []);
    const me = data.leaderboard?.find((p: LeaderboardPlayer) => p.playerId === player.playerId);
    if (me) {
      setTotalScore(me.totalScore);
      setStreak(me.currentStreak);
    }
  }, [roomId, player.playerId]);

  const fetchRoomState = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/players`);
    if (!res.ok) return;
    const data = await res.json();
    const room = data.room;

    if (room.status === "ended") {
      router.replace(`/battle/${roomId}/results`);
      return;
    }

    if (room.status === "question_open" && room.currentQuestionIndex !== questionIndex) {
      setQuestionIndex(room.currentQuestionIndex);
    }

    if (room.status === "question_closed" && phase !== "leaderboard" && phase !== "reveal") {
      fetchLeaderboard();
      setPhase("reveal");
    }
  }, [roomId, questionIndex, phase, router, fetchLeaderboard]);

  // Load question set once
  useEffect(() => {
    const loadQuestions = async () => {
      const res = await fetch(`/api/rooms/${roomId}/players`);
      if (!res.ok) return;
    };
    loadQuestions();
  }, [roomId]);

  // When questionIndex changes, load the question
  useEffect(() => {
    if (questionIndex < 0) return;

    const loadQuestion = async () => {
      const res = await fetch(`/api/rooms/${roomId}/question-set`);
      if (res.ok) {
        const data = await res.json();
        const qs: SafeBattleQuestion[] = data.questions ?? [];
        setAllQuestions(qs);
        const q = qs[questionIndex];
        if (q) {
          setCurrentQuestion(q);
          setSelected("");
          setNumericInput("");
          setAnswerResult(null);
          setPhase("question");
          setQuestionStartedAt(Date.now());
          setTimeRemaining(q.timeLimitSeconds);
        }
      }
    };
    loadQuestion();
  }, [questionIndex, roomId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "question") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - questionStartedAt) / 1000;
      const remaining = Math.max(0, (currentQuestion?.timeLimitSeconds ?? 20) - elapsed);
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Time's up — auto-submit as unanswered
        if (phase === "question") {
          setPhase("answered");
        }
      }
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, questionStartedAt, currentQuestion]);

  // Realtime
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`battle-${roomId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "battle_rooms", filter: `id=eq.${roomId}` },
        () => fetchRoomState()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_scores", filter: `room_id=eq.${roomId}` },
        () => fetchLeaderboard()
      )
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [roomId, fetchRoomState, fetchLeaderboard]);

  useEffect(() => {
    fetchRoomState();
  }, [fetchRoomState]);

  const handleSubmit = async () => {
    if (submitting || !currentQuestion) return;
    const answer = currentQuestion.type === "numeric" ? numericInput : selected;
    if (!answer.trim()) return;

    setSubmitting(true);
    const timeRemainingMs = Math.max(0, Math.round(timeRemaining * 1000));

    try {
      const res = await fetch(`/api/rooms/${roomId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: player.playerId,
          questionIndex,
          answer: answer.trim(),
          timeRemainingMs,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Already answered or question closed
        setPhase("answered");
        return;
      }

      setAnswerResult(data);
      setTotalScore((prev) => prev + data.finalScore);
      if (data.isCorrect) setStreak((s) => s + 1);
      else setStreak(0);
      setPhase("answered");
    } catch {
      setPhase("answered");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = allQuestions.length > 0
    ? ((questionIndex + 1) / allQuestions.length) * 100
    : 0;
  const timerPct = currentQuestion ? (timeRemaining / currentQuestion.timeLimitSeconds) * 100 : 100;
  const timerColor = timerPct > 50 ? "#4A9A6A" : timerPct > 25 ? "#C9A84C" : "#BE4646";
  const currentAnswer = currentQuestion?.type === "numeric" ? numericInput : selected;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0B0C0F] relative overflow-hidden">

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            width: "60vw", height: "60vw",
            left: "20%", top: "5%",
            background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 px-4 py-3"
        style={{
          background: "rgba(11,12,15,0.90)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Progress */}
          <div className="flex-1 h-px relative" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="absolute inset-y-0 left-0 transition-all duration-500"
              style={{ width: `${progressPct}%`, background: "#C9A84C" }}
            />
          </div>

          {/* Question counter */}
          {questionIndex >= 0 && allQuestions.length > 0 && (
            <span className="text-xs text-[#666360] font-light shrink-0 tabular-nums">
              <span className="text-[#9A9694]">{questionIndex + 1}</span>
              <span className="text-[#3A3836]"> / {allQuestions.length}</span>
            </span>
          )}

          {/* Score + streak */}
          <div className="flex items-center gap-3 shrink-0">
            {streak >= 2 && (
              <span className="text-xs font-semibold text-[#C9A84C]">
                {streak}x streak
              </span>
            )}
            <span className="text-sm font-semibold tabular-nums text-[#C9A84C]">
              {totalScore} pts
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">

            {/* WAITING state */}
            {phase === "waiting" && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#3A3836]"
                      style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
                    />
                  ))}
                </div>
                <p className="text-[#666360] font-light text-sm">
                  Get ready — first question coming up
                </p>
              </motion.div>
            )}

            {/* QUESTION state */}
            {(phase === "question" || phase === "answered") && currentQuestion && (
              <motion.div
                key={`q-${questionIndex}`}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                className="space-y-4"
              >
                {/* Timer bar */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full transition-all duration-100"
                    style={{
                      width: `${timerPct}%`,
                      background: timerColor,
                      transition: "width 0.1s linear, background-color 0.5s ease",
                    }}
                  />
                </div>

                {/* Timer number + locked state */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-bold tabular-nums font-display"
                    style={{ color: timerColor }}
                  >
                    {Math.ceil(timeRemaining)}
                  </span>
                  {phase === "answered" && (
                    <span className="text-xs text-[#4A9A6A] font-semibold uppercase tracking-wider">
                      Answer locked in
                    </span>
                  )}
                </div>

                {/* Question card */}
                <div
                  className="rounded-sm p-7"
                  style={{
                    background: "rgba(17,19,24,0.85)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-5 text-[#3A3836]">
                    {currentQuestion.type === "multiple_choice" ? "Choose one" : "Enter a number"}
                  </p>
                  <p className="text-xl leading-relaxed text-[#EDE8DC] font-light">
                    {currentQuestion.text}
                  </p>
                </div>

                {/* Multiple choice */}
                {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = selected === opt;
                      const isLocked = phase === "answered";
                      return (
                        <button
                          key={opt}
                          onClick={() => { if (!isLocked) setSelected(opt); }}
                          className="w-full text-left px-5 py-4 rounded-sm font-medium transition-all duration-200 active:scale-[0.99]"
                          style={{
                            background: isSelected ? "rgba(201,168,76,0.10)" : "rgba(17,19,24,0.75)",
                            border: `1px solid ${isSelected ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.07)"}`,
                            color: isSelected ? "#EDE8DC" : "#9A9694",
                            backdropFilter: "blur(8px)",
                            minHeight: "52px",
                            cursor: isLocked ? "default" : "pointer",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Numeric */}
                {currentQuestion.type === "numeric" && (
                  <div>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Type your answer…"
                      value={numericInput}
                      onChange={(e) => { if (phase !== "answered") setNumericInput(e.target.value); }}
                      disabled={phase === "answered"}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="w-full px-5 py-4 rounded-sm text-lg font-medium focus:outline-none disabled:opacity-60"
                      style={{
                        background: "rgba(17,19,24,0.80)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "#EDE8DC",
                        caretColor: "#C9A84C",
                        minHeight: "56px",
                      }}
                    />
                  </div>
                )}

                {/* Submit */}
                {phase === "question" && (
                  <button
                    onClick={handleSubmit}
                    disabled={!currentAnswer.trim() || submitting}
                    className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    style={{ background: "#EDE8DC", color: "#0B0C0F", minHeight: "52px" }}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-[#0B0C0F]/30 border-t-[#0B0C0F] rounded-full animate-spin" />
                        Locking in…
                      </span>
                    ) : "Lock In Answer"}
                  </button>
                )}

                {/* Waiting for reveal */}
                {phase === "answered" && (
                  <div className="text-center py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#4A9A6A]"
                          style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
                        />
                      ))}
                      <span className="ml-2 text-xs text-[#666360] font-light">
                        Waiting for all players…
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* REVEAL state */}
            {phase === "reveal" && answerResult && currentQuestion && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="space-y-4"
              >
                <RevealCard result={answerResult} />
                <button
                  onClick={() => setPhase("leaderboard")}
                  className="w-full py-4 rounded-sm font-semibold text-base transition-all duration-150 active:scale-[0.97] cursor-pointer"
                  style={{ background: "#EDE8DC", color: "#0B0C0F", minHeight: "52px" }}
                >
                  See Leaderboard
                </button>
              </motion.div>
            )}

            {/* LEADERBOARD state */}
            {phase === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="space-y-3"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#3A3836] font-semibold text-center mb-4">
                  Standings after Question {questionIndex + 1}
                </p>
                {leaderboard.slice(0, 10).map((p, i) => (
                  <LeaderboardRow
                    key={p.playerId}
                    rank={i + 1}
                    player={p}
                    isMe={p.playerId === player.playerId}
                  />
                ))}
                <p className="text-center text-xs text-[#3A3836] font-light pt-2">
                  Next question loading…
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RevealCard({ result }: { result: AnswerResult }) {
  const colors = result.isCorrect
    ? { border: "rgba(74,154,106,0.35)", bg: "rgba(74,154,106,0.07)", text: "#6AC98A" }
    : { border: "rgba(190,70,70,0.30)", bg: "rgba(190,70,70,0.06)", text: "#D47070" };

  return (
    <div
      className="rounded-sm p-7 space-y-5"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5" style={{ color: colors.text }}>
          {result.isCorrect ? <CheckCircle /> : <XCircle />}
        </div>
        <div>
          <p className="text-xl font-semibold" style={{ color: colors.text }}>
            {result.isCorrect ? "Correct!" : "Incorrect"}
          </p>
          {result.isCorrect && (
            <p className="text-sm mt-0.5 text-[#666360] font-light">
              +{result.finalScore} points
              {result.abilityTriggered === "berserker_rage" && " (RAGE DOUBLE!)"}
              {result.abilityTriggered === "scholar_bonus" && " (+50 Scholar bonus)"}
            </p>
          )}
          {!result.isCorrect && (
            <p className="text-sm mt-0.5 text-[#666360] font-light">
              Correct answer: <span className="text-[#EDE8DC]">{result.correctAnswer}</span>
            </p>
          )}
        </div>
      </div>

      <div
        className="rounded-sm p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-[10px] uppercase tracking-[0.15em] mb-2 font-semibold text-[#3A3836]">
          Explanation
        </p>
        <p className="leading-relaxed text-[#9A9694] font-light text-sm">{result.explanation}</p>
      </div>
    </div>
  );
}

function LeaderboardRow({
  rank,
  player,
  isMe,
}: {
  rank: number;
  player: LeaderboardPlayer;
  isMe: boolean;
}) {
  const classColor = CLASS_COLORS[player.characterClass] ?? "#666360";
  const medalColor =
    rank === 1 ? "#C9A84C" : rank === 2 ? "#9A9694" : rank === 3 ? "#8A6B3A" : "#3A3836";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.04, duration: 0.3, ease: EASE_OUT_EXPO }}
      className="flex items-center gap-3 px-4 py-3 rounded-sm"
      style={{
        background: isMe ? "rgba(201,168,76,0.06)" : "rgba(17,19,24,0.60)",
        border: `1px solid ${isMe ? "rgba(201,168,76,0.20)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <span
        className="w-6 text-center text-sm font-bold tabular-nums shrink-0 font-display"
        style={{ color: medalColor }}
      >
        {rank}
      </span>
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
        style={{
          background: classColor + "20",
          border: `1px solid ${classColor}35`,
          color: classColor,
        }}
      >
        {player.characterName.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#EDE8DC] truncate">
          {player.characterName}
          {isMe && <span className="ml-2 text-[10px] text-[#C9A84C] font-semibold uppercase tracking-wider">you</span>}
        </p>
        <p className="text-xs text-[#3A3836] font-light">
          {player.questionsCorrect} correct
          {player.currentStreak >= 2 && (
            <span className="ml-2 text-[#C9A84C]">{player.currentStreak}x streak</span>
          )}
        </p>
      </div>
      <span className="text-sm font-bold tabular-nums text-[#C9A84C] shrink-0">
        {player.totalScore.toLocaleString()}
      </span>
    </motion.div>
  );
}

function CheckCircle() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 14L12.5 18L19.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XCircle() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L18 18M18 10L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
